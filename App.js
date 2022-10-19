import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ImageBackground, Pressable, Alert } from 'react-native';
import bg from './assets/bg.jpg';
import Cell from './src/components/Cell';

export default function App() {
  const [gameMode, setGameMode] = useState("MEDIUM"); // LOCAL, EASY, MEDIUM

  const emptyGameMap = [
    ["", "", ""], // The first row
    ["", "", ""], // The second row
    ["", "", ""], // The third row
  ];

  const copyGameMap = (originalMap) => {
    const copy = originalMap.map((arr) => {
      return arr.slice();
    });
    console.log(copy);
    return copy;
  };

  const [gameMap, setGameMap] = useState(emptyGameMap);

  const [turn, setTurn] = useState("x");

  useEffect(() => {
    if(turn === "o" && gameMode !== "LOCAL") {
      botTurn();
    }
  }, [turn, gameMode]);

  useEffect(() => {
    const winner =  checkForWinningState(gameMap);
    if (winner) {
      gameWonAlert(winner);
    }
    else{
      checkForTieState();
    }
  }, [gameMap]);

  const onTap = (rowIndex, columnIndex) => {
    // console.warn("Tap", rowIndex, columnIndex);
    if (gameMap[rowIndex][columnIndex] !== "") {
      Alert.alert("Invalid move");
      return;
    }

    setGameMap((prevGameMap) => {
      const newGameMap = [...prevGameMap];
      newGameMap[rowIndex][columnIndex] = turn;
      return newGameMap;
    });

    setTurn(turn === "x" ? "o" : "x");
  }

  const checkForWinningState = (winnerGameMap) => {
    // Check for a horizontal win
    for (let i = 0; i < 3; i++) {
      const isHorizontalXWinning = winnerGameMap[i].every((cell) => cell === "x");
      const isHorizontalOWinning = winnerGameMap[i].every((cell) => cell === "o");
      if(isHorizontalXWinning) {
        return "X";
        
      }
      if(isHorizontalOWinning) {
        return "O";
      }
    }
    // Check for a vertical win
    for(let col = 0; col < 3; col++) {
      let isVerticalXWinning = true;
      let isVerticalOWinning = true;

      for(let row = 0; row < 3; row++) {
        if(winnerGameMap[row][col] !== "x") {
          isVerticalXWinning = false;
        }
        if(winnerGameMap[row][col] !== "o") {
          isVerticalOWinning = false;
        }
      }
      if(isVerticalXWinning) {
        return "X";
       
      }
      if(isVerticalOWinning) {
        return "O";
       
      }
    }

    // Check for a diagonal win
    let isDiagonal1XWinning = true;
    let isDiagonal1OWinning = true;
    let isDiagonal2XWinning = true;
    let isDiagonal2OWinning = true;

    for (let i = 0; i < 3; i++) {
      if(winnerGameMap[i][i] !== "x") {
        isDiagonal1XWinning = false;
      }
      if(winnerGameMap[i][i] !== "o") {
        isDiagonal1OWinning = false;
      }
      if(winnerGameMap[i][2-i] !== "x") {
        isDiagonal2XWinning = false;
      }
      if(winnerGameMap[i][2-i] !== "o") {
        isDiagonal2OWinning = false;
      }
    }

    if(isDiagonal1XWinning || isDiagonal2XWinning) {
      return "X";
      
    }
    if(isDiagonal1OWinning || isDiagonal2OWinning) {
      return "O";
      
    }
  };

  const checkForTieState = () => {
    if(!gameMap.some(row => row.some(cell => cell === ""))) {
      Alert.alert(`Tough Luck`, `It's a Tie` ,[{
        text: "Play again",
        onPress: resetGame
      }]);
    }
  };

  const gameWonAlert = (player) => {
    Alert.alert(`Congratulations!`, `Player ${player} won!`, [{
      text: "Play again",
      onPress: resetGame
    }]);
  };
  
  const resetGame = () => {
    setGameMap(emptyGameMap);
    setTurn("x");
  };

  const botTurn = () => {
    // Find all possible options
    const possibleOptions = [];
    gameMap.forEach((row, rowIndex) =>{
      row.forEach((cell, columnIndex) => {
        if(cell === "") {
          possibleOptions.push({row: rowIndex, col: columnIndex});
        }
      });
    });

    let chosenPosition;

    if(gameMode === "MEDIUM") {
      //Play Offensively
      possibleOptions.forEach((option) => {
        const mapCopy = copyGameMap(gameMap);
        mapCopy[option.row][option.col] = "o";

        const winner = checkForWinningState(mapCopy);
        if(winner === "o") {
          //Attack that specific position
          chosenPosition = option;
        }
      });

      if(!chosenPosition) {
        //Play Defensively
        //Check for possible winning moves by the opponent
        possibleOptions.forEach((option) => {
          const mapCopy = copyGameMap(gameMap);
          mapCopy[option.row][option.col] = "x";

          const winner = checkForWinningState(mapCopy);
          if(winner === "x") {
            //Defend that specific position
            chosenPosition = option;
          }
        });
      }
    }

    //Choose randomly
    if(!chosenPosition) {
      chosenPosition = possibleOptions[Math.floor(Math.random() * possibleOptions.length)];
    }
    if (chosenPosition) {
      onTap(chosenPosition.row, chosenPosition.col);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain" >
        <Text style={{
          fontSize: 30,
          color: "#E36910",
          position: "absolute",
          top: 50,
        }}>Current Turn: {turn.toUpperCase()}</Text>
        <View style={styles.map}>
          {gameMap.map((row, rowIndex) => (
            // <Row key={`row-${rowIndex}`} row={row} rowIndex={rowIndex} onTap={onTap(rowIndex, columnIndex)}/>
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Cell key={`row-${rowIndex}-col-${columnIndex}`} cell={cell} onPress={() => onTap(rowIndex, columnIndex)}/>
              ))}
            </View>
          ))}
        </View> 
        <View style={styles.gameModeButtons}>
          <Text onPress={()=> setGameMode("LOCAL")} style={[styles.button, {backgroundColor: gameMode === "LOCAL"? "#54489E" : "#080133"}]}>LOCAL</Text>
          <Text onPress={()=> setGameMode("EASY")} style={[styles.button, {backgroundColor: gameMode === "EASY"? "#54489E" : "#080133"}]}>EASY</Text>
          <Text onPress={()=> setGameMode("MEDIUM")} style={[styles.button, {backgroundColor: gameMode === "MEDIUM"? "#54489E" : "#080133"}]}>MEDIUM</Text>
        </View> 
        
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F174F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '5%',
  },
  map: {
    width: '80%',
    aspectRatio: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  gameModeButtons: {
    position: "absolute",
    flexDirection: "row",
    bottom: 50,
  },
  button: {
    color: "#E36910",
    margin: 10,
    fontSize: 20,
    backgroundColor: "#080133",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});
