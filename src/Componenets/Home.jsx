import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskList from "./TaskList"; // Task UI component

const Home = () => {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState({ title: "", description: "", category: "To-Do" });

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/tasks");
      return res.data;
    },
  });

  // Add a new task
  const addTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      return await axios.post("http://localhost:5000/tasks", taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Update task (edit or move to another category)
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updatedFields }) => {
      return await axios.put(`http://localhost:5000/tasks/${id}`, updatedFields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Delete a task
  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`http://localhost:5000/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Handle new task submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    addTaskMutation.mutate({
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
    });

    // Clear form
    setNewTask({ title: "", description: "", category: "To-Do" });
  };

  // Handle drag-and-drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const movedTask = tasks.find((task) => task._id === active.id);
    if (!movedTask) return;

    const newCategory = over.id;
    if (movedTask.category !== newCategory) {
      updateTaskMutation.mutate({ id: active.id, category: newCategory });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Task Management</h1>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-md">
        <h2 className="text-lg font-semibold">Add a New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full p-2 border rounded mt-2"
          required
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full p-2 border rounded mt-2"
        />
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          className="w-full p-2 border rounded mt-2"
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit" className="mt-3 p-2 bg-blue-500 text-white rounded">Add Task</button>
      </form>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-3 gap-4">
            {["To-Do", "In Progress", "Done"].map((category) => (
              <TaskList key={category} category={category} tasks={tasks} />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default Home;
