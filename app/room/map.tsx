import React, { useRef, useState } from "react";
import { View, StyleSheet, Alert, Animated, PanResponder, Pressable } from "react-native";
import Svg, { Rect, Circle, Text, Line } from "react-native-svg";

const Map: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current; // For zooming
  const translateX = useRef(new Animated.Value(0)).current; // Horizontal pan
  const translateY = useRef(new Animated.Value(0)).current; // Vertical pan
  const [isPushed, setIsPushed] = useState(false)

  const handlePress = (item: string) => {
    console.log(`You clicked on: ${item}`);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        if (gesture.numberActiveTouches === 2) {
          // Pinch to zoom (optional)
          const newScale = Math.max(0.5, Math.min(3, scale._value + gesture.dx * 0.001));
          scale.setValue(newScale);
        } else {
          // Drag to pan
          translateX.setValue(gesture.dx);
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: () => {
        // Reset panning if needed
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={{
          transform: [{ scale }, { translateX }, { translateY }],
        }}
      >
        <Svg width={300} height={400}>
          {/* Living room */}
          <Rect x={10} y={10} width={180} height={120} fill="lightgray" stroke="black" strokeWidth={2} />
          <Text x={20} y={30} fontSize={14}>Living room</Text>

          {/* Bedroom */}
          <Rect x={10} y={130} width={120} height={120} fill="lightgray" stroke="black" strokeWidth={2} />
          <Text x={20} y={160} fontSize={14}>Bedroom</Text>

          {/* Kitchen */}
          <Rect x={130} y={130} width={120} height={120} fill="lightgray" stroke="black" strokeWidth={2} />
          <Text x={150} y={160} fontSize={14}>Kitchen</Text>

          {/* Sofa */}
          <Rect x={20} y={50} width={60} height={30} fill="brown" stroke="black" strokeWidth={1} onPressIn={() => Alert.alert("Sofa")} />
          <Text x={30} y={70} fontSize={10}>Sofa</Text>

          {/* Bed */}
          <Rect x={30} y={180} width={60} height={30} fill="blue" stroke="black" strokeWidth={1} onPressIn={() => Alert.alert("Bed")} />
          <Text x={40} y={200} fontSize={10}>Bed</Text>

          {/* Table */}
          <Circle cx={180} cy={200} r={15} fill="darkgray" stroke="black" strokeWidth={1} onPressIn={() => Alert.alert("Table")} />
          <Text x={170} y={205} fontSize={10}>Table</Text>

          {/* Doors */}
          {isPushed ? 
                      <Line x1={80} y1={100} x2={120} y2={130} stroke="brown" strokeWidth={4} onPressIn={() => setIsPushed(false)} />
                      :
                      <Line x1={80} y1={130} x2={120} y2={130} stroke="brown" strokeWidth={4} onPressIn={() => setIsPushed(true)} />

          }
          <Line x1={130} y1={210} x2={130} y2={240} stroke="brown" strokeWidth={4} onPressIn={() => Alert.alert("Door to kitchen")} />
        </Svg>
        <Pressable>
        <Text>Open the door to the living room</Text>
      </Pressable>
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

