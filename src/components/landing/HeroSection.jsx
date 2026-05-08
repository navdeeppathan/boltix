// import React, { useState } from "react";

// import { useNavigate } from "react-router-dom";

// const HeroSection = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   return (
//     <section className="relative w-full h-screen mt-24">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center z-0"
//         style={{
//           backgroundImage: `url("/bgimg.png")`,
//         }}
//       ></div>

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/20 z-10"></div>

//       {/* Content */}
//       <div className="relative z-20 flex flex-col justify-center items-start py-4 px-4 sm:px-8 md:px-16 lg:px-32 text-white">
//         {/* Sidebar Overlay (when open) */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black/40 z-40"
//             onClick={() => setSidebarOpen(false)}
//           ></div>
//         )}
//         {/* Hero Text */}
//         <div className="mt-12 sm:mt-16 md:mt-20 max-w-full sm:max-w-xl md:max-w-3xl">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-snug sm:leading-snug md:leading-tight lg:leading-tight">
//             The first <span className="font-bold">AI-driven</span>
//             <br />
//             <span className="font-bold"> collaboration</span> hub for industrial{" "}
//             <br /> plants and Manufacturer ecosystems.
//           </h1>
//         </div>

//         <div className="hidden md:flex flex-col items-center absolute right-4 sm:right-8 lg:right-120 bottom-4 sm:bottom-8 lg:bottom-32">
//           <img
//             src="/bgimg3.png"
//             alt="Pointer"
//             className="w-10 sm:w-12 lg:w-[45px] h-auto animate-glow"
//           />
//         </div>
//         <style>
//           {`
//           @keyframes glow {
//               0%, 100% {
//                 filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))
//                         drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
//                 opacity: 0.9;
//               }
//               50% {
//                 filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))
//                         drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
//                 opacity: 1;
//               }
//             }

//             .animate-glow {
//               animation: glow 1.8s ease-in-out infinite;
//             }
//           `}
//         </style>
//         {/* Description & Button */}
//         <div className="mt-6 sm:mt-10 md:mt-40 max-w-full sm:max-w-sm md:max-w-xs">
//           <p className="text-sm sm:text-base md:text-[14px] text-white">
//             Our AI-driven supply chain collaboration platform transforms the way
//             industrial plants connect with Manufacturers, suppliers, and service
//             providers during equipment and service breakdowns.
//           </p>

//           <button className="mt-4 sm:mt-6 bg-[#0088FF] w-[100px] sm:w-[107px] h-[32px] sm:h-[34px] hover:bg-blue-600 transition text-white rounded">
//             Read More
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen overflow-hidden pt-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 animate-bgZoom"
        style={{
          backgroundImage: `url("/bgimg.png")`,
        }}
      />
      <style>
        {`
              @keyframes glow {
                0%, 100% {
                  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))
                          drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
                  opacity: 0.9;
                }

                50% {
                  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))
                          drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
                  opacity: 1;
                }
              }

              .animate-glow {
                animation: glow 1.8s ease-in-out infinite;
              }

              /* Background cinematic movement */
              @keyframes bgZoom {
                0% {
                  transform: scale(1) translate(0px, 0px);
                }

                25% {
                  transform: scale(1.05) translate(-10px, -6px);
                }

                50% {
                  transform: scale(1.08) translate(0px, -10px);
                }

                75% {
                  transform: scale(1.05) translate(10px, -6px);
                }

                100% {
                  transform: scale(1) translate(0px, 0px);
                }
              }

              .animate-bgZoom {
                animation: bgZoom 18s ease-in-out infinite;
                will-change: transform;
              }
            `}
      </style>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Layout */}
        <div className="flex flex-col justify-center min-h-[calc(100vh-96px)] relative py-10">
          {/* Heading */}
          <div className="max-w-[750px]">
            <h1 className="text-[28px] leading-[28px] sm:text-[36px] sm:leading-[40px] lg:text-[42px] lg:leading-[56px] font-medium text-white">
              The first <span className="font-bold">AI-driven</span>
              <br />
              <span className="font-bold">collaboration</span> hub for
              industrial
              <br />
              plants and manufacturing ecosystems.
            </h1>
          </div>

          {/* Bottom Content */}
          <div className="mt-10 lg:mt-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            {/* Description */}
            <div className="max-w-[420px]">
              <p className="text-sm sm:text-base lg:text-[15px] leading-7 text-white/90">
                Our AI-driven supply chain collaboration platform transforms the
                way industrial plants connect with manufacturers, suppliers, and
                service providers during equipment and service breakdowns.
              </p>

              <button className="mt-6 bg-[#0088FF] w-[120px] h-[42px] hover:bg-blue-600 transition text-white rounded-lg text-sm font-medium">
                Read More
              </button>
            </div>

            {/* Animated Pointer */}
            {/* Animated Pointer */}
            <div className="hidden xl:flex absolute right-24 2xl:right-36 top-[55%] -translate-y-1/2">
              <img
                src="/bgimg3.png"
                alt="Pointer"
                className="w-[50px] h-auto animate-glow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes glow {
            0%, 100% {
              filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))
                      drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
              opacity: 0.9;
            }

            50% {
              filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))
                      drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
              opacity: 1;
            }
          }

          .animate-glow {
            animation: glow 1.8s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
