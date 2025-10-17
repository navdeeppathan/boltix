// TestimonialsSection.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaRegStar, FaStar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

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
      author: "Sarah Malik,",
      description: "Sales Director,",
      loc: "Prime Automation Solutions (UAE)",
    },
    {
      rating: 4,
      text: `“This platform bridges the exact gap between plant owners and OEMs. The verification process adds a level of trust we haven’t seen elsewhere."`,
      author: "Rohit Sharma,",
      description: "Operations Head,",
      loc: "GreenTech Manufacturing (India)",
    },
  ];

  return (
    <section className="bg-[#FFFFFF] py-16 px-4 sm:px-6 lg:px-32">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]">
          Trusted by Companies Worldwide
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
          Choose the plan that fits your needs
        </p>
      </div>

      {/* Swiper Slider */}
      <Swiper
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        breakpoints={{
          320: { slidesPerView: 1 }, // Mobile
          640: { slidesPerView: 1 }, // Small tablets
          768: { slidesPerView: 2 }, // Tablets
          1024: { slidesPerView: 3 }, // Desktop
        }}
      >
        {testimonials.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-[#FAF9F6] p-6 rounded-lg shadow h-full flex flex-col justify-between">
              {/* Rating */}
              <div className="flex text-[#F3BF4D] mb-4">
                {[...Array(5)].map((_, i) =>
                  i < item.rating ? (
                    <FaStar key={i} size={20} />
                  ) : (
                    <FaRegStar key={i} size={20} />
                  )
                )}
              </div>

              {/* Testimonial Text */}
              <p className="text-sm text-[#212529] md:text-[16px] font-normal leading-relaxed mb-4">
                {item.text}
              </p>

              {/* Author */}
              <p className="font-bold md:text-[17px] text-[#212529]">
                {item.author}{" "}
                <span className="font-normal">
                  {item.description}
                  <br />
                  {item.loc}
                </span>
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TestimonialsSection;
