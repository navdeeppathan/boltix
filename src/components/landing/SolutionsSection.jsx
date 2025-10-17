// SolutionsSection.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa6";

const SolutionsSection = () => {
  const [activeButton, setActiveButton] = useState("next");

  const solutions = [
    {
      title: (
        <>
          Real-Time <br /> Connectivity
        </>
      ),
      description:
        "Instant communication between plants, OEMs, suppliers, and service providers. Engineers and technicians can directly access the platform via mobile or desktop.",
      icon: "/frame1.png",
    },
    {
      title: "Secure Document Sharing",
      description:
        "Advanced encryption ensures the safe storage and transfer of design files, service documents, and compliance paperwork, protecting sensitive information.",
      icon: "/frame2.png",
    },
    {
      title: "AI-Driven Partner Matching",
      description:
        "Smart algorithms automatically recommend the most suitable suppliers and manufacturers, eliminating delays in identifying the right contact.",
      icon: "/frame3.png",
    },
    {
      title: "Integrated Collaboration",
      description:
        "Secure video meetings, task tracking, and knowledge sharing enable faster and more effective resolution of service breakdowns.",
      icon: "/frame4.png",
    },
    {
      title: "AI-Driven Partner Matching",
      description:
        "Smart algorithms automatically recommend the most suitable suppliers and manufacturers, eliminating delays in identifying the right contact.",
      icon: "/frame1.png",
    },
    {
      title: "Integrated Collaboration",
      description:
        "Secure video meetings, task tracking, and knowledge sharing enable faster and more effective resolution of service breakdowns.",
      icon: "/frame4.png",
    },
  ];

  useEffect(() => {
    const prevBtn = document.querySelector(".custom-prev");
    const nextBtn = document.querySelector(".custom-next");

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => setActiveButton("prev"));
      nextBtn.addEventListener("click", () => setActiveButton("next"));
    }

    return () => {
      if (prevBtn && nextBtn) {
        prevBtn.removeEventListener("click", () => setActiveButton("prev"));
        nextBtn.removeEventListener("click", () => setActiveButton("next"));
      }
    };
  }, []);

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-32">
      {/* Heading */}
      <div className="text-center mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]">
          How We Solve Your Connection Challenges
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-[24px] font-medium text-[#212529]">
          Solution – AI-Powered Collaboration & Secure Data Sharing for
        </p>
        <p className="mt-1 text-sm sm:text-base md:text-[24px] font-medium text-[#212529]">
          Plant & Service Breakdowns
        </p>
      </div>

      {/* Cards Slider */}
      <div className="relative">
        <Swiper
          spaceBetween={20}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
          }}
        >
          {solutions.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-[#212529] text-[#FFFFFF] rounded-[14px] shadow-md p-8 min-h-[314px] flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.icon} alt="" className="w-[55px] h-[51px]" />
                  <h3 className="text-lg md:text-[24px] font-bold mb-2 leading-[36px]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm md:text-[16px] font-normal mt-4 text-[#FFFFFF]">
                  {item.description}
                </p>
                <div className="flex justify-end">
                  <button className="mt-4 cursor-pointer bg-[#FFFFFF] text-[#212529] w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition">
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <div className="absolute -bottom-12 right-0 flex gap-2">
          <button
            className={`custom-prev cursor-pointer text-white w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-300 ${
              activeButton === "prev" ? "bg-[#212529]" : "bg-[#B7B7B7]"
            }`}
          >
            <FaArrowLeft />
          </button>
          <button
            className={`custom-next cursor-pointer text-white w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-300 ${
              activeButton === "next" ? "bg-[#212529]" : "bg-[#B7B7B7]"
            }`}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
