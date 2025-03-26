import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Animated, PanResponder, Pressable, Text, Button } from "react-native";
import Svg, { Rect, Circle, Text as SvgText, Line } from "react-native-svg";
import { Alert } from "react-native";
import { fetchPuzzles } from '../firebase/puzzle';
import { doc, updateDoc, collection, getDocs } from "firebase/firestore"; // Import Firestore utilities
import { db } from '../firebase/firebaseConfig';

const Map: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]); // State to hold sensor data
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  // Fetch puzzles and sensors from Firebase on component mount
  useEffect(() => {
    const loadData = async () => {
      // Fetch puzzles
      const fetchedPuzzles = await fetchPuzzles();
      if (fetchedPuzzles) {
        setPuzzles(fetchedPuzzles);
      }

      // Fetch sensors
      const sensorsCollection = collection(db, "sensors");
      const sensorsDocs = await getDocs(sensorsCollection);
      const sensorsData = sensorsDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSensors(sensorsData);
    };
    loadData();

    // Cleanup timers on unmount
    return () => {
      timerRef.current.forEach(clearTimeout);
    };
  }, []);

  // Function to update puzzle fields in Firebase
  const updatePuzzleInFirebase = async (
    puzzleId: string,
    stageId: string,
    updates: any,
    hintId?: string,
    hintUpdates?: any
  ) => {
    try {
      const stageRef = doc(db, "puzzles", puzzleId, "stages", stageId);
      await updateDoc(stageRef, updates);

      if (hintId && hintUpdates) {
        const hintRef = doc(db, "puzzles", puzzleId, "stages", stageId, "hints", hintId);
        await updateDoc(hintRef, hintUpdates);
      }

      const updatedPuzzles = await fetchPuzzles();
      setPuzzles(updatedPuzzles || []);
    } catch (error) {
      console.error("Error updating puzzle:", error);
    }
  };

  // Function to update sensor fields in Firebase
  const updateSensorInFirebase = async (sensorId: string, updates: any) => {
    try {
      const sensorRef = doc(db, "sensors", sensorId);
      await updateDoc(sensorRef, updates);

      // Fetch updated sensors
      const sensorsCollection = collection(db, "sensors");
      const sensorsDocs = await getDocs(sensorsCollection);
      const sensorsData = sensorsDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSensors(sensorsData);
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

  const handleSensorPress = (sensorId: string) => {
    showAlertDialog({
      title: "Sensor Activated",
      message: `You have activated the ${sensorId} sensor.`,
    });
  };

  const handleStart = () => {
    if (gameStarted) return;
    setGameStarted(true);
    showAlertDialog({
      title: "Start",
      message: "Game started! Temple wall action activated.",
    });

    const puzzleId = puzzles[0]?.id || "puzzle_1";
    const stageId = "temple_wall";

    // Activate temple wall action
    updatePuzzleInFirebase(puzzleId, stageId, {
      "actions.isActivated": true,
    });

    // Timer logic
    timerRef.current.push(
      setTimeout(() => {
        if (!puzzles[0]?.stages?.temple_wall?.piece?.isInteracted) {
          updatePuzzleInFirebase(puzzleId, stageId, {}, "hint_1", { isShared: true });
          showAlertDialog({ title: "Hint 1", message: "Check the diary" });

          timerRef.current.push(
            setTimeout(() => {
              if (!puzzles[0]?.stages?.temple_wall?.piece?.isInteracted) {
                updatePuzzleInFirebase(puzzleId, stageId, {}, "hint_2", { isShared: true });
                showAlertDialog({ title: "Hint 2", message: "Check the temple wall stones" });

                timerRef.current.push(
                  setTimeout(() => {
                    if (!puzzles[0]?.stages?.temple_wall?.piece?.isInteracted) {
                      // Activate TW_sign_lights and totem action
                      updateSensorInFirebase("TW_sign_lights", { isActive: true });
                      updatePuzzleInFirebase(puzzleId, "totem", {
                        "actions.isActivated": true,
                      });
                      showAlertDialog({
                        title: "Automation",
                        message: "TW_sign_lights and Totem action activated due to inactivity.",
                      });
                    }
                  }, 1 * 20 * 1000)
                );
              }
            }, 1 * 40 * 1000)
          );
        }
      }, 1 * 60 * 1000)
    );
  };

  const handleTempleWallInteraction = () => {
    const puzzleId = puzzles[0]?.id || "puzzle_1";
    const stageId = "temple_wall";

    if (!puzzles[0]?.stages?.temple_wall?.piece?.isInteracted) {
      // Mark temple wall as interacted and activate TW_sign_lights and totem action
      updatePuzzleInFirebase(puzzleId, stageId, {
        "piece.isInteracted": true,
      });
      updateSensorInFirebase("TW_sign_lights", { isActive: true });
      updatePuzzleInFirebase(puzzleId, "totem", {
        "actions.isActivated": true,
      });
      showAlertDialog({
        title: "Temple Wall Interacted",
        message: "TW_sign_lights and Totem action activated.",
      });

      // Clear all timers
      timerRef.current.forEach(clearTimeout);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        if (gesture.numberActiveTouches === 2) {
          const newScale = Math.max(0.5, Math.min(3, scale._value + gesture.dx * 0.001));
          scale.setValue(newScale);
        } else {
          translateX.setValue(gesture.dx);
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: () => { },
    })
  ).current;

  return (
    <View style={styles.outerContainer}>
      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <Button title="Start" onPress={handleStart} disabled={gameStarted} />
      </View>

      {/* Inventory section */}
      <View style={styles.inventoryContainer}>
        <Text style={styles.inventoryTitle}>Inventory</Text>
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
                  <Text style={styles.itemDetails}>
                    Details: {puzzle.stages[stageKey].piece?.type || "No type"} - Interacted:{" "}
                    {puzzle.stages[stageKey].piece?.isInteracted ? "Yes" : "No"}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </View>

      {/* Map */}
      <View style={styles.container} {...panResponder.panHandlers}>
        <Animated.View style={{ transform: [{ scale }, { translateX }, { translateY }] }}>
          <Svg width={500} height={500} viewBox="-50 0 600 600">
            <Rect x={0} y={0} width={500} height={500} fill="none" stroke="black" strokeWidth={10} />
            <Line x1={0} y1={400} x2={0} y2={470} stroke="brown" strokeWidth={5} />

            {/* Dynamically render stages */}
            {puzzles.length > 0 && puzzles[0].stages && (
              <>
                {/* Temple Wall Stage */}
                {puzzles[0].stages["temple_wall"] && (
                  <>
                    <Rect x={40} y={350} width={150} height={30} fill="grey" stroke="black" strokeWidth={1} />
                    <Circle
                      cx={80}
                      cy={366}
                      r={12}
                      fill={puzzles[0].stages["temple_wall"].piece?.isInteracted ? "green" : "black"}
                      stroke="black"
                      strokeWidth={1}
                      onPressIn={() => {
                        showAlertDialog({
                          title: "Temple Wall Stone",
                          message: puzzles[0].stages["temple_wall"].actions?.description || "No description",
                        });
                        handleTempleWallInteraction();
                      }}
                    />
                    <SvgText x={72} y={370} fontSize={10} fill="white">P.1.1</SvgText>

                    <Circle
                      cx={120}
                      cy={366}
                      r={12}
                      fill={
                        sensors.find((s) => s.id === "TW_sign_lights")?.isActive ? "green" : "red"
                      }
                      stroke="black"
                      strokeWidth={1}
                      onPressIn={() => handleSensorPress("TW_sign_lights")}
                    />
                    <SvgText x={113} y={370} fontSize={12}>S.1.</SvgText>
                  </>
                )}

                <Line x1={0} y1={350} x2={500} y2={350} stroke="black" strokeWidth={8} />

                {/* Totem Stage */}
                {puzzles[0].stages["totem"] && (
                  <>
                    <Circle
                      cx={440}
                      cy={440}
                      r={50}
                      fill={puzzles[0].stages["totem"].piece?.isInteracted ? "green" : "black"}
                      stroke="black"
                      strokeWidth={1}
                      onPressIn={() =>
                        showAlertDialog({
                          title: "Totem Pieces",
                          message: puzzles[0].stages["totem"].actions?.description || "No description",
                        })
                      }
                    />
                    <SvgText x={425} y={448} fontSize={14} fill="white">P.1.2.</SvgText>

                    <Line
                      x1={250}
                      y1={350}
                      x2={340}
                      y2={350}
                      stroke={
                        sensors.find((s) => s.id === "TW_door")?.isActive ? "green" : "red"
                      }
                      strokeWidth={5}
                      onPressIn={() => handleSensorPress("TW_door")}
                    />
                    <SvgText x={310} y={365} fontSize={12}>S.2.</SvgText>
                  </>
                )}
              </>
            )}

            {/* Static elements */}

            <Rect x={295} y={415} width={40} height={30} fill="brown" stroke="black" strokeWidth={1} rotation={10} originX={315} originY={425} />
            <SvgText x={300} y={435} fontSize={12}>Diary</SvgText>
            <Rect x={160} y={120} width={180} height={100} fill="grey" stroke="black" strokeWidth={1} />
            <SvgText x={300} y={205} fontSize={12}>Table</SvgText>
            <Rect x={233} y={160} width={40} height={20} fill="black" stroke="black" strokeWidth={1} />
            <SvgText x={245} y={175} fontSize={10} fill="white">R.P</SvgText>
            <Rect x={500} y={100} width={-30} height={200} fill="grey" stroke="black" strokeWidth={1} />
            <Circle cx={485} cy={150} r={14} fill="black" stroke="black" strokeWidth={1} />
            <SvgText x={482} y={155} fontSize={10} fill="white">S</SvgText>
            <Circle cx={485} cy={190} r={14} fill="black" stroke="black" strokeWidth={1} />
            <SvgText x={482} y={195} fontSize={10} fill="white">D</SvgText>
            <Circle cx={485} cy={230} r={14} fill="black" stroke="black" strokeWidth={1} />
            <SvgText x={482} y={235} fontSize={10} fill="white">H</SvgText>
            <Rect x={500} y={50} width={-20} height={50} fill="brown" stroke="black" strokeWidth={1} />
          </Svg>
        </Animated.View>
      </View>

      {/* Sensors section */}
      <View style={styles.sensorsContainer}>
        <Text style={styles.sensorsTitle}>Sensors</Text>
        {sensors.map((sensor) => (
          <Pressable
            key={sensor.id}
            style={styles.sensorButton}
            onPress={() => handleSensorPress(sensor.id)}
          >
            <Text style={styles.sensorText}>{sensor.id} ({sensor.isActive ? "Active" : "Inactive"})</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonContainer: {
    position: "absolute",
    top: 10,
    zIndex: 1,
  },
  inventoryContainer: {
    width: 150,
    marginRight: 20,
  },
  inventoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  itemList: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
    width: 150,
    marginLeft: 20,
    alignItems: "center",
  },
  sensorsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  sensorButton: {
    backgroundColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
  },
  sensorText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Map;