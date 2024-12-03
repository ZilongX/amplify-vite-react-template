import React, { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

// Initialize the Amplify client for interacting with the data layer
const client = generateClient<Schema>();

function App() {
  // State to store the list of todos
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);
  const [selectedTodo, setSelectedTodo] = useState<string>(''); // State to store selected todo option from dropdown

  // Predefined todo options for the dropdown
  const todoOptions = ['Buy groceries', 'Finish project', 'Call a friend', 'Walk the dog'];

  // Effect to subscribe to the Todo data changes
  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        setTodos(data.items);
      },
    });

    // Cleanup subscription when the component is unmounted
    return () => subscription.unsubscribe();
  }, []);

  // Function to create a new todo item based on the selected option from the dropdown
  const createTodo = () => {
    if (selectedTodo) {
      client.models.Todo.create({ content: selectedTodo });
      setSelectedTodo(''); // Clear the selected option after creating the todo
    } else {
      alert('Please select a todo content from the dropdown.');
    }
  };

  return (
    <main>
      <h1>My Todos</h1>
      
      <label htmlFor="todo-select">Choose a todo content:</label>
      <select
        id="todo-select"
        value={selectedTodo}
        onChange={(e) => setSelectedTodo(e.target.value)}
      >
     
