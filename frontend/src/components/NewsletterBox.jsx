import React, { useState } from 'react';
import axios from 'axios';

const NewsletterBox = () => {

    const [email, setEmail] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/subscribe`, { email });
            alert(res.data.message);
            setEmail(""); // clear input
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>
            Subscribe now & get 20% off
        </p>

        <p className='text-gray-400 mt-3'>
            Unlock exclusive deals and smart home styling inspiration.
        </p>

        <form 
            onSubmit={onSubmitHandler} 
            className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'
        >
            <input 
                className='w-full sm:flex-1 outline-none' 
                type="email" 
                placeholder='Enter your email' 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button 
                type='submit' 
                className='bg-black text-white text-xs px-10 py-4'
            >
                SUBSCRIBE
            </button>
        </form>
    </div>
  )
}

export default NewsletterBox;