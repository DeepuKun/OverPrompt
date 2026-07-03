import React from 'react'

const NavBar = () => {
  return (
    <div className='fixed z-100 mt-6'>
    <div className='w-100 md:w-[98vw] backdrop-blur-lg bg-white/10 border border-white/30 rounded-full shadow-xl p-1 m-3'>
        <div className='flex gap-2'>
            <img src='OverPromptLogo.png' className='h-15 rounded-full'></img>
            <img src='OverPrompt.png' className='h-15'></img>
        </div>
    </div>
  </div>
  )
}

export default NavBar