import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { Checkbox } from 'react-native-paper';

type Task = {
  id: string;
  title: string;
  startDate?: Date | null;
  endDate?: Date | null;
  category: string;
  priority: string;
  completed: boolean;
};

export default function DisplayTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const q = query(collection(firestore, 'tasks'), orderBy('startDate'));
        const querySnapshot = await getDocs(q);

        const taskList: Task[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          startDate: doc.data().startDate ? doc.data().startDate.toDate() : null,
          endDate: doc.data().endDate ? doc.data().endDate.toDate() : null,
          category: doc.data().category,
          priority: doc.data().priority,
          completed: doc.data().completed,
        }));

        setTasks(taskList);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchTasks();
  }, [refreshing]);

  const handleCheck = async (taskId: string, completed: boolean) => {
    try {
      const taskRef = doc(firestore, 'tasks', taskId);
      if (!completed) {
        await updateDoc(taskRef, { completed: true });
        await deleteDoc(taskRef);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case '!':
        return '#28a745';
      case '!!':
        return '#ffc107';
      case '!!!':
        return '#dc3545';
      default:
        return '#555';
    }
  };

  const renderTask: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => handleCheck(item.id, item.completed)}
          color="#006ee9"
        />
      </View>
      <View style={styles.taskDetailsContainer}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.startDate && item.endDate && (
          <Text style={styles.taskDates}>
            {`Start: ${item.startDate.toLocaleDateString()} | End: ${item.endDate.toLocaleDateString()}`}
          </Text>
        )}
        <Text style={styles.taskCategory}>{`Category: ${item.category}`}</Text>
        <Text
          style={[
            styles.taskPriority,
            { color: getPriorityColor(item.priority) },
          ]}
        >{`Priority: ${item.priority}`}</Text>
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
const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center', // Align checkbox and text
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  checkboxContainer: {
    width: 40, // Fixed width for the checkbox
    height: 40, // Fixed height for the checkbox
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Space between checkbox and details
    borderWidth: 2, // Add border
    borderColor: '#006ee9', // Border color for distinction
    borderRadius: 5, // Add some rounding for better aesthetics
    backgroundColor: '#fff', // Optional background for better contrast
  },
  taskDetailsContainer: {
    flex: 1, // Allow details to occupy remaining space
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskDates: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  taskCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006ee9',
    marginBottom: 5,
  },
  taskPriority: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


