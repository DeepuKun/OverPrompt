import React from "react";

const AiLogoMarquee = () => {
  const aiLogos = [
    {
      name: "ChatGPT",
      src: "https://img.icons8.com/color/96/chatgpt.png",
    },
    {
      name: "Grok",
      src: "https://img.icons8.com/color/96/grok--v2.png",
    },
    {
      name: "Gemini",
      src: "https://img.icons8.com/color/96/gemini-ai.png",
    },
    {
      name: "Cursor",
      src: "https://img.icons8.com/color/96/cursor-ai.png",
    },
    {
      name: "DeepSeek",
      src: "https://img.icons8.com/color/96/deepseek.png",
    },
    {
      name: "Apple Intelligence",
      src: "https://img.icons8.com/color/96/camera-intelligence.png",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-inner {
          animation: marqueeScroll 18s linear infinite;
        }

        .marquee-inner:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="py-2 mb-40">
        <h2 className="text-center text-lg md:text-xl font-semibold text-gray-700 mb-8">
          Analyze subscriptions from{" "}
          <span className="text-blue-700">popular AI tools</span>
        </h2>

        <div className="overflow-hidden relative w-full max-w-6xl mx-auto select-none">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 h-full w-16 md:w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />

          {/* Marquee */}
          <div className="marquee-inner flex min-w-[200%]">
            <div className="flex items-center">
              {[...aiLogos, ...aiLogos, ...aiLogos].map((logo, index) => (
                <div
                  key={index}
                  className="mx-6 md:mx-10 flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-80 hover:opacity-100"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    draggable={false}
                    className="h-12 md:h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Fade */}
          <div className="absolute right-0 top-0 h-full w-16 md:w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </>
  );
};

export default AiLogoMarquee;