import React from 'react';
import AddTask from './AddTask';
import TaskManagement from './TaskManagement';
import Footer from './Footer';

const Home = () => {
  return (
    <div>
      {/* Banner Section */}
       {/* Banner Section */}
       <div className="bg-white text-center border border-gray-300 shadow-md rounded-xl p-6 max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">TaskMaster</h1>
        <p className="text-gray-600 text-lg">
          Effortlessly manage your tasks. Drag, drop, and organize with ease!
        </p>
      </div>

      <AddTask />
      <TaskManagement />
      <Footer></Footer>
    </div>
  );
};

export default Home;
