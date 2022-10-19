import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Cross = () => {
  return (
    <View style={styles.mainCross}>
      <View style={styles.cross1} />
      <View style={[styles.cross1, styles.cross2]} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainCross: {
    width: 75,
    height: 75,
    left: 12,
    top: 12,
  },
  cross1: {
    position: "absolute",
    left: 32.5,
    width: 10,
    height: 75,
    backgroundColor: "#FFF",
    transform: [{ rotate: "45deg" }],
    borderRadius: 5,
  },
  cross2: {
    transform: [{ rotate: "-45deg" }],
  },
});

export default Cross;
