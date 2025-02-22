import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

const Task = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
  const queryClient = useQueryClient();

  const style = { transform: CSS.Transform.toString(transform), transition };

  // Mutation to edit task (title & description)
  const editMutation = useMutation({
    mutationFn: async ({ title, description }) => {
      return await axios.put(`http://localhost:5000/tasks/${task._id}`, { title, description });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh tasks after update
    },
  });

  // Mutation to delete task
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await axios.delete(`http://localhost:5000/tasks/${task._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refresh tasks after delete
    },
  });

  // Handle Task Edit (Title & Description)
  const handleEdit = async (e) => {
    e.stopPropagation(); // Fix: Prevents drag interference

    const { value: formValues } = await Swal.fire({
      title: "Edit Task",
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Title" value="${task.title}">
        <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${task.description || ""}</textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        return {
          title: document.getElementById("swal-title").value.trim(),
          description: document.getElementById("swal-description").value.trim(),
        };
      },
    });

    if (formValues && formValues.title) {
      editMutation.mutate(formValues);
    }
  };

  // Handle Task Delete
  const handleDelete = async (e) => {
    e.stopPropagation(); // Fix: Prevents drag interference

    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate();
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="p-2 bg-white border rounded-md shadow-md my-2">
      <h3 className="font-medium">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <div className="mt-2 flex justify-between">
        <button onClick={handleEdit} onPointerDownCapture={(e) => e.stopPropagation()} className="text-blue-500">Edit</button>
        <button onClick={handleDelete} onPointerDownCapture={(e) => e.stopPropagation()} className="text-red-500">Delete</button>
      </div>
    </div>
  );
};

export default Task;
