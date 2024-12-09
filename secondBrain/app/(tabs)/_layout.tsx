import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
  <Tabs
    screenOptions={{
        tabBarActiveTintColor: "#006EE9",
    }}
  >
    <Tabs.Screen name='index' options={{
      headerTitle: " Tasks",
      tabBarLabel: "Tasks",
      tabBarIcon: ({focused, color}) => <Ionicons name={focused ? "checkmark-circle-sharp" : "checkmark-circle-outline"}
      color={"#006EE9"}
      size={25} />
    }} />

    <Tabs.Screen name='addTask' options={{
      headerTitle: " Add Task",
      tabBarIcon: ({focused, color}) => <Ionicons name={focused ? "add-circle-sharp" : "add-circle-outline"}
      color={"#006EE9"}
      size={25} />

    }} />
    <Tabs.Screen name='calendar' options={{
      headerTitle: " Calendar",
      tabBarIcon: ({focused, color}) => <Ionicons name={focused ? "calendar-sharp" : "calendar-outline"}
      color={"#006EE9"}
      size={25} />
    }} />
  </Tabs>
);
}
