import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider/AuthProvider';

const Navbar = () => {
    const navigate = useNavigate();
    const {user,  logOut } = useContext(AuthContext);

    const handleLogout = () => {
        logOut().then(() => {
          toast.success("Successfully logged out!");
            navigate("/login");
        });
      };
      if (!user) {
        return null;
      }
    return (
        <div className="navbar  bg-gray-500 ">
  <div className="navbar-start">
    
    <a className="btn btn-ghost text-xl text-white font-bold">TaskMaster</a>
  </div>
  
  <div className="navbar-end">
    <button className='text-white' onClick={handleLogout} >Logout</button>
  </div>
</div>
    );
};

export default Navbar;