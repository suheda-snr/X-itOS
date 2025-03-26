import React, { useRef, useState } from "react";
import { View, StyleSheet, Animated, PanResponder, Pressable, Text } from "react-native";
import Svg, { Rect, Circle, Text as SvgText, Line } from "react-native-svg";
import { Alert } from "react-native";

const Map: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const [openItem, setOpenItem] = useState<string | null>(null); // Track which item is open

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

  const toggleItem = (item: string) => {
    setOpenItem(openItem === item ? null : item); // Toggle open/close for the clicked item
  };

  const handleSensorPress = (sensor: string) => {
    showAlertDialog({
      title: "Sensor Activated",
      message: `You have activated the ${sensor} sensor.`,
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
    <View style={styles.outerContainer}>
      {/* Inventory section (left side) */}
      <View style={styles.inventoryContainer}>
        <Text style={styles.inventoryTitle}>Inventory</Text>
        <View style={styles.itemList}>
          {/* p.1.1. */}
          <View style={styles.itemContainer}>
            <Pressable onPress={() => toggleItem("p1.1")}>
              <Text style={styles.itemText}>
                p.1.1. {openItem === "p1.1" ? "▼" : "▶"}
              </Text>
            </Pressable>
            {openItem === "p1.1" && (
              <Text style={styles.itemDetails}>Details: [Add p.1.1. details here]</Text>
            )}
          </View>

          {/* p.1.2. */}
          <View style={styles.itemContainer}>
            <Pressable onPress={() => toggleItem("p1.2")}>
              <Text style={styles.itemText}>
                p.1.2. {openItem === "p1.2" ? "▼" : "▶"}
              </Text>
            </Pressable>
            {openItem === "p1.2" && (
              <Text style={styles.itemDetails}>Details: [Add p.1.2. details here]</Text>
            )}
          </View>
        </View>
      </View>

      {/* Map (center) */}
      <View style={styles.container} {...panResponder.panHandlers}>
        <Animated.View
          style={{
            transform: [{ scale }, { translateX }, { translateY }],
          }}
        >
          <Svg width={500} height={500} viewBox="-50 0 600 600">
            <Rect x={0} y={0} width={500} height={500} fill="none" stroke="black" strokeWidth={10} />

            {/* Entrance door */}
            <Line x1={0} y1={400} x2={0} y2={470} stroke="brown" strokeWidth={5} />

            {/* Temple wall P.1.1.stage field */}
            <Rect x={40} y={350} width={150} height={30} fill="grey" stroke="black" strokeWidth={1} onPressIn={() => { }} />

            {/* Temple wall stones P.1.1. */}
            <Circle cx={80} cy={366} r={12} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
              showAlertDialog({
                title: "Temple Wall Stone",
                message: "The first stage of the first puzzle. The stones needs to be touched in order to activate the light sensor.",
              })}
            />
            <SvgText x={72} y={370} fontSize={10} fill="white">P.1.1</SvgText>

            {/* Temple wall sign ligts S.1. */}
            <Circle cx={120} cy={366} r={12} fill="red" stroke="black" strokeWidth={1} onPressIn={() =>
              showAlertDialog({
                title: "Temple Wall Sign Light Sensor",
                message: "This is the light sensor that needs to be activated by touching the stones to be able to solve the totem stage.",
              })}
            />
            <SvgText x={113} y={370} fontSize={12}>S.1.</SvgText>

            {/* Totem P.1.2. */}
            <Circle cx={440} cy={440} r={50} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
              showAlertDialog({
                title: "Totem pieces",
                message: "The second stage of the first puzzle. The totem pieces needs to be placed in the correct order to open the door.",
              })}
            />
            <SvgText x={425} y={448} fontSize={14} fill="white">P.1.2.</SvgText>

            {/* Temple wall */}
            <Line x1={0} y1={350} x2={500} y2={350} stroke="black" strokeWidth={8} onPressIn={() =>
              showAlertDialog({
                title: "Temple wall",
                message: "This is the wall of the temple that prevents players to go further.",
              })}
            />

            <Line x1={250} y1={350} x2={340} y2={350} stroke="red" strokeWidth={5} onPressIn={() =>
              showAlertDialog({
                title: "Temple Door",
                message: "This is the temple door. The totem pieces needs to be placed in the correct order to open the door.",
              })
            }
            />
            <SvgText x={310} y={365} fontSize={12}>S.2.</SvgText>

            <Rect x={295} y={415} width={40} height={30} fill="brown" stroke="black" strokeWidth={1} rotation={10} originX={315} originY={425} onPressIn={() =>
              showAlertDialog({
                title: "Diary",
                message: "This is the diary.",
              })}
            />
            <SvgText x={300} y={435} fontSize={12}>Diary</SvgText>

            {/* Table */}
            <Rect x={160} y={120} width={180} height={100} fill="grey" stroke="black" strokeWidth={1} onPressIn={() =>
              showAlertDialog({
                title: "Table",
                message: "This is the table that has skull on it.",
              })}
            />
            <SvgText x={300} y={205} fontSize={12}>Table</SvgText>

            {/* Replacement piece */}
            <Rect x={233} y={160} width={40} height={20} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
              showAlertDialog({
                title: "Replacement piece",
                message: "This is the piece that you need to replaced by the skull.",
              })}
            />
            <SvgText x={245} y={175} fontSize={10} fill="white">R.P</SvgText>

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
            <SvgText x={482} y={155} fontSize={10} fill='white'>S</SvgText>

            <Circle cx={485} cy={190} r={14} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
              showAlertDialog({
                title: "Altar place of dog object",
                message: "This is the place that the dog object needs to be placed.",
              })}
            />
            <SvgText x={482} y={195} fontSize={10} fill='white'>D</SvgText>

            <Circle cx={485} cy={230} r={14} fill="black" stroke="black" strokeWidth={1} onPressIn={() =>
              showAlertDialog({
                title: "Altar place of heart object",
                message: "This is the place that the heart object needs to be placed.",
              })}
            />
            <SvgText x={482} y={235} fontSize={10} fill='white'>H</SvgText>

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

      {/* Sensors section (right side) */}
      <View style={styles.sensorsContainer}>
        <Text style={styles.sensorsTitle}>Sensors</Text>
        <Pressable
          style={styles.sensorButton}
          onPress={() => handleSensorPress("Sensor 1")}
        >
          <Text style={styles.sensorText}>Sensor 1</Text>
        </Pressable>
        <Pressable
          style={styles.sensorButton}
          onPress={() => handleSensorPress("Sensor 2")}
        >
          <Text style={styles.sensorText}>Sensor 2</Text>
        </Pressable>
        <Pressable
          style={styles.sensorButton}
          onPress={() => handleSensorPress("Sensor 3")}
        >
          <Text style={styles.sensorText}>Sensor 3</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: "row", // Arrange inventory, map, and sensors side by side
    alignItems: "center",
    justifyContent: "center",
  },
  inventoryContainer: {
    width: 150, // Fixed width for the inventory area
    marginRight: 20, // Space between inventory and map
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
    width: 150, // Fixed width for the sensors area
    marginLeft: 20, // Space between map and sensors
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