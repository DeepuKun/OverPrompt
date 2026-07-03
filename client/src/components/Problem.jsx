import React from 'react'
import TiltCard from './TileCard'
const Problem = () => {

  return (
    <div className='mb-30' >
        <div className='bitcount-grid-double text-4xl md:text-7xl text-blue-700 m-8'>
            The Problem
        </div>

        <div>
            <h1 className=' text-2xl md:text-3xl noto-sans font-bold ml-8'>Most Teams Have <span className='text-blue-700 damion-regular font-bold' >hidden</span> A.I. Waste</h1>
            <p className='ml-8 noto-sans font-bold text-gray-400'>Lots of companies pay for AI tools more than they need to, without realizing it.</p>
        </div>


        {/* CARDS */}
        <div className="grid grid-cols-2 gap-4 mt-10 md:mx-10 mb-10 md:flex">
  <TiltCard>
    <img src='icons8-cheque.gif'></img>
    <br></br>
    <h3 className='font-bold md:text-xl noto-sans'>Paying For seats you don't use</h3>
    <p className='noto-sans text-gray-500'>Paying for AI tool seats that go unused month after month quietly drains your budget, leaving your team with unnecessary costs and little to no added value.</p>
  </TiltCard>

  <TiltCard>
   <img src='icons8-discount.gif'></img>
   <br></br>
    <h3 className='font-bold md:text-xl noto-sans'>Overpaying for higher plans</h3>
    <p className='noto-sans text-gray-500'>Many teams subscribe to premium AI plans with features they rarely use, paying significantly more each month than their actual workflow requires.</p>
  </TiltCard>

  <TiltCard>
    <img src='icons8-double-up.gif'></img>
    <br></br>
    <h3 className='font-bold md:text-xl noto-sans'>Missing Better Alternatives</h3>
    <p className='noto-sans text-gray-500'>Many teams stick with familiar AI tools without realizing there are more affordable or better-performing alternatives that could save money and improve productivity.</p>
  </TiltCard>
   <TiltCard>
    <img src='icons8-wallet.gif'></img>
    <br></br>
    <h3 className='font-bold md:text-xl noto-sans'>No Visibility Into AI Spending</h3>
    <p className='noto-sans text-gray-500'>Without a clear overview of AI subscriptions, it's difficult to identify waste, optimize costs, or make informed purchasing decisions.</p>
  </TiltCard>
</div>

    </div>
  )
}

export default Problem