import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function addTask() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Add task</Text>

    </View>
  );
}

const styles = StyleSheet.create({

    button: {
    
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#1e1e1e"
    },
    
    })