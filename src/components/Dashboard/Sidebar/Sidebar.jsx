/** @format */

import { useState } from "react";
import { GrLogout } from "react-icons/gr";
import { FcSettings } from "react-icons/fc";
import { BsFillHouseAddFill, BsFingerprint } from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";
import { AiOutlineBars } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { MdHomeWork } from "react-icons/md";
import useRole from "../../../hooks/useRole";
import MenuItem from "./Menu/MenuItem";
import HostMenu from "./Menu/HostMenu";
import GuestMenu from "./Menu/GuestMenu";
import AdminMenu from "./Menu/AdminMenu";
import ToggleBtn from "../../Shared/Button/ToggleBtn";

const Sidebar = () => {
   const { logOut } = useAuth();
   const [isActive, setActive] = useState(false);
   const [toggle, setToggle] = useState(true);
   const [role, isLoading] = useRole();

   // Sidebar Responsive Handler
   const handleToggle = () => {
      setActive(!isActive);
   };

   const toggleHandler = (event) => {
      setToggle(event.target.checked);
      console.log(toggle);
   };
   return (
      <>
         {/* Small Screen Navbar */}
         <div className="bg-gray-100 text-gray-800 flex justify-between md:hidden">
            <div>
               <div className="block cursor-pointer p-4 font-bold">
                  <Link to="/">
                     <img
                        // className='hidden md:block'
                        src="https://i.ibb.co/4ZXzmq5/logo.png"
                        alt="logo"
                        width="100"
                        height="100"
                     />
                  </Link>
               </div>
            </div>

            <button
               onClick={handleToggle}
               className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
            >
               <AiOutlineBars className="h-5 w-5" />
            </button>
         </div>

         {/* Sidebar */}
         <div
            className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-gray-100 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${
               isActive && "-translate-x-full"
            }  md:translate-x-0  transition duration-200 ease-in-out`}
         >
            <div>
               <div>
                  <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-rose-100 mx-auto">
                     <Link to="/">
                        <img
                           // className='hidden md:block'
                           src="https://i.ibb.co/4ZXzmq5/logo.png"
                           alt="logo"
                           width="100"
                           height="100"
                        />
                     </Link>
                  </div>
               </div>

               {/* Nav Items */}
               <div className="flex flex-col justify-between flex-1 mt-6">
                  {/* Conditional toggle button here.. */}
                  {role === "host" && (
                     <ToggleBtn
                        toggleHandler={toggleHandler}
                        toggle={toggle}
                     ></ToggleBtn>
                  )}
                  {/*  Menu Items */}
                  <nav>
                     {/* Statistics */}
                     <MenuItem
                        label="Statistics"
                        address="/dashboard"
                        icon={BsGraphUp}
                     ></MenuItem>

                     {/* Guest Menu */}
                     {role === "guest" && <GuestMenu></GuestMenu>}
                     {/* Host Menu */}
                     {role === "host" ? (
                        toggle ? (
                           <HostMenu></HostMenu>
                        ) : (
                           <GuestMenu></GuestMenu>
                        )
                     ) : undefined}
                     {/* Admin Menu */}
                     {role === "admin" && <AdminMenu></AdminMenu>}
                  </nav>
               </div>
            </div>

            <div>
               <hr />

               {/* Profile Menu */}
               <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) =>
                     `flex items-center px-4 py-2 my-5  transition-colors duration-300 transform  hover:bg-gray-300   hover:text-gray-700 ${
                        isActive
                           ? "bg-gray-300  text-gray-700"
                           : "text-gray-600"
                     }`
                  }
               >
                  <FcSettings className="w-5 h-5" />

                  <span className="mx-4 font-medium">Profile</span>
               </NavLink>
               <button
                  onClick={logOut}
                  className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300   hover:text-gray-700 transition-colors duration-300 transform"
               >
                  <GrLogout className="w-5 h-5" />

                  <span  className="mx-4 font-medium">Logout</span>
               </button>
            </div>
         </div>
      </>
   );
};

export default Sidebar;
