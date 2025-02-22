import React, { useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthProvider/AuthProvider";

const Task = ({ task }) => {
  const { user } = useContext(AuthContext);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const queryClient = useQueryClient();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  // Mutation to edit task (title & description)
  const editMutation = useMutation({
    mutationFn: async ({ title, description }) =>
      await axios.put(`https://task-master-server-side-theta.vercel.app/tasks/${task._id}`, { title, description, email: user.email }),
    onSuccess: () => queryClient.invalidateQueries(["tasks", user.email]),
  });

  const handleEdit = async (e) => {
    e.stopPropagation();
    const { value: formValues } = await Swal.fire({
      title: "Edit Task",
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Title" value="${task.title}">
        <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${task.description || ""}</textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => ({
        title: document.getElementById("swal-title").value.trim(),
        description: document.getElementById("swal-description").value.trim(),
      }),
    });
    if (formValues?.title) {
      editMutation.mutate(formValues);
    }
  };

  // Mutation to delete a task
  const deleteMutation = useMutation({
    mutationFn: async () =>
      await axios.delete(`https://task-master-server-side-theta.vercel.app/tasks/${task._id}`, { data: { email: user.email } }),
    onSuccess: () => queryClient.invalidateQueries(["tasks", user.email]),
  });

  const handleDelete = async (e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      deleteMutation.mutate();
    }
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="p-2 bg-white border rounded-md shadow-md my-2">
      {isDragging && (
        <div className="absolute top-0 left-0 px-2 py-1 bg-gray-200 text-gray-700 rounded opacity-50 pointer-events-none">
          {task.title}
        </div>
      )}
      <h3 className="font-medium">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={handleEdit} onPointerDownCapture={(e) => e.stopPropagation()} className="text-blue-500 hover:underline">
          Edit
        </button>
        <button onClick={handleDelete} onPointerDownCapture={(e) => e.stopPropagation()} className="text-red-500 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
