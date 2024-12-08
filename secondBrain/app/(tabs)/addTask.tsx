import { Link } from "expo-router";
import { useState } from 'react';
import { View, TextInput, StyleSheet, Button, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

export default function AddTask() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<'School' | 'Work' | 'Gym' | 'Personal'>('School');
  const [priority, setPriority] = useState<'!' | '!!' | '!!!'>('!');
  const [dueDate, setDueDate] = useState<Date>(new Date());

  const handleAddTask = async () => {
    try {
      await addDoc(collection(firestore, 'tasks'), {
        title,
        description,
        category,
        priority,
        dueDate: Timestamp.fromDate(dueDate),
        completed: false,
      });
      console.log('Task added successfully!');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setCategory(itemValue as 'School' | 'Work' | 'Gym' | 'Personal')
            }
          >
            <Picker.Item label="School" value="School" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Gym" value="Gym" />
            <Picker.Item label="Personal" value="Personal" />
          </Picker>
        </View>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={priority}
            style={styles.picker}
            onValueChange={(itemValue) => setPriority(itemValue as '!' | '!!' | '!!!')}
          >
            <Picker.Item label="!" value="!" />
            <Picker.Item label="!!" value="!!" />
            <Picker.Item label="!!!" value="!!!" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Due Date (YYYY-MM-DD)"
          value={dueDate.toISOString().slice(0, 10)}
          onChangeText={(dateStr) => {
            try {
              const date = new Date(dateStr);
              if (!isNaN(date.getTime())) {
                setDueDate(date);
              } else {
                throw new Error('Invalid date');
              }
            } catch (error) {
              console.error('Invalid date format', error);
            }
          }}
        />
        <Button title="Add Task" onPress={handleAddTask} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    height: 60, // Adjust height for better visibility
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

