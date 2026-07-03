import React from "react";

const CTA = () => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');

          *{
            font-family: "Geist", sans-serif;
          }
        `}
      </style>
      <div className='bitcount-grid-double text-4xl md:text-7xl text-blue-700 ml-8'>
            Try for free...
        </div>

      <div className="w-full bg-slate-50 py-6 px-4 flex items-center justify-center">
        <div className="w-full max-w-[1100px] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center py-14 px-6 bg-[url('https://i.pinimg.com/originals/88/15/63/881563d6444b370fa4ceea0c3183bb4c.gif')] bg-cover bg-center">

          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 mb-6 bg-white/10 backdrop-blur-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M2.917 12.25v-3.5M7 12.25v-7m4.083 7V1.75"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-white text-xs font-medium">
              Save more. Spend smarter.
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-semibold leading-tight text-white max-w-4xl">
            Stop Overpaying
            <span className="text-blue-200"> for AI Tools.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-blue-100 mt-5 mb-10 max-w-2xl">
            Analyze your AI subscriptions, uncover hidden waste, and receive
            personalized recommendations to reduce costs without sacrificing
            productivity.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">

            <button className="px-7 py-3 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all cursor-pointer shadow-lg">
              Start Free AI Audit
            </button>

            <button className="px-7 py-3 rounded-full border border-white/40 text-white font-medium hover:bg-white/10 transition-all cursor-pointer">
              Learn More
            </button>

          </div>

          {/* Bottom text */}
          <p className="mt-8 text-sm text-blue-100">
            No login required • Free analysis • Results in under 2 minutes
          </p>

        </div>
      </div>
    </>
  );
};

export default CTA;