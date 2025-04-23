import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Animated, PanResponder, Pressable, Text, ScrollView, Image } from "react-native";
import Svg, { Rect, Circle, Text as SvgText, Line } from "react-native-svg";
import { Alert } from "react-native";
import GameTimer, {GameTimerHandle} from "@/components/GameTimer";
import { doc, updateDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { useCompanyStore } from "@/stateStore/companyStore";
import { useHintScheduler } from "@/utils/useHintScheduler";

interface Hint {
  message: string;
  isShared: boolean;
}

interface Stage {
  piece?:Record<string, {
    type: string;
    isInteracted: boolean;
    [key: string]: any;
  }>;
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
  isSolved?: boolean
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
  const sensorsRef = useRef<Sensor[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<Array<NodeJS.Timeout | Function>>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const timerGameRef = useRef<GameTimerHandle>(null);
  const roomData = useCompanyStore.getState().selectedRoomForGame

  useEffect(() => {
    puzzlesRef.current = puzzles;
  }, [puzzles]);

  useEffect(() => {
    sensorsRef.current = sensors;
  }, [sensors]);  

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

  useHintScheduler(gameStarted, [
    { after: 0.2, action: async() => showHint("puzzle_1", "temple_wall", "hint_2", 0) },
    { after: 0.4, action: async() => showHint("puzzle_1", "totem", "hint_3", 0)},
    { after: 0.6, action: async() => showHint("puzzle_2", "piece_1", "hint_1", 1) },
    { after: 0.8, action: async() => showHint("puzzle_3", "wall_buttons", "hint_1", 2)},
    { after: 1, action: async() => showHint("puzzle_4", "gears", "hint_1", 3) },
    { after: 1.2, action: async() => showHint("puzzle_4", "crank_rotation", "hint_1", 3)},
    { after: 1.4, action: async() => showHint("puzzle_5", "insert_ball", "hint_1", 4) },
    { after: 1.6, action: async() => showHint("puzzle_5", "crank_rotation_to_get_balls", "hint_1", 4)},
    { after: 1.8, action: async() => showHint("puzzle_6", "weight", "hint_1", 5)},
    { after: 2, action: async() => showHint("puzzle_7", "wheels", "hint_1", 6) },
    { after: 2.2, action: async() => showHint("puzzle_8", "altar", "hint_1", 7)},
    { after: 2.4, action: async() => showHint("puzzle_9", "pegs", "hint_1", 8) },
    { after: 2.6, action: async() => showHint("puzzle_9", "middle_table", "hint_1", 8)},
  ]);

  const showHint = async (
    puzzleId: string,
    stageId: string,
    hintId: string,
    puzzleOrder: number
  ) => {


    if(isPreviousStepCompleted(stageId, puzzleOrder, true)){
      console.log("The stage completed, hint is not shown")
      return
    }

    await updatePuzzleInFirebase(puzzleId, stageId, {}, hintId, { isShared: true });
  
    const puzzle = puzzlesRef.current.find((p) => p.id === puzzleId);
    const hintMessage = puzzle?.stages?.[stageId]?.hints?.[hintId]?.["message"] 
    console.log("Auto hint shown")

    showAlertDialog({
      title: "Hint!",
      message: `${hintMessage ?? "No message found"}`,
    });
  };

  const isPreviousStepCompleted = (stageName: string, puzzleOrder: number, isHint?: boolean) => {
    const isCurrentPuzzleSolved = puzzlesRef.current[puzzleOrder]?.stages?.[stageName]?.isSolved;

    if(!isCurrentPuzzleSolved && isHint == undefined){
      showAlertDialog({
        title: "Warning!",
        message: "You can not proceed to the next step of the game without completing the previous one!",
      });
    }

    return isCurrentPuzzleSolved
  }

  const getElapsed = () => {
    const seconds = timerGameRef.current?.getElapsedTime();
    console.log('Time elapsed:', seconds, "seconds");
    return seconds
  };

  const startTheGame = async() => {
    setLoading(true)
    await updatePuzzleInFirebase("puzzle_1", "temple_wall", { "actions.isActivated": true });
    setLoading(false)
    timerGameRef.current?.start();
    setGameStarted(true)
    console.log(roomData)
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

        if(!isPreviousStepCompleted("temple_wall", 0)){
          setLoading(false)
          return
        } 

        await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_1.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_2.isInteracted": false });
        await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_3.isInteracted": true });
        await updatePuzzleInFirebase("puzzle_1", "totem", { "pieces.piece_4.isInteracted": true });

        const totemInteractedPiece1 = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_1?.isInteracted;
        const totemInteractedPiece2 = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_2?.isInteracted;
        const totemInteractedPiece3 = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_3?.isInteracted;
        const totemInteractedPiece4 = puzzlesRef.current[0]?.stages?.totem?.pieces?.piece_4?.isInteracted;

        if (totemInteractedPiece1 && !totemInteractedPiece2 && totemInteractedPiece3 && totemInteractedPiece4) {
          await updateSensorInFirebase("TW_door", { isActive: true });
          await updateSensorInFirebase("main_light", { isActive: true });
          await updateSensorInFirebase("table", { isActive: true });
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

        if(!isPreviousStepCompleted("totem", 0)){
          setLoading(false)
          return
        } 

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

    if(!isPreviousStepCompleted("piece_1", 1)){
      setLoading(false)
      return
    } 

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

    if(!isPreviousStepCompleted("wall_buttons", 2)){
      setLoading(false)
      return
    } 

    await updatePuzzleInFirebase("puzzle_4", "gears", { "pieces.gears.isInteracted": true });

    const gears = puzzlesRef.current[3]?.stages?.gears?.pieces?.gears?.isInteracted;

    console.log("gears - " + gears)

    if(gears){
      await updatePuzzleInFirebase("puzzle_4", "gears", { "isSolved": true });
      await updatePuzzleInFirebase("puzzle_4", "crank_rotation", { "actions.isActivated": true });
      await updateSensorInFirebase("sliding_door", { isActive: true });
      setLoading(false)
      showAlertDialog({
         title: "Puzzle 4 stage 1 completed",
         message: "Sliding door closed and crank rotation activated.",
      });
    }
  }

  const crankRotationForGears = async() => {
    setLoading(true)

    if(!isPreviousStepCompleted("gears", 3)){
      setLoading(false)
      return
    } 

    await updatePuzzleInFirebase("puzzle_4", "crank_rotation", { "piece.crank.isInteracted": true });

    const cranckRotation = puzzlesRef.current[3]?.stages?.crank_rotation?.piece?.crank?.isInteracted;

        if (cranckRotation) {
          await updatePuzzleInFirebase("puzzle_4", "crank_rotation", { "isSolved": true });
          await updatePuzzleInFirebase("puzzle_5", "insert_ball", { "actions.isActivated": true });
          await updateSensorInFirebase("ball_locker", { isActive: true });
          await updatePuzzleStatus("puzzle_4", {"isSolved": true})
          setLoading(false)
          showAlertDialog({
            title: "Puzzle 4 completed",
            message: "Ball locker sensor activated and insert ball stage activated.",
          });
        }
  }

  const insertBall = async() => {
    setLoading(true)

    if(!isPreviousStepCompleted("crank_rotation", 3)){
      setLoading(false)
      return
    } 

    await updatePuzzleInFirebase("puzzle_5", "insert_ball", { "pieces.ball.isInteracted": true });

    const ballInsert = puzzlesRef.current[4]?.stages?.insert_ball?.pieces?.ball?.isInteracted;

        if (ballInsert) {
          await updateSensorInFirebase("crank_hole", { isActive: true });
          await updatePuzzleInFirebase("puzzle_5", "crank_rotation_to_get_balls", { "actions.isActivated": true });
          await updatePuzzleInFirebase("puzzle_5", "insert_ball", { "isSolved": true });
          setLoading(false)
          showAlertDialog({
            title: "Puzzle  5 stage 1 solved",
            message: "Crank hole sensor activated and crank rotation to get balls stage activated.",
          });
        }
  }

  const crankRotationToGetBalls = async() => {
    setLoading(true)

    if(!isPreviousStepCompleted("insert_ball", 4)){
      setLoading(false)
      return
    } 

    await updatePuzzleInFirebase("puzzle_5", "crank_rotation_to_get_balls", { "pieces.crank.isInteracted": true });

    const ballInsert = puzzlesRef.current[4]?.stages?.crank_rotation_to_get_balls?.pieces?.crank?.isInteracted;

        if (ballInsert) {
          await updatePuzzleInFirebase("puzzle_6", "weight", { "actions.isActivated": true });
          await updateSensorInFirebase("balls_releasing_mechanism", { isActive: true });
          await updatePuzzleInFirebase("puzzle_5", "crank_rotation_to_get_balls", { "isSolved": true });
          await updatePuzzleStatus("puzzle_5", {"isSolved": true})
          setLoading(false)
          showAlertDialog({
            title: "Puzzle  5 stage 2 solved",
            message: "Balls are released. Weight puzzle activated",
          });
        }
  }

  const weightPuzzle = async() => {
    setLoading(true)

    if(!isPreviousStepCompleted("crank_rotation_to_get_balls", 4)){
      setLoading(false)
      return
    } 

    await updatePuzzleInFirebase("puzzle_6", "weight", { "pieces.piece_1.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_6", "weight", { "pieces.piece_2.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_6", "weight", { "pieces.piece_3.isInteracted": true });

    const ball1 = puzzlesRef.current[5]?.stages?.weight?.pieces?.piece_1?.isInteracted;
    const ball2 = puzzlesRef.current[5]?.stages?.weight?.pieces?.piece_2?.isInteracted;
    const ball3 = puzzlesRef.current[5]?.stages?.weight?.pieces?.piece_3?.isInteracted;

        if (ball1 && ball2 && ball3) {
          await updatePuzzleInFirebase("puzzle_7", "wheels", { "actions.isActivated": true });
          await updatePuzzleInFirebase("puzzle_6", "weight", { "isSolved": true });
          await updatePuzzleStatus("puzzle_6", {"isSolved": true})
          setLoading(false)
          showAlertDialog({
            title: "Puzzle 6 solved",
            message: "Wheels stage activated.",
          });
        }
  }

  const placeWheelsInCorrectPosition = async() => {
    setLoading(true)

    if(!isPreviousStepCompleted("weight", 5)){
      setLoading(false)
      return
    } 

    await updatePuzzleInFirebase("puzzle_7", "wheels", { "pieces.piece_1.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_7", "wheels", { "pieces.piece_2.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_7", "wheels", { "pieces.piece_3.isInteracted": true });

    const wheel1 = puzzlesRef.current[6]?.stages?.wheels?.pieces?.piece_1?.isInteracted;
    const wheel2 = puzzlesRef.current[6]?.stages?.wheels?.pieces?.piece_2?.isInteracted;
    const wheel3 = puzzlesRef.current[6]?.stages?.wheels?.pieces?.piece_3?.isInteracted;

        if (wheel1 && wheel2 && wheel3) {
          await updateSensorInFirebase("dog_locker", { isActive: true });
          await updatePuzzleInFirebase("puzzle_8", "altar", { "actions.isActivated": true });
          await updatePuzzleInFirebase("puzzle_7", "wheels", { "isSolved": true });
          await updatePuzzleStatus("puzzle_7", {"isSolved": true})
          setLoading(false)
          showAlertDialog({
            title: "Puzzle 7 solved",
            message: "Altar activated. Dog-locker opened",
          });
        }
  }

  const putItemsOnAltar = async() => {
    setLoading(true)

    if(!isPreviousStepCompleted("wheels", 6)){
      setLoading(false)
      return
    } 

    await updatePuzzleInFirebase("puzzle_8", "altar", { "pieces.piece_1.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_8", "altar", { "pieces.piece_2.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_8", "altar", { "pieces.piece_3.isInteracted": true });

    const heart = puzzlesRef.current[7]?.stages?.altar?.pieces?.piece_1?.isInteracted;
    const star = puzzlesRef.current[7]?.stages?.altar?.pieces?.piece_2?.isInteracted;
    const dog = puzzlesRef.current[7]?.stages?.altar?.pieces?.piece_3?.isInteracted;

        if (heart && star && dog) {
          await updateSensorInFirebase("table_lock", { isActive: true });
          await updatePuzzleInFirebase("puzzle_9", "pegs", { "actions.isActivated": true });
          await updatePuzzleInFirebase("puzzle_8", "altar", { "isSolved": true });
          await updatePuzzleStatus("puzzle_8", {"isSolved": true})
          setLoading(false)
          showAlertDialog({
            title: "Puzzle 8 solved",
            message: "Pegs stage is activated and table lock is opened",
          });
        }
  }

  const removeTablePegs = async() => {
    setLoading(true)

    if(!isPreviousStepCompleted("altar", 7)){
      setLoading(false)
      return
    } 

    await updatePuzzleInFirebase("puzzle_9", "pegs", { "pieces.piece_1.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_9", "pegs", { "pieces.piece_2.isInteracted": true });
    await updatePuzzleInFirebase("puzzle_9", "pegs", { "pieces.piece_3.isInteracted": true });

    const peg1 = puzzlesRef.current[8]?.stages?.pegs?.pieces?.piece_1?.isInteracted;
    const peg2 = puzzlesRef.current[8]?.stages?.pegs?.pieces?.piece_2?.isInteracted;
    const peg3 = puzzlesRef.current[8]?.stages?.pegs?.pieces?.piece_3?.isInteracted;

        if (peg1 && peg2 && peg3) {
          await updatePuzzleInFirebase("puzzle_9", "pegs", { "isSolved": true });
          setLoading(false)
          showAlertDialog({
            title: "Puzzle 9 stage 1 solved",
            message: "Table opened",
          });
        }
  }

  const closeTWdoor = async() => {
    setLoading(true)

    if(!isPreviousStepCompleted("pegs", 8)){
      setLoading(false)
      return
    } 

    await updateSensorInFirebase("TW_door", { isActive: false });

    const doorSensor = sensorsRef.current.find(sensor => sensor.id === "TW_door")?.isActive;

        if (!doorSensor) {
          await updateSensorInFirebase("skull_placement", { isActive: true });
          await updatePuzzleInFirebase("puzzle_9", "middle_table", { "actions.isActivated": true });
          await updatePuzzleInFirebase("puzzle_9", "middle_table", { "pieces.piece_1.isInteracted": true }); 
          setLoading(false)
          showAlertDialog({
            title: "Skull released",
            message: "Door closed, skull released, skull placement sensor activated",
          });
        }
  }

  const replaceSkull = async() => {
    setLoading(true)

    const doorSensor = sensorsRef.current.find(sensor => sensor.id === "TW_door")?.isActive;
    
    if(doorSensor){
      showAlertDialog({
        title: "Warning!",
        message: "You can not proceed to the next step of the game without completing the previous one!",
      });
      setLoading(false)
      return
    }

    await updatePuzzleInFirebase("puzzle_9", "middle_table", { "pieces.piece_1.isInteracted": false }); 
    await updatePuzzleInFirebase("puzzle_9", "middle_table", { "pieces.piece_2.isInteracted": true }); 

    const skull = puzzlesRef.current[8]?.stages?.middle_table?.pieces?.piece_1?.isInteracted;
    const replacementPiece = puzzlesRef.current[8]?.stages?.middle_table?.pieces?.piece_2?.isInteracted;

        if (!skull && replacementPiece) {
          await updatePuzzleInFirebase("puzzle_9", "middle_table", { "isSolved": true });
          await updatePuzzleStatus("puzzle_9", {"isSolved": true})
          await updateSensorInFirebase("TW_door", { isActive: true });
          setLoading(false)
          timerGameRef.current?.stop();
          const gameTime = getElapsed()
          showAlertDialog({
            title: "Puzzle 9 stage 2 solved",
            message: `Skull replaced, door opened. Game completed in ${gameTime} seconds!`,
          });
        }
  }

  const resetSensorsAndPuzzles = async() => {
    console.log("RESETTING.....")
    setLoading(true)
    setGameStarted(false)
    timerGameRef.current?.stop();
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
    await updatePuzzleInFirebase("puzzle_4", "gears", { "pieces.gears.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_4", "gears", { "isSolved": false });
    await updatePuzzleInFirebase("puzzle_4", "crank_rotation", { "actions.isActivated": false });
    await updateSensorInFirebase("sliding_door", { isActive: false });
    //puzzle 4 stage 2
    await updatePuzzleInFirebase("puzzle_4", "crank_rotation", { "piece.crank.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_5", "insert_ball", { "actions.isActivated": false });
    await updateSensorInFirebase("ball_locker", { isActive: false });
    await updatePuzzleInFirebase("puzzle_4", "crank_rotation", { "isSolved": false });
    await updatePuzzleStatus("puzzle_4", {"isSolved": false})
    //puzzle 5 stage 1
    await updatePuzzleInFirebase("puzzle_5", "insert_ball", { "pieces.ball.isInteracted": false });
    await updateSensorInFirebase("crank_hole", { isActive: false });
    await updatePuzzleInFirebase("puzzle_5", "crank_rotation_to_get_balls", { "actions.isActivated": false });
    await updatePuzzleInFirebase("puzzle_5", "insert_ball", { "isSolved": false });
    //Puzzle 5 stage 2
    await updatePuzzleInFirebase("puzzle_5", "crank_rotation_to_get_balls", { "pieces.crank.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_6", "weight", { "actions.isActivated": false });
    await updateSensorInFirebase("balls_releasing_mechanism", { isActive: false });
    await updatePuzzleInFirebase("puzzle_5", "crank_rotation_to_get_balls", { "isSolved": false });
    await updatePuzzleStatus("puzzle_5", {"isSolved": false})
    //Puzzle 6
    await updatePuzzleInFirebase("puzzle_6", "weight", { "pieces.piece_1.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_6", "weight", { "pieces.piece_2.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_6", "weight", { "pieces.piece_3.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_7", "wheels", { "actions.isActivated": false });
    await updatePuzzleInFirebase("puzzle_6", "weight", { "isSolved": false });
    await updatePuzzleStatus("puzzle_6", {"isSolved": false})
    //Puzzle 7 
    await updatePuzzleInFirebase("puzzle_7", "wheels", { "pieces.piece_1.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_7", "wheels", { "pieces.piece_2.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_7", "wheels", { "pieces.piece_3.isInteracted": false });
    await updateSensorInFirebase("dog_locker", { isActive: false });
    await updatePuzzleInFirebase("puzzle_8", "altar", { "actions.isActivated": false });
    await updatePuzzleInFirebase("puzzle_7", "wheels", { "isSolved": false });
    await updatePuzzleStatus("puzzle_7", {"isSolved": false})
    //Puzzle 8
    await updatePuzzleInFirebase("puzzle_8", "altar", { "pieces.piece_1.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_8", "altar", { "pieces.piece_2.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_8", "altar", { "pieces.piece_3.isInteracted": false });
    await updateSensorInFirebase("table_lock", { isActive: false });
    await updatePuzzleInFirebase("puzzle_9", "pegs", { "actions.isActivated": false });
    await updatePuzzleInFirebase("puzzle_8", "altar", { "isSolved": false });
    await updatePuzzleStatus("puzzle_8", {"isSolved": false})
    //Puzzle 9 stage 1
    await updatePuzzleInFirebase("puzzle_9", "pegs", { "pieces.piece_1.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_9", "pegs", { "pieces.piece_2.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_9", "pegs", { "pieces.piece_3.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_9", "pegs", { "isSolved": false });
    //Puzzle 9 stage 2
    await updateSensorInFirebase("skull_placement", { isActive: false });
    await updatePuzzleInFirebase("puzzle_9", "middle_table", { "actions.isActivated": false });
    await updatePuzzleInFirebase("puzzle_9", "middle_table", { "pieces.piece_1.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_9", "middle_table", { "pieces.piece_2.isInteracted": false });
    await updatePuzzleInFirebase("puzzle_9", "middle_table", { "isSolved": false });
    await updatePuzzleStatus("puzzle_9", {"isSolved": false})
    await updateSensorInFirebase("TW_door", { isActive: false });
    setLoading(false)
    console.log("RESETED.....")

    showAlertDialog({
      title: "Success!",
      message: "Reseted",
    });
  }

  return (
    <View style={styles.container}>
      <GameTimer ref={timerGameRef} durationMinutes={30}/>
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

      <Pressable style={styles.button} onPressIn={putGearsOnCorrectPlaces}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Collect and place all gears in correct order"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={crankRotationForGears}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Rotate crank for 5 seconds"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={insertBall}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Insert ball into the ball locker"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={crankRotationToGetBalls}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Rotate crank until two extra balls are released"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={weightPuzzle}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Put balls to the correct weight measuring places"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={placeWheelsInCorrectPosition}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Place wall wheels to the correct positions"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={putItemsOnAltar}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Put totems on the correct places"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={removeTablePegs}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Remove all table pegs and open the table"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={closeTWdoor}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Close the temple door"}
        </Text>
      </Pressable>

      <Pressable style={styles.button} onPressIn={replaceSkull}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Replce skull with the replacement item"}
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