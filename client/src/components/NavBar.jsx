import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleHowItWorks = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('steps-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to homepage with hash
      navigate('/#how-it-works')
    }
  }

  return (
    <div className='fixed z-50 mt-4 left-1/2 -translate-x-1/2 w-[92vw] md:w-[96vw]'>
      <div className='backdrop-blur-lg bg-white/70 border border-white/40 rounded-full shadow-lg p-2 md:p-3'>
        <div className='flex items-center justify-between w-full px-2 md:px-4'>
          {/* Logo Section */}
          <Link to="/" className='flex items-center gap-1.5 hover:opacity-90 transition duration-200'>
            <img src='OverPromptLogo.png' className='h-10 md:h-12 rounded-full object-contain' alt="OverPrompt Logo" />
            <img src='OverPrompt.png' className='h-10 md:h-12 object-contain' alt="OverPrompt" />
          </Link>

          {/* Links Section */}
          <div className='flex items-center gap-4 md:gap-8 noto-sans font-bold text-gray-700 text-xs md:text-sm'>
            <Link to="/about" className='hover:text-blue-700 transition duration-200'>
              About
            </Link>
            <button 
              onClick={handleHowItWorks} 
              className='hover:text-blue-700 transition duration-200 cursor-pointer outline-none'
            >
              How it Works
            </button>
            <Link 
              to="/audit" 
              className='px-3 py-1.5 md:px-5 md:py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:scale-105 shadow-md hover:shadow-blue-300/40 transition-all duration-200'
            >
              Start Audit
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar