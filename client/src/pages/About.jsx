import React from "react";

const About = () => {
  const stats = [
    { value: "$4.8M+", label: "AI Spend Analyzed" },
    { value: "34%", label: "Average Bill Savings" },
    { value: "1,500+", label: "Audit Reports Generated" },
  ];

  const values = [
    {
      title: "Complete Transparency",
      description: "No hidden agendas or kickbacks from AI vendors. We analyze your tools objectively to recommend exactly what you need, nothing more.",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: "Cost Optimization",
      description: "AI licensing model is moving fast. We help you stay ahead of subscription waste, duplicate seats, and overpriced plans with real-time comparisons.",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Tailored Recommendations",
      description: "Not every user needs GPT-4o Plus. We detect lightweight alternatives, free tiers, and unified workspace bundles to scale down your budget smoothly.",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mt-10 mb-16">
        <h1 className="bitcount-grid-double text-4xl md:text-7xl text-blue-700 mb-6">
          Who We Are
        </h1>
        <p className="noto-sans text-2xl md:text-3xl font-bold text-gray-800 max-w-4xl mx-auto leading-tight">
          Helping modern teams manage AI spend <span className="text-blue-700 damion-regular font-bold">efficiently</span>.
        </p>
        <p className="noto-sans text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-4 font-semibold">
          OverPrompt is built to combat the silent budget killer in modern SaaS setups: redundant, forgotten, and over-tiered AI subscriptions.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-8 bg-white border border-blue-50/60 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-102 transition-all duration-300"
          >
            <span className="bitcount-grid-double text-blue-700 text-5xl md:text-6xl mb-2">
              {stat.value}
            </span>
            <span className="noto-sans text-gray-500 font-bold text-sm tracking-wide uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center my-20">
        <div>
          <h2 className="noto-sans text-3xl font-extrabold text-gray-800 mb-6 leading-snug">
            The Story Behind <span className="text-blue-700">OverPrompt</span>
          </h2>
          <p className="noto-sans text-gray-600 mb-4 leading-relaxed text-base">
            As tech teams rushed to adopt AI tools like ChatGPT Plus, Copilot, Midjourney, and Claude, a new kind of software waste emerged: **AI Shadow Spend**.
          </p>
          <p className="noto-sans text-gray-600 mb-4 leading-relaxed text-base">
            Organizations started realizing they were paying for Pro seats for employees who only logged in once, or holding overlapping subscriptions for three different chat models when one would suffice.
          </p>
          <p className="noto-sans text-gray-600 leading-relaxed text-base">
            OverPrompt was founded to shed light on this issue. We provide instantly actionable insight into where your money goes, helping you retain the power of AI without the bloated bills.
          </p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
            <h3 className="noto-sans text-xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="noto-sans text-gray-500 leading-relaxed mb-4">
              We envision a future where AI operations are lean, highly integrated, and optimized. We want every team to pay for the exact compute and model tier they actually use.
            </p>
            <p className="noto-sans text-gray-500 leading-relaxed">
              No spreadsheets, no tedious manual accounting. Just click, audit, and start saving.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="my-20">
        <h2 className="text-center noto-sans text-3xl font-extrabold text-gray-800 mb-12">
          Our Core Pillars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <div
              key={i}
              className="p-6 bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
            >
              <div className="p-3 bg-blue-50/50 rounded-xl w-14 h-14 flex items-center justify-center">
                {value.icon}
              </div>
              <h3 className="noto-sans text-xl font-bold text-gray-800">
                {value.title}
              </h3>
              <p className="noto-sans text-gray-500 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
