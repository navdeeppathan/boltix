// TestimonialsSection.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { FaRegStar, FaStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";

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
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      rating: 5,
      text: `“We were struggling to find reliable OEM partners for our new production line. This platform made it effortless, verified suppliers, fast communication, and genuine business leads. Highly recommended!"`,
      author: "Lisa Chen, ",
      description: "Marketing Lead,",
      loc: "MechaFlow Systems (Singapore)",
    },
    {
      rating: 5,
      text: `“As an OEM supplier, we’ve connected with several verified plants within a week of joining. It’s a great space to showcase our products and build long-term partnerships.”`,
      author: "Sarah Malik, ",
      description: "Sales Director,",
      loc: "Prime Automation Solutions (UAE)",
    },
    {
      rating: 4,
      text: `“This platform bridges the exact gap between plant owners and OEMs. The verification process adds a level of trust we haven’t seen elsewhere."`,
      author: "Rohit Sharma, ",
      description: "Operations Head,",
      loc: "GreenTech Manufacturing (India)",
    },
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-32 overflow-hidden">
      {/* Heading */}
      <motion.div
        variants={headingVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#0088ffcf]">
          Trusted by Companies Worldwide
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
          Real experiences from verified partners
        </p>
      </motion.div>

      {/* Slider */}
      <Swiper
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((item, idx) => (
          <SwiperSlide key={idx}>
            <motion.div
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                boxShadow: "0px 25px 60px rgba(0,0,0,0.12)",
              }}
              className="bg-[#FAF9F6] p-6 rounded-lg h-full flex flex-col justify-between transition-all"
            >
              {/* Rating */}
              <div className="flex text-[#F3BF4D] mb-4">
                {[...Array(5)].map((_, i) =>
                  i < item.rating ? (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <FaStar size={20} />
                    </motion.span>
                  ) : (
                    <FaRegStar key={i} size={20} />
                  ),
                )}
              </div>

              {/* Text */}
              <p className="text-sm md:text-[16px] text-[#212529] leading-relaxed mb-4">
                {item.text}
              </p>

              {/* Author */}
              <p className="font-bold md:text-[17px] text-[#212529]">
                {item.author}
                <span className="font-normal">
                  {item.description}
                  <br />
                  {item.loc}
                </span>
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TestimonialsSection;
