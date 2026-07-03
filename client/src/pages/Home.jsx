import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import AiLogoMarquee from '../components/AiLogoMarquee'
import Problem from '../components/Problem'
import Steps from '../components/Steps'
import Testamonial from '../components/Testamonial'
import CTA from '../components/CTA'

const Home = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#how-it-works') {
      const element = document.getElementById('steps-section')
      if (element) {
        // Delay slightly to ensure elements are fully rendered if navigating from another page
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  return (
    <div className="pt-10">
      <Hero />
      <AiLogoMarquee />
      <Problem />
      <div id="steps-section">
        <Steps />
      </div>
      <Testamonial />
      <CTA />
    </div>
  )
}

export default Home
