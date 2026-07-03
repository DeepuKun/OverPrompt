import React from 'react'
import { TypeAnimation } from "react-type-animation";
import AiLogoMarquee from './AiLogoMarquee';
const Hero = () => {
  return (
    <div className='flex md:h-126 w-full pt-16'>
<div>

        <div className='w-screen md:w-160 ml-8 pt-15'>
            <TypeAnimation
    sequence={[
      "Are your A.I. tools costing you more than they should?",
    ]}
    wrapper="p"
    speed={65}
    cursor={true}
    repeat={0}
    
    className="playwrite-nz w-95 md:w-160 text-4xl md:text-6xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent"
  />
        </div>

        <TypeAnimation
  sequence={[
    2800,
    "Stop paying for unused seats, redundant subscriptions, and overpriced plans. Get a complete AI spend audit in under 2 minutes.",
  ]}
  wrapper="p"
  speed={85}
  repeat={0}
  cursor={true}
  className="noto-sans md:text-xl font-bold text-gray-400 leading-relaxed mt-6 w-100 md:w-160 ml-8"
/>


{/* Buttons will be here */}


<div className="md:flex items-center gap-4 mt-10 ml-8">
  <input
    type="email"
    placeholder="Enter your email..."
    className="w-80 px-5 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all duration-300 noto-sans bg-white"
  />

  <button className="px-7 py-3 mt-6 w-80 md:w-50 md:mt-0 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-blue-300/40 hover:scale-105 transition-all duration-300 cursor-pointer">
    Start Free Audit →
  </button>
</div>
</div>

<div className='hidden md:block mr-10'>
    <img src='hero.png' className='mt-15 rounded-xl h-95 w-200'></img>
</div>
    </div>
  )
}

export default Hero