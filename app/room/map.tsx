import React, { useRef, useState } from "react";
import { View, StyleSheet, Animated, PanResponder, Pressable } from "react-native";
import Svg, { Rect, Circle, Text, Line } from "react-native-svg";
import { Alert } from "react-native";

const Map: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [isPushed, setIsPushed] = useState(false);
  const [isSecondSectionPushed, setIsSecondSectionPushed] = useState(false);

  const showAlertDialog = ({
    title,
    message,
    onConfirm,
    onCancel,
  }: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancel",
          onPress: onCancel,
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  };

  const handleEmergencyPress = () => {
    showAlertDialog({
      title: "Emergency Action",
      message: "Do you want to open the entrance door? This action will end up the game.",
      onConfirm: () => setIsPushed(false),
      onCancel: () => { },
    });
  };

  const handleTotemPress = () => {
    showAlertDialog({
      title: "Totem pieces",
      message: "Do you want to position the totem pieces? This will open the temple wall.",
      onConfirm: () => setIsSecondSectionPushed(false),
      onCancel: () => { },
    });
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
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={{
          transform: [{ scale }, { translateX }, { translateY }],
        }}
      >
        <Svg width={500} height={500} viewBox="-50 0 600 600">
          <Rect x={0} y={0} width={500} height={500} fill="none" stroke="black" strokeWidth={10} />

          {/* Entrance door */}
          {isPushed ?
            <Line x1={0} y1={400} x2={0} y2={480} stroke="brown" strokeWidth={5} onPressIn={() =>
              setIsPushed(false)}
            />
            :
            <Line x1={0} y1={400} x2={-40} y2={470} stroke="brown" strokeWidth={5} onPressIn={() =>
              setIsPushed(true)}
            />}

          {/* Emergency button next to entrance door */}
          <Rect x={18} y={490} width={10} height={6} fill="red" stroke="black" strokeWidth={1}
            onPressIn={handleEmergencyPress}
          />

          {/* Totem */}
          <Circle cx={440} cy={440} r={50} fill="darkgray" stroke="black" strokeWidth={1} onPressIn={handleTotemPress} />
          <Text x={414} y={448} fontSize={20}>Totem</Text>

          <Line x1={0} y1={350} x2={500} y2={350} stroke="black" strokeWidth={8} onPressIn={() =>
            showAlertDialog({
              title: "Temple wall",
              message: "This is the wall of the temple.",
              onConfirm: () => { },
              onCancel: () => { },
            })} />

          {/* Temple door */}
          {isSecondSectionPushed ? (
            <Line x1={250} y1={350} x2={340} y2={350} stroke="brown" strokeWidth={5} onPressIn={() =>
              setIsSecondSectionPushed(false)}
            />
          ) : (
            <Line x1={250} y1={350} x2={340} y2={310} stroke="brown" strokeWidth={5} onPressIn={() =>
              setIsSecondSectionPushed(true)}
            />
          )}

          <Rect x={295} y={415} width={40} height={30} fill="brown" stroke="black" strokeWidth={1} rotation={10} originX={315} originY={425} onPressIn={() =>
            showAlertDialog({
              title: "Diary",
              message: "This is the diary.",
              onConfirm: () => { },
              onCancel: () => { },
            })} />
          <Text x={300} y={435} fontSize={12}>Diary</Text>

          {/*Table */}
          <Rect x={160} y={120} width={180} height={100} fill="grey" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Table",
              message: "This is the table that has skull on it.",
              onConfirm: () => { },
              onCancel: () => { },
            })
          } />
          <Text x={300} y={205} fontSize={12}>Table</Text>

          {/*Replacement piece */}
          <Rect x={233} y={160} width={40} height={20} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Replacement piece",
              message: "This is the piece that you need to replaced by the skull.",
              onConfirm: () => { },
              onCancel: () => { },
            })
          } />
          <Text x={245} y={175} fontSize={10} fill="white">R.P</Text>

          {/* Shelf */}
          <Rect x={500} y={100} width={-30} height={200} fill="grey" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Shelf",
              message: "This is the shelf that has altar on it.",
              onConfirm: () => { },
              onCancel: () => { },
            })
          } />

          {/* Altar*/}
          <Circle cx={485} cy={150} r={14} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Altar place of star object",
              message: "This is the place that the star object needs to be placed. Star object is in the locker on the right side of the doorç",
              onConfirm: () => { },
              onCancel: () => { },
            })
          } />
          <Text x={482} y={155} fontSize={10} fill='white'>S</Text>

          <Circle cx={485} cy={190} r={14} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Altar place of dog object",
              message: "This is the place that the dog object needs to be placed.",
              onConfirm: () => { },
              onCancel: () => { },
            })
          } />
          <Text x={482} y={195} fontSize={10} fill='white'>D</Text>

          <Circle cx={485} cy={230} r={14} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Altar place of heart object",
              message: "This is the place that the heart object needs to be placed.",
              onConfirm: () => { },
              onCancel: () => { },
            })
          } />
          <Text x={482} y={235} fontSize={10} fill='white'>H</Text>

          {/* Dog Lock */}
          <Rect x={500} y={50} width={-20} height={50} fill="brown" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Dog Locker",
              message: "This is the locker that has the dog object.",
              onConfirm: () => { },
              onCancel: () => { },
            })
          } />



          {/* Living room */}
          {/* <Rect x={10} y={10} width={180} height={120} fill="lightgray" stroke="black" strokeWidth={2} />
            <Text x={20} y={30} fontSize={14}>Living room</Text> */}

          {/* Bedroom */}
          {/* <Rect x={10} y={130} width={120} height={120} fill="lightgray" stroke="black" strokeWidth={2} />
            <Text x={20} y={160} fontSize={14}>Bedroom</Text> */}

          {/* Kitchen */}
          {/* <Rect x={130} y={130} width={120} height={120} fill="lightgray" stroke="black" strokeWidth={2} />
            <Text x={150} y={160} fontSize={14}>Kitchen</Text> */}

          {/* Sofa */}
          {/* <Rect x={20} y={50} width={60} height={30} fill="brown" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Sofa",
              message: "This is the sofa.",
              onConfirm: () => { },
              onCancel: () => { },
            })
            } />
            <Text x={30} y={70} fontSize={10}>Sofa</Text> */}

          {/* Bed */}
          {/* <Rect x={30} y={180} width={60} height={30} fill="blue" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Bed",
              message: "This is the bed.",
              onConfirm: () => { },
              onCancel: () => { },
            })
            } />
            <Text x={40} y={200} fontSize={10}>Bed</Text> */}

          {/* Table */}
          {/* <Circle cx={180} cy={200} r={15} fill="darkgray" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Table",
              message: "This is the table.",
              onConfirm: () => { },
              onCancel: () => { },
            })
            } />
            <Text x={170} y={205} fontSize={10}>Table</Text> */}

          {/* <Line x1={130} y1={210} x2={130} y2={240} stroke="brown" strokeWidth={4} onPressIn={() =>
            showAlertDialog({
              title: "Door",
              message: "This is the door to the kitchen.",
              onConfirm: () => { },
              onCancel: () => { },
            })
            } /> */}
        </Svg>
        {/* <Pressable>
            <Text>Open the door to the living room</Text>
          </Pressable> */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Map;