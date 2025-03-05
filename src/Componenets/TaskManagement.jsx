import { useContext, useState } from "react";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-all duration-300 border border-gray-300">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-lg">{task.title}</h3>
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(task)}
                className="text-blue-600 hover:text-blue-500 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-red-500 hover:text-red-400 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{task.description}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(task.timestamp).toLocaleDateString()}
        </span>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
          task.category === 'To-Do' ? 'bg-yellow-100 text-yellow-600' :
          task.category === 'In Progress' ? 'bg-blue-100 text-blue-600' :
          'bg-green-100 text-green-600'
        }`}>
          {task.category}
        </span>
      </div>
    </div>
  );
};

  
  const Container = ({ title, tasks, onEdit, onDelete }) => {
    return (
      <div className="bg-white rounded-xl p-6 min-h-[600px] border border-gray-300 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold text-blue-600">
            {title}
          </h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            {tasks.length}
          </span>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No tasks here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="draggable-task"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('taskId', task._id);
                }}
              >
                <TaskCard
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  
  const TaskManagement = () => {
    const axiosPublic = useAxiosPublic();
    const { user } = useContext(AuthContext);
    const [editingTask, setEditingTask] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [taskDetails, setTaskDetails] = useState({ title: '', description: '' });
  
    const { data: tasks = [], refetch } = useQuery({
      queryKey: ['tasks', user?.email],
      queryFn: async () => {
        const res = await axiosPublic.get(`/tasks/${user?.email}`);
        return res.data;
      }
    });
  
    const tasksByCategory = {
      'To-Do': tasks.filter(task => task.category === 'To-Do'),
      'In Progress': tasks.filter(task => task.category === 'In Progress'),
      'Done': tasks.filter(task => task.category === 'Done')
    };
  
    const handleDrop = async (e, targetCategory) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('taskId');
      const task = tasks.find(t => t._id === taskId);
      
      if (task && task.category !== targetCategory) {
        try {
          await axiosPublic.patch(`/tasks/${taskId}`, {
            category: targetCategory
          });
          refetch();
          toast.success('Task updated successfully!');
        } catch (error) {
          // console.error('Failed to update task category:', error);
          toast.error('Failed to update task category.');
        }
      }
    };
  
    const handleEdit = (task) => {
      setEditingTask(task);
      setTaskDetails({ title: task.title, description: task.description });
      setModalIsOpen(true);
    };
  
    const handleDelete = async (taskId) => {
      try {
        await axiosPublic.delete(`/tasks/${taskId}`);
        refetch();
        toast.success('Task deleted successfully!');
      } catch (error) {
        // console.error('Failed to delete task:', error);
        toast.error('Failed to delete task.');
      }
    };
  
    const handleModalClose = () => {
      setModalIsOpen(false);
      setEditingTask(null);
    };
  
    const handleModalSave = async () => {
      try {
        await axiosPublic.patch(`/tasks/${editingTask._id}`, taskDetails);
        refetch();
        toast.success('Task updated successfully!');
        handleModalClose();
      } catch (error) {
        // console.error('Failed to update task:', error);
        toast.error('Failed to update task.');
      }
    };
  
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold  mb-2">Task Management</h1>
            <p className="text-gray-900">Manage your efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
              <div
                key={category}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, category)}
                className="category-container"
              >
                <Container
                  title={category}
                  tasks={categoryTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
  
      
  
          {modalIsOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-[#1B1D21] rounded-xl p-6 w-full max-w-lg shadow-2xl border border-gray-700">
                <h2 className="text-2xl font-semibold text-[#38A1DB] mb-6">Edit Task</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="title">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={taskDetails.title}
                      onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
                      className="w-full px-4 py-2 bg-[#212428] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#38A1DB] focus:border-[#38A1DB] transition-colors text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={taskDetails.description}
                      onChange={(e) => setTaskDetails({ ...taskDetails, description: e.target.value })}
                      className="w-full px-4 py-2 bg-[#212428] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#38A1DB] focus:border-[#38A1DB] transition-colors text-gray-200 h-32"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleModalSave}
                      className="px-6 py-2 bg-gradient-to-r from-[#294C5F] to-[#212428]  text-white rounded-lg hover:from-[#212428] hover:to-[#294C5F] border border-[#38A1DB] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        
        <style jsx>{`
          .draggable-task {
            cursor: move;
          }
          .category-container {
            min-height: 200px;
          }
        `}</style>
      </div>
    );
  };
  
  export default TaskManagement;