import React, { useState } from "react";

const TiltCard = ({ children }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const threshold = 65;

  const handleMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    setTilt({
      x: y * -threshold,
      y: x * threshold,
    });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className=" mb-10 rounded-xl shadow-2xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-80 md:h-80 p-4 bg-white"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {children}
    </div>
  );
};

export default TiltCard;