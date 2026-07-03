import React from 'react'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Steps from './components/Steps'
import Testamonial from './components/Testamonial'
import AiLogoMarquee from './components/AiLogoMarquee'

const App = () => {
  return (
    <div className='h-full w-full  bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:40px_40px]'>
      <NavBar></NavBar>
      <Hero/>
      <AiLogoMarquee/>
      <Problem/>
      <Steps/>
      <Testamonial/>
      
    </div>
  )
}

export default App