import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
  <Tabs>
    <Tabs.Screen name='index' options={{
      headerTitle: " Tasks",
    }} />
    <Tabs.Screen name='addTask' options={{
      headerTitle: " Add Task",
    }} />
    <Tabs.Screen name='calendar' options={{
      headerTitle: " Calendar",
    }} />
  </Tabs>
);
}
