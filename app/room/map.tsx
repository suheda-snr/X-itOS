import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Animated, PanResponder, Pressable, Text, Button, Image, Modal, ScrollView, ImageBackground, FlatList, Switch } from "react-native";
import Svg, { Rect, Circle, Text as SvgText, Line, Polygon } from "react-native-svg";
import { Alert } from "react-native";
import { doc, updateDoc, collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useCompanyStore } from '@/stateStore/companyStore';
import { useGameStore } from '@/stateStore/gameStore';
import { startGameAndBooking, endGameAndUpdate } from '@/api/gameApi';
import { formatTime } from "@/utils/formatTime";

interface Hint {
  message: string;
  isShared: boolean;
}

interface Stage {
  pieces?: Record<string, {
    type: string;
    isInteracted: boolean;
    [key: string]: any;
  }>;
  actions?: {
    action: string;
    description: string;
    isActivated: boolean;
  };
  interacted_sensor?: string;
  hints?: Record<string, Hint>;
  image_url?: string;
}

interface Puzzle {
  id: string;
  description: string;
  isSolved: boolean;
  solution: string;
  stages: Record<string, Stage>;
}

interface Sensor {
  name: string;
  id: string;
  type: string;
  isActive: boolean;
}

interface ChangeLogEntry {
  timestamp: string;
  type: 'puzzle' | 'sensor';
  id: string;
  changes: Record<string, any>;
}

interface HintRequest {
  puzzleId: string;
  stageId: string;
  state: string;
}

const Map: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const puzzlesRef = useRef<Puzzle[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<Array<NodeJS.Timeout | Function>>([]);
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [isChangeLogVisible, setIsChangeLogVisible] = useState(false);
  const { companyData, selectedRoomForGame } = useCompanyStore();
  const { setIsGameSet, setGameData, setBookingDetails, gameData } = useGameStore();

  const [timeRemaining, setTimeRemaining] = useState<number>(
    selectedRoomForGame?.duration ? selectedRoomForGame.duration * 60 : 0
  );

  useEffect(() => {
    puzzlesRef.current = puzzles;
  }, [puzzles]);

  useEffect(() => {
    if (gameStarted && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            showAlertDialog({
              title: "Time's Up!",
              message: "The game couldn't be completed in time.",
            });
            setGameStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      timerRef.current.push(interval);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || !gameData?.id || !selectedRoomForGame?.id) {
      console.log('Cannot end game:', {
        gameStarted,
        gameId: gameData?.id,
        roomId: selectedRoomForGame?.id,
        timeRemaining,
      });
      return;
    }

    const puzzle9 = puzzles.find((p) => p.id === 'puzzle_9');
    const isPuzzle9Solved = puzzle9?.isSolved;
    const mainDoorSensor = sensors.find((s) => s.id === 'main_door');
    const isMainDoorClosed = !mainDoorSensor?.isActive;

    console.log('Game Status:', {
      isPuzzle9Solved,
      isMainDoorClosed,
      puzzle9Id: puzzle9?.id,
      mainDoorSensorId: mainDoorSensor?.id,
      timeRemaining,
    });

    // Timer for decrementing timeRemaining
    let interval: NodeJS.Timeout | null = null;
    if (gameStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            console.log('Ending game due to time up');
            endGameAndUpdate(gameData.id, selectedRoomForGame.id)
              .then((updatedGame) => {
                setGameStarted(false);
                setTimeRemaining(0);
              })
              .catch((error) => {
                console.error('Error ending game:', error);
                showAlertDialog({
                  title: 'Error',
                  message: `Failed to end the game: ${error.message || 'Unknown error'}.`,
                });
              });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      timerRef.current.push(interval);
    }

    // Check game-ending conditions for puzzle_9
    if (isPuzzle9Solved && isMainDoorClosed) {
      console.log('Ending game due to puzzle_9 solved and main door closed');
      endGameAndUpdate(gameData.id, selectedRoomForGame.id)
        .then((updatedGame) => {
          setGameStarted(false);
          setTimeRemaining(0);
          showAlertDialog({
            title: 'Game Ended',
            message: 'Game is completed successfully by the team!',
          });
          // Clean up timers
          timerRef.current.forEach((item) => {
            if (typeof item === 'function') {
              item();
            } else {
              clearInterval(item);
            }
          });
          timerRef.current = [];
        })
        .catch((error) => {
          console.error('Error ending game:', error);
          showAlertDialog({
            title: 'Error',
            message: `Failed to end the game: ${error.message || 'Unknown error'}. Please try again.`,
          });
        });
    }

    // Cleanup
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [puzzles, sensors, gameStarted, gameData, selectedRoomForGame, timeRemaining]);

  useEffect(() => {
    const puzzlesUnsubscribe = onSnapshot(collection(db, "puzzles"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          setChangeLog(prev => [...prev, {
            timestamp: new Date().toISOString(),
            type: 'puzzle',
            id: change.doc.id,
            changes: change.doc.data()
          }]);
        }
      });

      const puzzlesData = snapshot.docs.map((docSnapshot) => {
        const puzzle: Puzzle = {
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<Puzzle, "id" | "stages">),
          stages: {},
        };

        const stagesUnsubscribe = onSnapshot(
          collection(docSnapshot.ref, "stages"),
          (stagesSnapshot) => {
            const stages: Record<string, Stage> = {};
            stagesSnapshot.docs.forEach((stageDoc) => {
              stages[stageDoc.id] = { ...(stageDoc.data() as Stage), hints: {} };

              const hintsUnsubscribe = onSnapshot(
                collection(stageDoc.ref, "hints"),
                (hintsSnapshot) => {
                  const hints: Record<string, Hint> = {};
                  hintsSnapshot.forEach((hintDoc) => {
                    hints[hintDoc.id] = hintDoc.data() as Hint;
                  });
                  stages[stageDoc.id].hints = hints;

                  setPuzzles((prevPuzzles) =>
                    prevPuzzles.map((p) =>
                      p.id === puzzle.id ? { ...p, stages: { ...stages } } : p
                    )
                  );
                }
              );

              if (!timerRef.current.some((t) => t === hintsUnsubscribe)) {
                timerRef.current.push(hintsUnsubscribe);
              }
            });

            setPuzzles((prevPuzzles) => {
              const existingPuzzle = prevPuzzles.find((p) => p.id === puzzle.id);
              if (!existingPuzzle) {
                return [...prevPuzzles, { ...puzzle, stages }];
              }
              return prevPuzzles.map((p) =>
                p.id === puzzle.id ? { ...p, stages: { ...stages } } : p
              );
            });
          }
        );

        if (!timerRef.current.some((t) => t === stagesUnsubscribe)) {
          timerRef.current.push(stagesUnsubscribe);
        }

        return puzzle;
      });

      setPuzzles(puzzlesData);
    });

    const sensorsUnsubscribe = onSnapshot(collection(db, "sensors"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          setChangeLog(prev => [...prev, {
            timestamp: new Date().toISOString(),
            type: 'sensor',
            id: change.doc.id,
            changes: change.doc.data()
          }]);
        }
      });

      const sensorsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Sensor, "id">),
      }));
      setSensors(sensorsData);
    });

    return () => {
      puzzlesUnsubscribe();
      sensorsUnsubscribe();
      timerRef.current.forEach((item) => {
        if (typeof item === "function") {
          item();
        } else {
          clearTimeout(item);
        }
      });
      timerRef.current = [];
    };
  }, []);

  useEffect(() => {
    const hintRequestsRef = doc(db, "hintRequests", "requests");
  
    const unsubscribe = onSnapshot(hintRequestsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const pendingEntries = Object.entries(data).filter(
          ([_, request]: [string, any]) => request.state === "pending"
        );
  
        pendingEntries.forEach(([key, request]) => {
          Alert.alert(
            "Hint Request",
            `A hint request has been made for puzzle ${request.puzzleId} in stage ${request.stageId}.`,
            [
              {
                text: "Decline",
                onPress: async () => {
                  await updateDoc(hintRequestsRef, {
                    [`${key}.state`]: "declined"
                  });
                },
                style: "cancel",
              },
              {
                text: "Approve",
                onPress: async () => {
                  await updateDoc(hintRequestsRef, {
                    [`${key}.state`]: "approved"
                  });

                  const hintsCollectionRef = collection(
                    db,
                    "puzzles",
                    request.puzzleId,
                    "stages",
                    request.stageId,
                    "hints"
                  );

                  const hintDocsSnap = await getDocs(hintsCollectionRef);

                  const updatePromises = hintDocsSnap.docs.map((docSnap) =>
                    updateDoc(docSnap.ref, { isShared: true })
                  );

                  await Promise.all(updatePromises);
                }
              },
            ],
            { cancelable: false }
          );
        });
      }
    });
  
    timerRef.current.push(unsubscribe);
  
    return () => unsubscribe();
  }, []);  
  
  const updatePuzzleInFirebase = async (
    puzzleId: string,
    stageId: string,
    updates: { [key: string]: any },
    hintId?: string,
    hintUpdates?: { [key: string]: any }
  ) => {
    try {
      const stageRef = doc(db, "puzzles", puzzleId, "stages", stageId);
      await updateDoc(stageRef, updates);

      if (hintId && hintUpdates) {
        const hintRef = doc(db, "puzzles", puzzleId, "stages", stageId, "hints", hintId);
        await updateDoc(hintRef, hintUpdates);
      }
    } catch (error) {
      console.error("Error updating puzzle:", error);
    }
  };

  const updateSensorInFirebase = async (sensorId: string, updates: Partial<Sensor>) => {
    try {
      const sensorRef = doc(db, "sensors", sensorId);
      await updateDoc(sensorRef, updates);
    } catch (error) {
      console.error("Error updating sensor:", error);
    }
  };

  const showAlertDialog = ({ title, message }: { title: string; message: string }) => {
    Alert.alert(title, message, [{ text: "OK" }], { cancelable: true });
  };

  const toggleItem = (item: string) => {
    setOpenItem(openItem === item ? null : item);
  };

  const handleSensorPress = async (sensorName: string) => {
    try {
      const sensor = sensors.find((s) => s.id === sensorName);
      if (!sensor) {
        showAlertDialog({
          title: "Error",
          message: `Sensor with name ${sensorName} not found.`,
        });
        return;
      }

      const updatedStatus = !sensor.isActive;
      await updateSensorInFirebase(sensorName, { isActive: updatedStatus });

      showAlertDialog({
        title: "Sensor Updated",
        message: `The ${sensorName} sensor is now ${updatedStatus ? "Active" : "Inactive"}.`,
      });
    } catch (error) {
      console.error("Error updating sensor:", error);
      showAlertDialog({
        title: "Error",
        message: "Failed to update the sensor. Please try again.",
      });
    }
  };

  const toggleChangeLog = () => {
    setIsChangeLogVisible(!isChangeLogVisible);
  };

  const handleStart = async () => {
    if (gameStarted) return;
    setGameStarted(true);

    if (!companyData?.id || !selectedRoomForGame?.id) {
      console.warn('Company ID or Room ID is missing');
      return;
    }

    let teamName: string = "guest";
    try {
      // Start game and update booking
      const updatedGame = await startGameAndBooking(companyData.id, selectedRoomForGame.id);

      if (updatedGame) {
        setGameStarted(true);
        setIsGameSet(true);

        teamName = updatedGame?.teamName;

        console.log('Game started successfully:', updatedGame);
      } else {
        console.log('No game or booking to update.');
      }
    } catch (error) {
      console.log('Error starting the game and booking:', error);
    }

    setTimeRemaining(selectedRoomForGame.duration * 60);

    showAlertDialog({
      title: "Start",
      message: `Game started for ${teamName} team! Temple wall action activated.`,
    });

  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: translateX,
            dy: translateY,
          },
        ],
        { useNativeDriver: false }
      ),
    })
  ).current;

  return (
    <ImageBackground
      // source={{ uri: 'https://as2.ftcdn.net/v2/jpg/00/10/01/27/1000_F_1000127921_RhVXYEqBPtL1o2gy4F7SHdXp6MOrn7Zw.jpg' }}
      style={styles.container}
    >

      <View style={styles.outerContainer}>
        <View style={styles.startButtonContainer}>
          <Button title="Start" color='gray' onPress={handleStart} disabled={gameStarted} />
        </View>

        <Modal
          visible={isChangeLogVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={toggleChangeLog}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Log</Text>
              <ScrollView style={styles.changeLogContainer}>
                {changeLog.length === 0 ? (
                  <Text>No changes recorded yet</Text>
                ) : (
                  changeLog.map((entry, index) => (
                    <View key={index} style={styles.changeEntry}>
                      <Text style={styles.changeTimestamp}>
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </Text>
                      <Text>Name: {entry.type === 'sensor' ? entry.changes.name : `Puzzle ${entry.id}`}</Text>
                      <Text>Status: {entry.type === 'sensor' ? (entry.changes.isActive ? 'Activated' : 'Deactivated') : (entry.changes.isSolved ? 'Solved' : 'Unsolved')}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              <Button title="Close" color="gray" onPress={toggleChangeLog} />
            </View>
          </View>
        </Modal>

        <View style={styles.inventoryContainer}>
          <Button title="Show Changes" onPress={toggleChangeLog} color='gray' />
          <Text style={styles.inventoryTitle}>Puzzles</Text>

          {/* <View style={styles.fadeOverlay} /> */}

          <View style={styles.itemList}>
            {puzzles.map((puzzle, index) =>
              puzzle.stages &&
              Object.keys(puzzle.stages).map((stageKey, stageIndex) => (
                <View key={`${index}-${stageIndex}`} style={styles.itemContainer}>
                  <Pressable onPress={() => toggleItem(`p${index + 1}.${stageIndex + 1}`)}>
                    <Text style={styles.itemText}>
                      p.{index + 1}.{stageIndex + 1}.{" "}
                      {openItem === `p${index + 1}.${stageIndex + 1}` ? "▼" : "▶"}
                    </Text>
                  </Pressable>
                  {openItem === `p${index + 1}.${stageIndex + 1}` && (
                    <View>
                      <Text style={styles.itemDetails}>
                        Details: {puzzle.stages[stageKey].pieces?.piece_1?.type || "No type"} - Interacted:{" "}
                        {puzzle.stages[stageKey].pieces?.piece_1?.isInteracted ? "Yes" : "No"}
                      </Text>
                      <Image
                        source={{ uri: puzzle.stages[stageKey].image_url }}
                        style={{ width: 100, height: 100, marginTop: 5 }}
                      />
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.container} {...panResponder.panHandlers}>
          <Animated.View style={{ transform: [{ scale }, { translateX }, { translateY }] }}>
            <Svg width={500} height={500} viewBox="0 0 500 500">
              <Rect x={0} y={0} width={500} height={500} fill="none" stroke="gray" strokeWidth={1} />
              <Line x1={0} y1={400} x2={0} y2={470} stroke="brown" strokeWidth={5} />
              <Line x1={0} y1={350} x2={500} y2={350} stroke="black" strokeWidth={8} />
              <Rect x={500} y={100} width={-30} height={200} fill="transparent" stroke="black" strokeWidth={1} />

              {puzzles.length > 0 && puzzles[0].stages && (
                <>
                  {puzzles[0].stages["temple_wall"] && (
                    <>
                      <Rect x={40} y={350} width={150} height={30} fill="transparent" stroke="black" strokeWidth={1} />
                      {/* <Circle
                      cx={80}
                      cy={365}
                      r={12}
                      fill={puzzles[0].stages["temple_wall"].pieces?.piece_1?.isInteracted ? "green" : "transparent"}
                      stroke="black"
                      strokeWidth={1}
                    />
                    <SvgText x={72} y={369} fontSize={10} fill="black">P.1.1</SvgText> */}

                      <Circle
                        cx={120}
                        cy={365}
                        r={12}
                        fill={
                          sensors.find((s) => s.id === "TW_sign_lights")?.isActive ? "green" : "transparent"
                        }
                        stroke="black"
                        strokeWidth={1}
                      />
                      <SvgText x={113} y={369} fontSize={12}>S.1.</SvgText>

                      <Rect x={380} y={350} width={100} height={30} fill="transparent" stroke="black" strokeWidth={1} />
                      {/* <Circle
                      cx={410}
                      cy={365}
                      r={12}
                      fill={puzzles[0].stages["temple_wall"].pieces?.piece_2?.isInteracted ? "green" : "transparent"}
                      stroke="black"
                      strokeWidth={1}
                    />
                    <SvgText x={400} y={369} fontSize={10} fill="black">P.1.1</SvgText> */}

                      <Circle
                        cx={450}
                        cy={365}
                        r={12}
                        fill={
                          sensors.find((s) => s.id === "TW_sign_lights")?.isActive ? "green" : "transparent"
                        }
                        stroke="black"
                        strokeWidth={1}
                      />
                      <SvgText x={441} y={369} fontSize={12}>S.1.</SvgText>
                    </>
                  )}

                  {puzzles[0].stages["totem"] && (
                    <>
                      <Circle
                        cx={440}
                        cy={440}
                        r={30}
                        fill={puzzles[0].stages["totem"].pieces?.piece_1?.isInteracted ? "green" : "transparent"}
                        stroke="black"
                        strokeWidth={1}
                      />
                      {/* <SvgText x={425} y={448} fontSize={14} fill="black">P.1.2.</SvgText> */}

                      <Line
                        x1={250}
                        y1={350}
                        x2={340}
                        y2={350}
                        stroke={sensors.find((s) => s.id === "TW_door")?.isActive ? "yellow" : "pink"}
                        strokeWidth={5}
                      />
                      <SvgText x={310} y={365} fontSize={12}>S.2.</SvgText>
                    </>
                  )}

                  {puzzles[1].stages["piece_1"] && (
                    <>
                      {/* <Rect x={70} y={465} width={30} height={20} fill={puzzles[1].stages["piece_1"].pieces?.piece_1?.isInteracted ? "green" : "transparent"} stroke="black" strokeWidth={1} />
                    <SvgText x={75} y={479} fontSize={10} fill="black">P.2.1</SvgText> */}
                      {/* <Rect x={470} y={270} width={30} height={20} fill={puzzles[1].stages["piece_1"].pieces?.piece_1?.isInteracted ? "green" : "transparent"} stroke="black" strokeWidth={1} />
                    <SvgText x={475} y={284} fontSize={10} fill="black">P.2.2</SvgText> */}
                      {/* <Rect x={280} y={95} width={30} height={20} fill={puzzles[1].stages["piece_1"].pieces?.piece_1?.isInteracted ? "green" : "transparent"} stroke="black" strokeWidth={1} />
                    <SvgText x={285} y={109} fontSize={10} fill="black">P.2.3</SvgText> */}
                    </>
                  )}

                  {puzzles[2].stages["wall_buttons"] && (
                    <>
                      <Rect x={5} y={160} width={25} height={140} fill="transparent" stroke="black" strokeWidth={1} />
                      {["button_6", "button_5", "button_4", "button_3", "button_2", "button_1"].map((button, index) => {
                        const cx = 17;
                        const cy = 180 + index * 20;
                        return (
                          <React.Fragment key={button}>
                            <Circle
                              cx={cx}
                              cy={cy}
                              r={8}
                              fill={puzzles[2].stages["wall_buttons"].pieces?.[button]?.isInteracted ? "green" : "transparent"}
                              stroke="black"
                              strokeWidth={1}
                            />
                            <SvgText x={cx - 2} y={(cy ?? 0) + 4} fontSize={8} fill="black">
                              {6 - index}
                            </SvgText>
                          </React.Fragment>
                        );
                      })}
                      <Rect x={380} y={316} width={100} height={30} fill="transparent" stroke="black" strokeWidth={1} />
                      <Rect x={380} y={315} width={100} height={8} fill={sensors.find((s) => s.id === "7" && s.isActive) ? "yellow" : "pink"} stroke="black" strokeWidth={1} />
                      <SvgText x={420} y={324} fontSize={12}>S.7.</SvgText>
                    </>

                  )}
                </>
              )}


              {/* Triangles above table with labels and color change based on puzzle completion */}
              {/* {["Left", "Center", "Right"].map((label, index) => {
  const cx = 10; // X-coordinate for all triangles (you can adjust this as needed)
  let cy;
  const puzzleState = puzzles[2]?.stages["wall_buttons"].pieces?.[`button_${index + 1}`]?.isInteracted;

  // Adjust Y based on which triangle (Left, Center, Right)
  if (label === "Left") {
    cy = 105;
  } else if (label === "Center") {
    cy = 90;
  } else if (label === "Right") {
    cy = 75;
  } */}

              {/* return (
    <React.Fragment key={label}>
      {/* Triangle */}
              {/* <Polygon
        points={`${cx},${cy ?? 0} ${cx - 9},${(cy ?? 0) - 5} ${cx - 9},${(cy ?? 0) + 5}`} // Triangular shape
        fill={puzzleState ? "green" : "lightgray"} // Change color based on puzzle completion
        stroke="black"
        strokeWidth={1}
      /> */}

              {/* Label */}
              {/* <SvgText x={cx - 2} y={(cy ?? 0) + 4} fontSize={8} fill="black">
        {label[0]} {/* Use the first letter for the label (Left = L, Center = C, etc.) */}
              {/* </SvgText>  */}
              {/* </React.Fragment>
  );  */}
              {/* })} */}




              {/* Rectangle above table - First Set */}
              <Rect
                x={230}
                y={1}
                width={250}
                height={20}
                fill="transparent"
                stroke="black"
                strokeWidth={1}
              />

              {/* Sensor bar inside the above rectangle - First Set */}
              <Rect
                x={230}
                y={21} // Adjusted to start below the rectangle
                width={250}
                height={8}
                fill={sensors.find((s) => s.id === "10" && s.isActive) ? "yellow" : "pink"}
                stroke="black"
                strokeWidth={1}
              />
              <SvgText x={350} y={29} fontSize={12}>S.10.</SvgText>

              {/* Spacer to move the second set lower */}
              <Rect
                x={20}
                y={1}  // Adjusted to add space before the next set
                width={130}
                height={20}
                fill="transparent"
                stroke="black"
                strokeWidth={1}
              />

              {/* Sensor bar inside the above rectangle - Second Set */}
              <Rect
                x={20}
                y={20}  // Adjusted to align with the second rectangle
                width={130}
                height={8}
                fill={sensors.find((s) => s.id === "9" && s.isActive) ? "yellow" : "pink"}
                stroke="black"
                strokeWidth={1}
              />
              <SvgText x={75} y={29} fontSize={12}>S.9.</SvgText>


              {/* Spacer to move the second set lower */}
              <Rect
                x={20}
                y={326}  // Adjusted to add space before the next set
                width={130}
                height={20}
                fill="transparent"
                stroke="black"
                strokeWidth={1}
              />

              {/* Sensor bar inside the above rectangle - Second Set */}
              <Rect
                x={20}
                y={326}  // Adjusted to align with the second rectangle
                width={130}
                height={8}
                fill={sensors.find((s) => s.id === "8" && s.isActive) ? "yellow" : "pink"}
                stroke="black"
                strokeWidth={1}
              />
              <SvgText x={70} y={335} fontSize={12}>S.8.</SvgText>



              {/* <Rect x={295} y={415} width={40} height={30} fill="transparent" stroke="black" strokeWidth={1} rotation={10} originX={315} originY={425} />
            <SvgText x={300} y={435} fontSize={12}>Diary</SvgText> */}
              <Rect x={160} y={120} width={180} height={100} fill="transparent" stroke="black" strokeWidth={1} />
              <SvgText x={235} y={180} fontSize={12}>Table</SvgText>
              {/* <Rect x={233} y={160} width={40} height={20} fill="transparent" stroke="black" strokeWidth={1} />
            <SvgText x={245} y={175} fontSize={10} fill="black">R.P</SvgText> */}

              <Circle cx={485} cy={150} r={14} fill="transparent" stroke="black" strokeWidth={1} />
              <SvgText x={482} y={155} fontSize={10} fill="black">S</SvgText>
              <Circle cx={485} cy={190} r={14} fill="transparent" stroke="black" strokeWidth={1} />
              <SvgText x={482} y={195} fontSize={10} fill="black">D</SvgText>
              <Circle cx={485} cy={230} r={14} fill="transparent" stroke="black" strokeWidth={1} />
              <SvgText x={482} y={235} fontSize={10} fill="black">H</SvgText>
              <Rect x={500} y={50} width={-20} height={50} fill="transparent" stroke="black" strokeWidth={1} />
            </Svg>
          </Animated.View>
        </View>
        <Rect x={160} y={120} width={180} height={400} fill="transparent" stroke="black" strokeWidth={1} />

        <View style={styles.sensorsContainer}>
          <Text style={styles.sensorsTitle}>
            {formatTime(timeRemaining)}
          </Text>
          <FlatList
            data={sensors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.sensorRow}>
                <Text style={styles.sensorText}>{item.name}</Text>
                <Switch
                  value={item.isActive}
                  onValueChange={() => handleSensorPress(item.id)}
                  trackColor={{ false: "#ccc", true: "#2E7D32" }}
                  thumbColor={item.isActive ? "#A5D6A7" : "#f4f3f4"}
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: 1,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fadeOverlay: {
    position: "absolute",
    top: 2, // adjust as needed
    left: 245,
    width: 500, // size of the faded area
    height: 500, // size of the faded area
    backgroundColor: "rgba(88, 76, 79, 0.7)", // black with 40% opacity
    zIndex: 1, // make sure it overlays but doesn't block important elements
  },
  outerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  startButtonContainer: {
    position: "absolute",
    top: 10,
    left: 960,
    zIndex: 1,
  },
  inventoryContainer: {
    width: 100,
    marginRight: 20,
    marginTop: -30,
  },
  inventoryTitle: {
    fontSize: 17,
    fontWeight: "bold",
    // marginBottom: 20,
    color: "black",
  },
  itemList: {
    // backgroundColor: "lightgray",
    borderRadius: 5,
    padding: 10,

  },
  itemContainer: {
    marginBottom: 8
  },
  itemText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginTop: 1,
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    marginTop: 5,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sensorsContainer: {
    width: 180,
    marginLeft: 20,
    alignItems: "center",
  },
  sensorsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 55,
    marginBottom: 3,
    color: "black",
  },
  sensorButton: {
    padding: 1,
    marginVertical: 4,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
  },
  activeSensor: {
    backgroundColor: "green",
  },
  inactiveSensor: {
    backgroundColor: "brown",
  },
  sensorText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  changeLogContainer: {
    maxHeight: '80%',
    marginBottom: 10,
  },
  changeEntry: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 10,
  },
  changeTimestamp: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Map;