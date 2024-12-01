import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name='index' options={{
      headerTitle: " Tasks",
    }} />
    <Stack.Screen name='addTask' options={{
      headerTitle: " Add Task",
    }} />
    <Stack.Screen name='calendar' options={{
      headerTitle: " Calendar",
    }} />
  </Stack>
);
}
