// SolutionsSection.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Example icons (you can replace with your own images or icons)
import { FaExchangeAlt, FaFileAlt, FaUsersCog, FaLock } from "react-icons/fa";

const SolutionsSection = () => {
  const solutions = [
    {
      title: "Real-Time Connectivity",
      description:
        "Instant communication between plants, Manufacturers, suppliers, and service providers. Engineers and technicians can directly access the platform via mobile or desktop.",
      icon: <FaExchangeAlt className="text-3xl mb-4" />,
    },
    {
      title: "Secure Document Sharing",
      description:
        "Advanced encryption ensures the safe storage and transfer of design files, service documents, and compliance paperwork, protecting sensitive information.",
      icon: <FaFileAlt className="text-3xl mb-4" />,
    },
    {
      title: "AI-Driven Partner Matching",
      description:
        "Smart algorithms automatically recommend the most suitable suppliers and manufacturers, eliminating delays in identifying the right contact.",
      icon: <FaUsersCog className="text-3xl mb-4" />,
    },
    {
      title: "Integrated Collaboration",
      description:
        "Secure video meetings, task tracking, and knowledge sharing enable faster and more effective resolution of service breakdowns.",
      icon: <FaLock className="text-3xl mb-4" />,
    },
  ];

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-20">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
          How We Solve Your Connection Challenges
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Solution – AI-Powered Collaboration & Secure Data Sharing for Plant &
          Service Breakdowns
        </p>
      </div>

      {/* Cards Slider */}
      <Swiper
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 }, // Mobile
          640: { slidesPerView: 2 }, // Small tablets
          1024: { slidesPerView: 3 }, // Desktop
          1280: { slidesPerView: 4 }, // Large desktop
        }}
      >
        {solutions.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-[#1F2937] text-white rounded-xl shadow-md p-6 h-full flex flex-col justify-between">
              <div>
                {item.icon}
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
              <button className="mt-4 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition">
                →
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SolutionsSection;
