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