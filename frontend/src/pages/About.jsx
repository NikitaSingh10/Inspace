import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl  text-center pt-8 border-t' >
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-100 md:max-w-[450px'  src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600' >
        <p>Inspace is a modern e-commerce platform that blends web technology with Augmented Reality (AR) to transform the way people shop for decorative products.</p>
        <p>Traditional online shopping makes it hard to imagine how an item will look in your home. Inspace solves this by letting you preview products in your own space using your smartphone camera before making a purchase.</p>
        <p>Our platform showcases a curated collection of furniture, lighting, wall art, and accessories — all available to view in real-time 3D models. With just one click, you can place a virtual lamp on your table or try a painting on your wall.</p>
        <b className='text-gray-800' >Our Mission</b>
        <p>Our mission is to bridge the gap between imagination and reality in online shopping by letting people experience products in their own space through Augmented Reality.</p>


        </div>
      </div>
      <div className='text-xl py-4' >
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5' >
          <b>Quality Assurance:</b>
          <p className='text-gray-600' >We ensure every product and AR experience is tested for accuracy, usability, and reliability to deliver a seamless shopping journey.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5' >
          <b>Connvenience:</b>
          <p className='text-gray-600'>Inspace brings convenience by letting customers explore, compare, and visualize products anytime, anywhere, without visiting a store.</p>
        </div>
        
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About