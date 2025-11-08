import React, { useContext } from 'react'
import {assets} from'../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { useState } from "react";
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible, setVisible] =useState(false);
    const {setShowSearch , getCartCount, navigate, token , setToken, setCartItems, user}= useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token');
        setToken('');
        setCartItems({})
        
    }

    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
    }

  return (
    <div className='flex items-center justify-between py-5 font-medium'>

    <Link to='/'>
        <img src={assets.Inspace_logo} className='w-36' alt="" />
    </Link>

        <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

            <NavLink to ='/'className='flex flex-col items-center gap-1'>
                <p>HOME</p>
                <hr className='w-2 border-none h-[1.5px] bg-gray-700 hidden' />

            </NavLink>

            <NavLink to ='/Collection'className='flex flex-col items-center gap-1'>
                <p>COLLECTION</p>
                <hr className='w-2 border-none h-[1.5px] bg-gray-700 hidden' />

            </NavLink>

            <NavLink to ='/About'className='flex flex-col items-center gap-1'>
                <p>ABOUT</p>
                <hr className='w-2 border-none h-[1.5px] bg-gray-700 hidden' />

            </NavLink>

            <NavLink to ='/Contact'className='flex flex-col items-center gap-1'>
                <p>CONTACT</p>
                <hr className='w-2 border-none h-[1.5px] bg-gray-700 hidden' />

            </NavLink>

        </ul>
        <div className='flex items-center gap-6'>
            <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
            <div className='group relative'>
                {token ? (
                    <div className='flex items-center gap-2 cursor-pointer'>
                        <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                            {user ? getUserInitials(user.name) : '...'}
                        </div>
                        <div className='hidden sm:block'>
                            <p className='text-sm font-medium text-gray-700'>{user?.name || 'Loading...'}</p>
                            <p className='text-xs text-gray-500'>{user?.email || ''}</p>
                        </div>
                    </div>
                ) : (
                    <img onClick={()=> navigate('/Login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                )}
                
                {/*dropdown menu */}
                {token && 
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-48 py-3 px-5 bg-white border border-gray-200 shadow-lg rounded-lg'>
                        <div className='pb-2 border-b border-gray-100'>
                            <p className='text-sm font-medium text-gray-900'>{user?.name || 'User'}</p>
                            <p className='text-xs text-gray-500'>{user?.email}</p>
                        </div>
                        <p className='cursor-pointer hover:text-blue-600 hover:bg-blue-50 py-1 px-2 rounded text-sm'>My Profile</p>
                        <p onClick={()=> navigate('/Orders')} className='cursor-pointer hover:text-blue-600 hover:bg-blue-50 py-1 px-2 rounded text-sm'>My Orders</p>
                        <p onClick={logout} className='cursor-pointer hover:text-red-600 hover:bg-red-50 py-1 px-2 rounded text-sm'>Logout</p>
                    </div>
                </div>
}
            </div>
            <Link to='/Cart' className='relative'>
            <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>

            </Link>
            <img onClick={()=> setVisible(true)}src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />

        </div>

        {/* Sidebar menu for small screen */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' :'w-0'}`}>
            <div className='flex flex-col text-gray-600'>
                <div onClick={()=> setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                    <img className='h-4 ' src={assets.dropdown_icon} alt="" />
                    <p>Back</p>
                </div>
                
                {/* User info in mobile menu */}
                {token && user && (
                    <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                                {getUserInitials(user.name)}
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-900'>{user.name}</p>
                                <p className='text-xs text-gray-500'>{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/Collection'>COLLECTION</NavLink>
                <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/About'>About</NavLink>
                <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/Contact'>Contact</NavLink>
                
                {token && (
                    <>
                        <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/Orders'>My Orders</NavLink>
                        <button onClick={()=> {setVisible(false); logout();}} className='py-2 pl-6 border text-left text-red-600'>Logout</button>
                    </>
                )}
            </div>
        </div>
        
    </div>
  )
}

export default Navbar