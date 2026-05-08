// SolutionsSection.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa6";

const headingVariant = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

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
        "Instant communication between plants, manufacturers, suppliers, and service providers. Engineers and technicians can access the platform directly through mobile or desktop devices.",
      icon: "/frame1.png",
    },
    {
      title: "Secure Document Sharing",
      description:
        "Advanced encryption ensures the safe storage and transfer of design files, service documents, and compliance paperwork.",
      icon: "/frame2.png",
    },
    {
      title: "AI-Driven Partner Matching",
      description:
        "Smart algorithms automatically recommend the most suitable suppliers and manufacturing partners.",
      icon: "/frame3.png",
    },
    {
      title: "Integrated Collaboration",
      description:
        "Secure video meetings, task tracking, and knowledge sharing enable faster issue resolution.",
      icon: "/frame4.png",
    },
    {
      title: "AI-Driven Partner Matching",
      description:
        "Smart algorithms automatically recommend the most suitable suppliers and manufacturers.",
      icon: "/frame1.png",
    },
    {
      title: "Integrated Collaboration",
      description:
        "Secure video meetings, task tracking, and knowledge sharing enable faster resolution.",
      icon: "/frame4.png",
    },
  ];

  useEffect(() => {
    const prevBtn = document.querySelector(".custom-prev");
    const nextBtn = document.querySelector(".custom-next");

    prevBtn?.addEventListener("click", () => setActiveButton("prev"));
    nextBtn?.addEventListener("click", () => setActiveButton("next"));

    return () => {
      prevBtn?.removeEventListener("click", () => setActiveButton("prev"));
      nextBtn?.removeEventListener("click", () => setActiveButton("next"));
    };
  }, []);

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-32 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          variants={headingVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mx-auto mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#0088ffcf]">
            How We Solve Your Connection Challenges
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-[24px] font-medium text-[#212529]">
            Solution – AI-Powered Collaboration & Secure Data Sharing for
          </p>
          <p className="mt-1 text-sm sm:text-base md:text-[24px] font-medium text-[#212529]">
            Plant & Service Breakdowns
          </p>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          <Swiper
            spaceBetween={20}
            navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
            modules={[Navigation]}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {solutions.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{
                    y: -12,
                    boxShadow: "0px 25px 60px rgba(0,0,0,0.25)",
                  }}
                  viewport={{ once: true }}
                  className="bg-[#212529] text-white rounded-[14px] p-8 min-h-[314px] flex flex-col justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <motion.img
                      src={item.icon}
                      alt=""
                      className="w-[55px] h-[51px]"
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <h3 className="text-lg md:text-[24px] font-bold leading-[36px]">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm md:text-[16px] mt-4 text-white/90">
                    {item.description}
                  </p>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="mt-4 bg-white text-[#212529] w-8 h-8 flex items-center justify-center rounded-full"
                    >
                      <FaPlus size={12} />
                    </motion.button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation */}
          <div className="absolute -bottom-12 right-0 flex gap-2">
            <button
              className={`custom-prev w-9 h-9 flex items-center justify-center rounded-full text-white transition ${
                activeButton === "prev" ? "bg-[#212529]" : "bg-[#B7B7B7]"
              }`}
            >
              <FaArrowLeft />
            </button>
            <button
              className={`custom-next w-9 h-9 flex items-center justify-center rounded-full text-white transition ${
                activeButton === "next" ? "bg-[#212529]" : "bg-[#B7B7B7]"
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionsSection;
