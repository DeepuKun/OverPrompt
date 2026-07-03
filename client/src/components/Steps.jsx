import React from 'react'

const Steps = () => {
  return (
    <div className='mb-40'>
         <div>
        <div className='bitcount-grid-double text-4xl md:text-7xl text-blue-700 m-8'>
            Three Simple Steps
        </div>

        <div>
            <h1 className=' text-2xl md:text-3xl noto-sans font-bold ml-8'>To Start<span className='text-blue-700 damion-regular font-bold' > saving</span> on your AI subscriptions today</h1>
            <p className='ml-8 noto-sans font-bold text-gray-400'>We'll help you uncover waste and find smarter AI solutions for your business.</p>
        </div>
        </div>
        <div className='flex gap-4 mb-6 mt-10'>
            <div className="group w-52 h-64 mx-auto [perspective:1000px] cursor-pointer">
            <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Side */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-md bg-white border border-gray-300 shadow-xl shadow-olive-300">
                    <p className='font-bold text-xl'>Step - 1</p>
                </div>
        
                {/* Back Side */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-700 text-white [transform:rotateY(180deg)]">
                <div className='flex flex-col gap-2 items-center p-2'>
                    <img className='rounded-full h-15 w-15' src='icons8-add.gif'></img>
                    <br></br>
                    <h1 className='noto-sans font-bold text-xl'>Add Your AI Tools</h1>
                    <p className='noto-sans'>Tell us what tools, plans and seats you are using.</p>
                </div>
                </div>
            </div>
        </div>
        
        <img className="h-10 mt-25" src='icons8-double-right.gif'></img>

        <div className="group w-52 h-64 mx-auto [perspective:1000px] cursor-pointer">
            <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Side */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-md bg-white border border-gray-300 shadow-xl shadow-olive-300">
                    <p className='font-bold text-xl'>Step - 2</p>
                </div>
        
                {/* Back Side */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-700 text-white [transform:rotateY(180deg)]">
                    <div className='flex flex-col gap-2 items-center p-2'>
                    <img className='rounded-full h-15 w-15' src='icons8-robotic-arm.gif'></img>
                    <br></br>
                    <h1 className='noto-sans font-bold text-xl'>We Analyse Your Tools</h1>
                    <p className='noto-sans'>Our engine audits your stack and finds waste in seconds.</p>
                </div>
                </div>
            </div>
        </div>


         <img className="h-10 mt-25" src='icons8-double-right.gif'></img>


        <div className="group w-52 h-64 mx-auto [perspective:1000px] cursor-pointer">
            <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Side */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-md bg-white border border-gray-300 shadow-xl shadow-olive-300">
                    <p className='font-bold text-xl'>Step - 3</p>
                </div>
        
                {/* Back Side */}
                <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-700 text-white [transform:rotateY(180deg)]">
                    <div className='flex flex-col gap-2 items-center p-2'>
                    <img className='rounded-full h-15 w-15' src='icons8-combo-chart.gif'></img>
                    <br></br>
                    <h1 className='noto-sans font-bold text-xl'>Get Savings Instantly</h1>
                    <p className='noto-sans '>See recommendations, savings and better alternatives.</p>
                </div>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Steps