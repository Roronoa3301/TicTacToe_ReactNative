import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Cross from "./Cross";

const Cell = (props) => {
  const { cell, onPress } = props;
  return (
    <Pressable onPress={() => onPress()} style={styles.cell}>
      {cell === "x" && <Cross/>}
      {cell === "o" && <View style={styles.donut} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    flex: 1,
    left: 3,
    top: 3,
  },
  donut: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: '#1F174F',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFF',
    borderWidth: 10,
    margin: 10,
    
  }, 
});

export default Cell;
