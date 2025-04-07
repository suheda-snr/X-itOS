import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Animated, PanResponder, Pressable, Text, Button, Image } from "react-native";
import Svg, { Rect, Circle, Text as SvgText, Line } from "react-native-svg";
import { Alert } from "react-native";
import { doc, updateDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";

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
  id: string;
  type: string;
  isActive: boolean;
}

const PlayerActions: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const puzzlesRef = useRef<Puzzle[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<Array<NodeJS.Timeout | Function>>([]);

  useEffect(() => {
    puzzlesRef.current = puzzles;
  }, [puzzles]);

  useEffect(() => {
    const puzzlesUnsubscribe = onSnapshot(collection(db, "puzzles"), (snapshot) => {
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

  const handleSensorPress = async (sensorId: string) => {
    try {
      const sensor = sensors.find((s) => s.id === sensorId);
      if (!sensor) {
        showAlertDialog({
          title: "Error",
          message: `Sensor with ID ${sensorId} not found.`,
        });
        return;
      }

      const updatedStatus = !sensor.isActive;
      await updateSensorInFirebase(sensorId, { isActive: updatedStatus });

      showAlertDialog({
        title: "Sensor Updated",
        message: `The ${sensorId} sensor is now ${updatedStatus ? "Active" : "Inactive"}.`,
      });
    } catch (error) {
      console.error("Error updating sensor:", error);
      showAlertDialog({
        title: "Error",
        message: "Failed to update the sensor. Please try again.",
      });
    }
  };

  const handleStart = () => {
    if (gameStarted) return;
    setGameStarted(true);
    showAlertDialog({
      title: "Start",
      message: "Game started! Temple wall action activated.",
    });

    const puzzleId = puzzles[0]?.id || "puzzle_1";
    let stageId = "temple_wall";

    updatePuzzleInFirebase(puzzleId, stageId, {
      "actions.isActivated": true,
    });

    timerRef.current.push(
      setTimeout(() => {
        const templeWallInteractedPiece1 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_1?.isInteracted;
        const templeWallInteractedPiece2 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_2?.isInteracted;

        console.log("Hint 1 - templeWallInteractedPiece1:", templeWallInteractedPiece1);
        console.log("Hint 1 - templeWallInteractedPiece2:", templeWallInteractedPiece2);

        if (!templeWallInteractedPiece1 && !templeWallInteractedPiece2) {
          updatePuzzleInFirebase(puzzleId, stageId, {}, "hint_1", { isShared: true });
          showAlertDialog({ title: "Hint 1", message: "Check the diary" });
        }
      }, 20 * 1000) // 20 seconds
    );

    timerRef.current.push(
      setTimeout(() => {
        const templeWallInteractedPiece1 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_1?.isInteracted;
        const templeWallInteractedPiece2 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_2?.isInteracted;
        console.log("Hint 2 - templeWallInteractedPiece1:", templeWallInteractedPiece1);
        console.log("Hint 2 - templeWallInteractedPiece2:", templeWallInteractedPiece2);
        if (!templeWallInteractedPiece1 && !templeWallInteractedPiece2) {
          updatePuzzleInFirebase(puzzleId, stageId, {}, "hint_2", { isShared: true });
          showAlertDialog({ title: "Hint 2", message: "Check the temple wall stones" });
        }
      }, 60 * 1000) // 1 minute
    );

    timerRef.current.push(
      setTimeout(() => {
        const templeWallInteractedPiece1 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_1?.isInteracted;
        const templeWallInteractedPiece2 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_2?.isInteracted;
        console.log("Automation - templeWallInteractedPiece1:", templeWallInteractedPiece1);
        console.log("Automation - templeWallInteractedPiece2:", templeWallInteractedPiece2);
        if (!templeWallInteractedPiece1 && !templeWallInteractedPiece2) {
          updateSensorInFirebase("TW_sign_lights", { isActive: true });
          updatePuzzleInFirebase(puzzleId, "totem", { "actions.isActivated": true });
          showAlertDialog({
            title: "Automation",
            message: "TW_sign_lights and Totem action activated due to inactivity.",
          });
        }
      }, 90 * 1000) // 90 seconds
    );

    timerRef.current.push(
      setTimeout(() => {
        const totemInteracted = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_1?.isInteracted;
        console.log("Automation - totemInteracted:", totemInteracted);
        if (!totemInteracted) {
          updatePuzzleInFirebase(puzzleId, "totem", {}, "hint_3", { isShared: true });
          showAlertDialog({
            title: "Hint 3",
            message: "Look for the signs in the room same as light signs",
          });
        }
      }, 120 * 1000) // 2 minutes
    );

    timerRef.current.push(
      setTimeout(() => {
        const totemInteracted = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_1?.isInteracted;
        console.log("Automation - totemInteracted:", totemInteracted);
        if (!totemInteracted) {
          updateSensorInFirebase("TW_door", { isActive: true });
          updateSensorInFirebase("main_light", { isActive: true });
          updatePuzzleInFirebase("puzzle_2", "piece_1", { "actions.isActivated": true });
          showAlertDialog({
            title: "Automation",
            message: "TW_door and main light activated due to inactivity. Puzzle 2 unlocked.",
          });
        }
      }, 150 * 1000)
    );

    timerRef.current.push(
      setTimeout(() => {
        // Check if all pieces are interacted with
        const piece1 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_1?.isInteracted;
        const piece2 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_2?.isInteracted;
        const piece3 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_3?.isInteracted;
        const piece4 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_4?.isInteracted;
        const piece5 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_5?.isInteracted;
        const piece6 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_6?.isInteracted;

        const puzzleCompleted = piece1 && piece2 && piece3 && piece4 && piece5 && piece6;

        if (!puzzleCompleted) {
          updatePuzzleInFirebase("puzzle_2", "piece_1", {}, "hint_1", { isShared: true });
          showAlertDialog({
            title: "Hint 1",
            message: "Check if all pieces on the table are in the correct place.",
          });
        }
      }, 180 * 1000)
    );

    timerRef.current.push(
      setTimeout(() => {
        // Check if all pieces are interacted with
        const piece1 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_1?.isInteracted;
        const piece2 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_2?.isInteracted;
        const piece3 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_3?.isInteracted;
        const piece4 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_4?.isInteracted;
        const piece5 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_5?.isInteracted;
        const piece6 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_6?.isInteracted;

        const puzzleCompleted = piece1 && piece2 && piece3 && piece4 && piece5 && piece6;

        if (!puzzleCompleted) {
          updateSensorInFirebase("main_light", { isActive: false });
          updateSensorInFirebase("red_toplight", { isActive: true });
          updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "actions.isActivated": true });

          showAlertDialog({
            title: "Puzzle 2 Complete",
            message: "Main light deactivated, red top light activated, and Puzzle 3 unlocked due to inactivity.",
          });
        }
      }, 200 * 1000) // 2 minutes 40 seconds
    );

    timerRef.current.push(
      setTimeout(() => {
        const wallButtons1 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_1?.isInteracted;
        const wallButtons2 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_2?.isInteracted;
        const wallButtons3 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_3?.isInteracted;
        const wallButtons4 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_4?.isInteracted;
        const wallButtons5 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_5?.isInteracted;
        const wallButtons6 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_6?.isInteracted;

        if (!wallButtons1 && !wallButtons2 && !wallButtons4 && !wallButtons6) {
          updatePuzzleInFirebase("puzzle_3", "wall_buttons", {}, "hint_1", { isShared: true });
          showAlertDialog({ title: "Hint 1", message: "" });
        }
      }, 220 * 1000)
    );

    timerRef.current.push(
      setTimeout(() => {
        const wallButtons1 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_1?.isInteracted;
        const wallButtons2 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_2?.isInteracted;
        const wallButtons3 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_3?.isInteracted;
        const wallButtons4 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_4?.isInteracted;
        const wallButtons5 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_5?.isInteracted;
        const wallButtons6 = puzzlesRef.current[2]?.stages?.wall_button?.pieces?.button_6?.isInteracted;

        if (!wallButtons1 && !wallButtons2 && !wallButtons3 && !wallButtons4 && !wallButtons5 && !wallButtons6) {
          updateSensorInFirebase("locker_under_weights", { isActive: true });
          updatePuzzleInFirebase("puzzle_4", "gears", { "actions.isActivated": true });
          showAlertDialog({
            title: "Automation",
            message: "Locker under weights sensor activated and puzzle_4 stage activated due to inactivity.",
          });
        }
      }, 250 * 1000)
    );
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
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Button 1</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Button 2</Text>
      </Pressable>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Button 3</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#333", // Light black background
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      backgroundColor: "orange",
      padding: 15,
      borderRadius: 8,
      marginVertical: 10,
      width: 200,
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   startButtonContainer: {
//     position: "absolute",
//     top: 10,
//     zIndex: 1,
//   },
//   inventoryContainer: {
//     width: 150,
//     marginRight: 20,
//   },
//   inventoryTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   itemList: {
//     backgroundColor: "#f0f0f0",
//     borderRadius: 5,
//     padding: 10,
//   },
//   itemContainer: {
//     marginBottom: 10,
//   },
//   itemText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   itemDetails: {
//     fontSize: 14,
//     color: "#666",
//     marginLeft: 10,
//     marginTop: 5,
//   },
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sensorsContainer: {
//     width: 150,
//     marginLeft: 20,
//     alignItems: "center",
//   },
//   sensorsTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   sensorButton: {
//     backgroundColor: "#ddd",
//     padding: 10,
//     marginVertical: 5,
//     width: "100%",
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   sensorText: {
//     fontSize: 16,
//     color: "#333",
//   },
// });

export default PlayerActions;