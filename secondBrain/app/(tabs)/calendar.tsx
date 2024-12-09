import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

type Task = {
  id: string;
  title: string;
  startDate?: Date | null;
  endDate?: Date | null;
  category: string;
  priority: string;
  completed: boolean;
};

type DayObject = {
  dateString: string; // e.g., "2024-12-08"
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  ); // Today's date in YYYY-MM-DD format
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Parse selectedDate as local time
        const selectedDateLocal = new Date(selectedDate); // Local time
        console.log("Selected Date (Local):", selectedDateLocal);
  
        // Calculate start and end of the day explicitly in UTC
        const startOfDayUTC = new Date(
          selectedDateLocal.getUTCFullYear(),
          selectedDateLocal.getUTCMonth(),
          selectedDateLocal.getUTCDate(),
          0, 0, 0 // Midnight UTC
        );
        const endOfDayUTC = new Date(
          selectedDateLocal.getUTCFullYear(),
          selectedDateLocal.getUTCMonth(),
          selectedDateLocal.getUTCDate(),
          23, 59, 59, 999 // End of day UTC
        );
  
        console.log("Start of Day (UTC):", startOfDayUTC.toISOString());
        console.log("End of Day (UTC):", endOfDayUTC.toISOString());
  
        // Firestore query using the calculated UTC boundaries
        const q = query(
          collection(firestore, 'tasks'),
          where('startDate', '>=', startOfDayUTC),
          where('startDate', '<=', endOfDayUTC)
        );
  
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
  
        console.log("Fetched Tasks:", taskList);
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [selectedDate]);
  
  

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

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      {item.startDate && item.endDate && (
        <Text style={styles.taskDates}>
          {`Start: ${item.startDate.toLocaleDateString()} | End: ${item.endDate.toLocaleDateString()}`}
        </Text>
      )}
      <Text style={styles.taskCategory}>{`Category: ${item.category}`}</Text>
      <Text
        style={[styles.taskPriority, { color: getPriorityColor(item.priority) }]}
      >{`Priority: ${item.priority}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DayObject) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#006ee9' },
        }}
      />
      <View style={styles.taskListContainer}>
        <Text style={styles.taskListHeader}>{`Tasks for ${selectedDate}`}</Text>
        {loading ? (
          <Text>Loading tasks...</Text>
        ) : tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={styles.noTasksText}>No tasks for this date.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  taskListContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#006ee9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10, // Overlap the calendar slightly
  },
  taskListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
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
  noTasksText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
    fontSize: 16,
  },
});

