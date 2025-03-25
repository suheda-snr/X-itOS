import React, { useRef } from "react";
import { View, StyleSheet, Animated, PanResponder } from "react-native";
import Svg, { Rect, Circle, Text, Line } from "react-native-svg";
import { Alert } from "react-native";

const Map: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const showAlertDialog = ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => {
    Alert.alert(
      title,
      message,
      [{ text: "OK" }],
      { cancelable: true }
    );
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

          {/* Entrance door (static, closed, aligned with left wall) */}
          <Line x1={0} y1={400} x2={0} y2={470} stroke="brown" strokeWidth={5} />

          {/* Totem */}
          <Circle cx={440} cy={440} r={50} fill="darkgray" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Totem pieces",
              message: "Do you want to position the totem pieces?",
            })}
          />
          <Text x={414} y={448} fontSize={20}>Totem</Text>

          <Line x1={0} y1={350} x2={500} y2={350} stroke="black" strokeWidth={8} onPressIn={() =>
            showAlertDialog({
              title: "Temple wall",
              message: "This is the wall of the temple.",
            })}
          />

          {/* Temple door (static, closed, aligned with temple wall) */}
          <Line x1={250} y1={350} x2={340} y2={350} stroke="brown" strokeWidth={5} />

          <Rect x={295} y={415} width={40} height={30} fill="brown" stroke="black" strokeWidth={1} rotation={10} originX={315} originY={425} onPressIn={() =>
            showAlertDialog({
              title: "Diary",
              message: "This is the diary.",
            })}
          />
          <Text x={300} y={435} fontSize={12}>Diary</Text>

          {/* Table */}
          <Rect x={160} y={120} width={180} height={100} fill="grey" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Table",
              message: "This is the table that has skull on it.",
            })}
          />
          <Text x={300} y={205} fontSize={12}>Table</Text>

          {/* Replacement piece */}
          <Rect x={233} y={160} width={40} height={20} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Replacement piece",
              message: "This is the piece that you need to replaced by the skull.",
            })}
          />
          <Text x={245} y={175} fontSize={10} fill="white">R.P</Text>

          {/* Shelf */}
          <Rect x={500} y={100} width={-30} height={200} fill="grey" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Shelf",
              message: "This is the shelf that has altar on it.",
            })}
          />

          {/* Altar */}
          <Circle cx={485} cy={150} r={14} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Altar place of star object",
              message: "This is the place that the star object needs to be placed. Star object is in the locker on the right side of the doorç",
            })}
          />
          <Text x={482} y={155} fontSize={10} fill='white'>S</Text>

          <Circle cx={485} cy={190} r={14} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Altar place of dog object",
              message: "This is the place that the dog object needs to be placed.",
            })}
          />
          <Text x={482} y={195} fontSize={10} fill='white'>D</Text>

          <Circle cx={485} cy={230} r={14} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Altar place of heart object",
              message: "This is the place that the heart object needs to be placed.",
            })}
          />
          <Text x={482} y={235} fontSize={10} fill='white'>H</Text>

          {/* Dog Lock */}
          <Rect x={500} y={50} width={-20} height={50} fill="brown" stroke="black" strokeWidth={1} onPressIn={() =>
            showAlertDialog({
              title: "Dog Locker",
              message: "This is the locker that has the dog object.",
            })}
          />
        </Svg>
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