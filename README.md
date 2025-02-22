

# Task Management Application

## Overview

This is a full-stack Task Management Application that allows users to create, edit, delete, reorder, and drag tasks between three categories: **To-Do**, **In Progress**, and **Done**. The app features a smooth, professional drag-and-drop interface powered by [dnd-kit](https://github.com/clauderic/dnd-kit) and real-time data updates using [TanStack Query](https://tanstack.com/query/latest). The backend is built with Express.js and MongoDB (using the native driver) and provides endpoints to manage tasks and maintain their order.

## Features

- **Task CRUD Operations:**  
  - Create new tasks with a title (max 50 characters) and an optional description (max 200 characters).
  - Edit tasks (update title and description) via a polished SweetAlert2 modal.
  - Delete tasks and automatically reorder remaining tasks.
  
- **Drag-and-Drop Interface:**  
  - Smoothly reorder tasks within the same category.
  - Drag tasks between categories with an immediate update.
  - Drag overlay displays a semi-transparent preview of the task being dragged.

- **Real-time Updates:**  
  - Optimistic UI updates and automatic query invalidation using TanStack Query ensure that the interface always reflects the latest data from the backend.

## Technologies Used

- **Frontend:**
  - React (with Vite.js)
  - [dnd-kit](https://github.com/clauderic/dnd-kit)
  - [TanStack Query](https://tanstack.com/query/latest) (React Query)
  - Axios
  - SweetAlert2
  - Tailwind CSS

- **Backend:**
  - Express.js
  - MongoDB (Native Driver)
  - CORS, dotenv

## Installation & Setup

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB Atlas account or a local MongoDB instance

### Backend Setup

1. **Clone the repository and navigate to the backend folder:**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the backend directory with the following content:

   ```env
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   PORT=5000
   ```

4. **Start the backend server:**

   ```bash
   npm run dev
   ```

   The backend should now be running on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. **Navigate to the frontend folder:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The frontend should now be running on [http://localhost:5173](http://localhost:5173) (or a similar URL).

## Usage

- **Add a Task:**  
  Use the form on the homepage to add a new task. Provide a title, optional description, and select a category.

- **Drag and Drop:**  
  - **Reorder Tasks:** Drag tasks within a category to change their order.  
  - **Move Between Categories:** Drag a task to a different category container to change its category.

- **Edit a Task:**  
  Click the "Edit" button on a task to open a SweetAlert2 modal. Modify the title and/or description and save the changes.

- **Delete a Task:**  
  (If implemented) Click the "Delete" button to remove a task. The remaining tasks will be reordered automatically.

## Live Demo

If you have a live demo deployed, add the link here:  
[Live Demo](https://taskmaster-b20c0.web.app)



---

