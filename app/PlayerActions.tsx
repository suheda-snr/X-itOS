import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Animated, PanResponder, Pressable, Text, ScrollView, Image } from "react-native";
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
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const puzzlesRef = useRef<Puzzle[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<Array<NodeJS.Timeout | Function>>([]);
  const [loading, setLoading] = useState<boolean>(false)

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

  const updatePuzzleStatus = async (
    puzzleId: string,
    updates: { [key: string]: any },
  ) => {
    try {
      const stageRef = doc(db, "puzzles", puzzleId);
      await updateDoc(stageRef, updates);
    } catch (error) {
      console.error("Error updating puzzle:", error);
    }
  };

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

  const startTheGame = async() => {
    await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "actions.isActivated": true, });
    showAlertDialog({
      title: "Start",
      message: "Game started! Temple wall action activated.",
    });
  }

  const touchStoneWall = async() => {
        setLoading(true)
        await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "pieces.piece_1.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "pieces.piece_2.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "pieces.piece_3.isInteracted": true });

        const templeWallInteractedPiece1 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_1?.isInteracted;
        const templeWallInteractedPiece2 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_2?.isInteracted;
        const templeWallInteractedPiece3 = puzzlesRef.current[0]?.stages?.temple_wall?.pieces?.piece_3?.isInteracted;

        console.log("CHECKING...")
        console.log("Automation - templeWallInteractedPiece1:", templeWallInteractedPiece1);
        console.log("Automation - templeWallInteractedPiece2:", templeWallInteractedPiece2);
        console.log("Automation - templeWallInteractedPiece2:", templeWallInteractedPiece2);

        if (templeWallInteractedPiece1 && templeWallInteractedPiece2 && templeWallInteractedPiece3) {
          await updateSensorInFirebase("TW_sign_lights", { isActive: true });
          await updatePuzzleInFirebase("puzzle_1", "totem", { "actions.isActivated": true });
          await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "isSolved": true });
          setLoading(false)
          showAlertDialog({
            title: "Success!",
            message: "Wall lights activated, stage solved, totem sensor activated",
          });
        }
  }

  const turnTotem = async() => {
        setLoading(true)
        await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_1.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_2.isInteracted": false });
        await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_3.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_4.isInteracted": true });

        const totemInteractedPiece1 = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_1?.isInteracted;
        const totemInteractedPiece2 = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_2?.isInteracted;
        const totemInteractedPiece3 = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_3?.isInteracted;
        const totemInteractedPiece4 = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_4?.isInteracted;

        console.log("CHECKING...")
        console.log("Automation - templeWallInteractedPiece1:", totemInteractedPiece1);
        console.log("Automation - templeWallInteractedPiece2:", totemInteractedPiece2);
        console.log("Automation - templeWallInteractedPiece2:", totemInteractedPiece3);
        console.log("Automation - templeWallInteractedPiece2:", totemInteractedPiece4);

        if (totemInteractedPiece1 && !totemInteractedPiece2 && totemInteractedPiece3 && totemInteractedPiece4) {
          await updateSensorInFirebase("TW_door", { isActive: true });
          await updateSensorInFirebase("main_light", { isActive: true });
          await updateSensorInFirebase("table", { isActive: true });
          await updatePuzzleInFirebase("puzzle_1", "totem", { "isSolved": true });
          await updatePuzzleInFirebase("puzzle_1", "totem", { "isSolved": true });
          await updatePuzzleInFirebase("puzzle_2", "piece_1", { "actions.isActivated": true });
          await updatePuzzleStatus("puzzle_1", {"isSolved": true})
          setLoading(false)

          showAlertDialog({
            title: "Puzzle 1 Completed",
            message: "Totem in correct position, door opens. Puzzle 2 unlocked.",
          });
        }
  }

  const placePuzzlePiecesInCorrectOrder = async() => {
        setLoading(true)
        await updatePuzzleInFirebase("puzzle_2", "piece_1", { "pieces.piece_1.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_2", "piece_1", { "pieces.piece_2.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_2", "piece_1", { "pieces.piece_3.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_2", "piece_1", { "pieces.piece_4.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_2", "piece_1", { "pieces.piece_5.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_2", "piece_1", { "pieces.piece_6.isInteracted": true });

        const puzzleInteractedPiece1 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_1?.isInteracted;
        const puzzleInteractedPiece2 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_2?.isInteracted;
        const puzzleInteractedPiece3 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_3?.isInteracted;
        const puzzleInteractedPiece4 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_4?.isInteracted;
        const puzzleInteractedPiece5 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_5?.isInteracted;
        const puzzleInteractedPiece6 = puzzlesRef.current[1]?.stages?.piece_1?.pieces?.piece_6?.isInteracted;

        console.log("CHECKING...")
        console.log("Puzzle piece 1 - ", puzzleInteractedPiece1);
        console.log("Puzzle piece 2 - ", puzzleInteractedPiece2);
        console.log("Puzzle piece 3 - ", puzzleInteractedPiece3);
        console.log("Puzzle piece 4 - ", puzzleInteractedPiece4);
        console.log("Puzzle piece 5 - ", puzzleInteractedPiece5);
        console.log("Puzzle piece 6 - ", puzzleInteractedPiece6);

        if (puzzleInteractedPiece1 && puzzleInteractedPiece2 && puzzleInteractedPiece3 && puzzleInteractedPiece4 && puzzleInteractedPiece5 && puzzleInteractedPiece6) {
          await updateSensorInFirebase("main_light", { isActive: false });
          await updateSensorInFirebase("red_toplight", { isActive: true });
          await updatePuzzleInFirebase("puzzle_2", "piece_1", { "isSolved": true });
          await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "actions.isActivated": true });
          await updatePuzzleStatus("puzzle_2", {"isSolved": true})
          setLoading(false)

          showAlertDialog({
            title: "Puzzle 2 Completed",
            message: "Main light deactivated, red top light activated, and Puzzle 3 unlocked.",
          });
        }
  }

  const pressCorrectWallButtons = async() => {
    setLoading(true)
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_1.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_2.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_3.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_4.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_5.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_6.isInteracted": true });

    const wallButtons1 = puzzlesRef.current[2]?.stages?.wall_buttons?.pieces?.button_1?.isInteracted;
    const wallButtons2 = puzzlesRef.current[2]?.stages?.wall_buttons?.pieces?.button_2?.isInteracted;
    const wallButtons3 = puzzlesRef.current[2]?.stages?.wall_buttons?.pieces?.button_3?.isInteracted;
    const wallButtons4 = puzzlesRef.current[2]?.stages?.wall_buttons?.pieces?.button_4?.isInteracted;
    const wallButtons5 = puzzlesRef.current[2]?.stages?.wall_buttons?.pieces?.button_5?.isInteracted;
    const wallButtons6 = puzzlesRef.current[2]?.stages?.wall_buttons?.pieces?.button_6?.isInteracted;

    console.log("button 1 - " + wallButtons1)
    console.log("button 2 - " + wallButtons2)
    console.log("button 3 - " + wallButtons3)
    console.log("button 4 - " + wallButtons4)
    console.log("button 5 - " + wallButtons5)
    console.log("button 6 - " + wallButtons6)


    if(wallButtons1 && wallButtons2 && !wallButtons3 && wallButtons4 && !wallButtons5 && wallButtons6){
      await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "isSolved": true });
      await updatePuzzleStatus("puzzle_3", {"isSolved": true})
      await updateSensorInFirebase("locker_under_weights", { isActive: true });
      await updatePuzzleInFirebase("puzzle_4", "gears", { "actions.isActivated": true });
      await updateSensorInFirebase("main_light", { isActive: true });
      setLoading(false)
      showAlertDialog({
         title: "Puzzle 3 Completed",
         message: "Locker under weights sensor activated and Puzzle 4 is activated.",
      });
    }
  }

  const putGearsOnCorrectPlaces = async() => {
    setLoading(true)
    await updatePuzzleInFirebase("puzzle_4", "gears", { "pieces.gears.isInteracted": true });

    const gears = puzzlesRef.current[3]?.stages?.gears?.pieces?.gears?.isInteracted;

    console.log("gears - " + gears)

    if(gears){
      await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "isSolved": true });
      await updatePuzzleStatus("puzzle_3", {"isSolved": true})
      await updateSensorInFirebase("locker_under_weights", { isActive: true });
      await updatePuzzleInFirebase("puzzle_4", "gears", { "actions.isActivated": true });
      await updateSensorInFirebase("main_light", { isActive: true });
      setLoading(false)
      showAlertDialog({
         title: "Puzzle 3 Completed",
         message: "Locker under weights sensor activated and Puzzle 4 is activated.",
      });
    }
  }

  const resetSensorsAndPuzzles = async() => {
    console.log("RESETTING.....")
    setLoading(true)
    //puzzle 1 stage 1
    await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "isSolved": false });
    await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "actions.isActivated": false, });
    await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "pieces.piece_1.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "pieces.piece_2.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "pieces.piece_3.isInteracted": false });
    await updateSensorInFirebase("TW_sign_lights", { isActive: false });
    //puzzle 1 stage 2
    await updatePuzzleInFirebase("puzzle_1", "totem", { "isSolved": false });
    await updatePuzzleInFirebase("puzzle_1", "totem", { "actions.isActivated": false });
    await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_1.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_2.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_3.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_4.isInteracted": false });
    await updateSensorInFirebase("TW_door", { isActive: false });
    await updateSensorInFirebase("main_light", { isActive: false });
    await updateSensorInFirebase("table", { isActive: false });
    await updatePuzzleStatus("puzzle_1", {"isSolved": false})
    await updatePuzzleInFirebase("puzzle_2", "piece_1", { "actions.isActivated": false });
    //puzzle 2 stage 1
    for(let i = 1; i < 7; i++){
      await updatePuzzleInFirebase("puzzle_2", "piece_1", { [`pieces.piece_${i}.isInteracted`]: false });
    }
    await updateSensorInFirebase("main_light", { isActive: false });
    await updateSensorInFirebase("red_toplight", { isActive: false });
    await updatePuzzleInFirebase("puzzle_2", "piece_1", { "isSolved": false });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "actions.isActivated": false });
    await updatePuzzleStatus("puzzle_2", {"isSolved": false})
    setLoading(false)
    //puzzle 3 stage 1
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_1.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_2.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_3.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_4.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_5.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "pieces.button_6.isInteracted": false });

    await updatePuzzleInFirebase("puzzle_3", "wall_buttons", { "isSolved": false });
    await updatePuzzleStatus("puzzle_3", {"isSolved": false})
    await updateSensorInFirebase("locker_under_weights", { isActive: false });
    await updatePuzzleInFirebase("puzzle_4", "gears", { "actions.isActivated": false });
    await updateSensorInFirebase("main_light", { isActive: false });
    //puzzle 4 stage 1

    showAlertDialog({
      title: "Success!",
      message: "Reseted",
    });
  }

  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Pressable style={styles.button} onPressIn={startTheGame}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Start"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={touchStoneWall}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Touch stone pieces"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={turnTotem}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Turn totem in correct position"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={placePuzzlePiecesInCorrectOrder}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Put puzzle pieces on the table in correct order"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={pressCorrectWallButtons}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Press buttons 1,2,4,6"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={resetSensorsAndPuzzles}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Reset"}
        </Text>
      </Pressable>

    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "50%", 
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});


export default PlayerActions;