import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskList from "./TaskList";
import { AuthContext } from "../AuthProvider/AuthProvider";

const Home = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState({ title: "", description: "", category: "To-Do" });
  const [activeTask, setActiveTask] = useState(null);
  const categories = ["To-Do", "In Progress", "Done"];

  // Fetch tasks for the current user only, filtering by email
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user.email],
    queryFn: async () => {
      const res = await axios.get("https://task-master-server-side-theta.vercel.app/tasks", { params: { email: user.email } });
      return res.data;
    },
  });

  // Add a new task (include user email)
  const addTaskMutation = useMutation({
    mutationFn: async (taskData) => 
      axios.post("https://task-master-server-side-theta.vercel.app/tasks", { ...taskData, email: user.email }),
    onSuccess: () => queryClient.invalidateQueries(["tasks", user.email]),
  });

  // Update task (for editing or moving between categories)
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updatedFields }) =>
      axios.put(`https://task-master-server-side-theta.vercel.app/tasks/${id}`, { ...updatedFields, email: user.email }),
    onSuccess: () => queryClient.invalidateQueries(["tasks", user.email]),
  });

  // Reorder tasks mutation with optimistic update
  const reorderMutation = useMutation({
    mutationFn: async (updatedTasks) =>
      axios.put("https://task-master-server-side-theta.vercel.app/tasks/reorder", updatedTasks, { params: { email: user.email } }),
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["tasks", user.email]);
      const previousTasks = queryClient.getQueryData(["tasks", user.email]);
      queryClient.setQueryData(["tasks", user.email], (old = []) => {
        return old.map((task) => {
          const updated = payload.find((p) => p._id === task._id);
          return updated ? { ...task, order: updated.order } : task;
        });
      });
      return { previousTasks };
    },
    onError: (err, payload, context) => {
      queryClient.setQueryData(["tasks", user.email], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["tasks", user.email]);
    },
  });

  // Handle new task submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    addTaskMutation.mutate(newTask);
    setNewTask({ title: "", description: "", category: "To-Do" });
  };

  // Handle drag start: store active task for DragOverlay
  const handleDragStart = ({ active }) => {
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task);
  };

  // Handle drag end: update ordering or category as needed
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
  
    const activeTaskItem = tasks.find((t) => t._id === active.id);
    if (!activeTaskItem) return;
  
    // Handle container drops (category columns)
    if (over.data?.current?.type === "container") {
      const targetCategory = over.data.current.category;
      
      if (activeTaskItem.category !== targetCategory) {
        // Move to different category
        updateTaskMutation.mutate({ id: active.id, category: targetCategory });
      } else {
        // Reorder within same category (move to end)
        const categoryTasks = tasks.filter((t) => t.category === targetCategory);
        const oldIndex = categoryTasks.findIndex((t) => t._id === active.id);
        if (oldIndex === -1) return;
        
        // Move to end of the list
        const updatedCategoryTasks = [
          ...categoryTasks.filter((t) => t._id !== active.id),
          activeTaskItem
        ];
        
        const payload = updatedCategoryTasks.map((task, index) => ({
          _id: task._id,
          order: index + 1,
        }));
        reorderMutation.mutate(payload);
      }
      return;
    }
  
    // Handle task-to-task drops
    const overTask = tasks.find((t) => t._id === over.id);
    if (!overTask) return;
  
    if (activeTaskItem.category === overTask.category) {
      // Same category reordering
      const categoryTasks = tasks.filter((t) => t.category === activeTaskItem.category);
      const oldIndex = categoryTasks.findIndex((t) => t._id === active.id);
      const newIndex = categoryTasks.findIndex((t) => t._id === over.id);
      
      if (oldIndex === -1 || newIndex === -1) return;
      const updatedCategoryTasks = arrayMove(categoryTasks, oldIndex, newIndex);
      
      const payload = updatedCategoryTasks.map((task, index) => ({
        _id: task._id,
        order: index + 1,
      }));
      reorderMutation.mutate(payload);
    } else {
      // Move to different category
      updateTaskMutation.mutate({ id: active.id, category: overTask.category });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Task Management</h1>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add a New Task</h2>
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
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Add Task
        </button>
      </form>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <TaskList key={category} category={category} tasks={tasks} />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="p-2 bg-white border rounded-md shadow-lg opacity-70">
                <h3 className="font-medium">{activeTask.title}</h3>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default Home;
