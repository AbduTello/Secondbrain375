import { Link } from "expo-router";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { Checkbox } from 'react-native-paper';

// Define the Task type
type Task = {
  id: string;
  title: string;
  dueDate: Date; // Converted Firestore Timestamp to Date
  completed: boolean;
};

export default function Index() {
  // Define the state with proper types
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Query Firestore for tasks
        const q = query(collection(firestore, 'tasks'), orderBy('dueDate'));
        const querySnapshot = await getDocs(q);

        // Map Firestore data into Task objects
        const taskList: Task[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          dueDate: doc.data().dueDate.toDate(), // Convert Firestore Timestamp to Date
          completed: doc.data().completed,
        }));

        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // Optionally handle the error gracefully
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchTasks();
  }, [refreshing]);

  // Function to handle checkbox toggle
  const handleCheck = async (taskId: string, completed: boolean) => {
    try {
      const taskRef = doc(firestore, "tasks", taskId);
      await updateDoc(taskRef, { completed: !completed });

      // Update local state directly to avoid refetching
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Render function for each task
  const renderTask: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskItem}>
      <Checkbox
        status={item.completed ? 'checked' : 'unchecked'}
        onPress={() => handleCheck(item.id, item.completed)}
      />
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDetails}>
          Due: {item.dueDate.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderTask}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
    />
  );
}

// Define styles
const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 14,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

