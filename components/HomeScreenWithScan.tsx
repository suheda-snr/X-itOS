import { Image, StyleSheet, Platform, View, Text, Pressable } from 'react-native';
import React from 'react'

export default function HomeScreenWithScan() {
  return (
    <View style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent:"center"}}>
        <Text>X-ITOS</Text>
        <Pressable onPress={() => alert("Navigate to scan QR")}>
            <Text>Scan QR code</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
