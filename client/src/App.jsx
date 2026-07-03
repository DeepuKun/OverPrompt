import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Audit from './pages/Audit'

const App = () => {
  return (
    <Router>
      <div className='min-h-screen w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] flex flex-col justify-between'>
        <NavBar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/audit" element={<Audit />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App