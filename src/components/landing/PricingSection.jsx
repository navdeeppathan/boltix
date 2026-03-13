// PricingSection.jsx
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const PricingSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const plans = [
    {
      title: "BASIC",
      price: "$4,995",
      oldPrice: "$7,700",
      save: "Save 35%",
      features: [
        { label: "No of sites", value: "5" },
        { label: "No of Users in each sites", value: "10" },
        { label: "Reporting Approver in each sites", value: "5" },
        { label: "No of Machinery in each sites", value: "2" },
        { label: "No of Manufacturer providing the Services", value: "5" },
      ],
      buttonColor: "bg-[#207EB1] hover:bg-blue-700",
      popular: true,
    },
    {
      title: "PREMIUM",
      price: "$8000",
      oldPrice: "$7,700",
      save: "Save 35%",
      features: [
        { label: "No of sites", value: "Unlimited" },
        { label: "No of Users in each sites", value: "30" },
        { label: "Reporting Approver in each sites", value: "30" },
        { label: "No of Machinery in each sites", value: "Unlimited" },
        {
          label: "No of Manufacturer providing the Services",
          value: "Unlimited",
        },
      ],
      buttonColor: "bg-white text-gray-800 hover:bg-gray-300",
      popular: false,
    },
  ];

  return (
    <section className="bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-32 overflow-hidden">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#0088ffcf]">
          Simple Pricing
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
          Choose the plan that fits your needs
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2 mx-auto"
      >
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            variants={cardVariant}
            onClick={() => setActiveIndex(idx)}
            whileHover={{
              y: -12,
              boxShadow: "0px 25px 60px rgba(0,0,0,0.15)",
            }}
            animate={activeIndex === idx ? { scale: 1.03 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`relative rounded-xl p-6 flex flex-col cursor-pointer ${
              activeIndex === idx ? "bg-white" : "bg-[#F4F2ED]"
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <motion.div
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#212529] text-[#FAF9F6] text-xs md:text-[16px] font-bold px-4 py-2 rounded-full flex items-center gap-3"
              >
                <img src="/king.png" alt="" className="w-[27px] h-[27px]" />
                MOST POPULAR
              </motion.div>
            )}

            {/* Title */}
            <h3 className="text-center text-lg md:text-[24px] font-bold text-[#0088ffcf] mt-4">
              {plan.title}
            </h3>

            {/* Price */}
            <div className="text-center mt-4">
              <p className="text-3xl md:text-[48px] font-bold text-[#212529]">
                {plan.price}
                <span className="text-base md:text-[32px] text-[#666E75]">
                  {" "}
                  /mo
                </span>
              </p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="line-through md:text-[24px] text-sm">
                  {plan.oldPrice}
                </span>
                <span className="text-[#F75200] bg-[#FAF9F6] px-2 py-1 rounded-[8px] font-bold text-sm">
                  {plan.save}
                </span>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`${plan.buttonColor} mt-6 py-2 px-6 rounded-[10px] md:text-[24px] font-bold text-white`}
            >
              START NOW
            </motion.button>

            {/* Features */}
            <ul className="mt-6 space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between items-center text-sm md:text-[20px] font-bold border-b border-dotted pb-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-[#FAF9F6] w-[27px] h-[27px] flex items-center justify-center">
                      <FaCheck className="text-[#207EB1] text-xs" />
                    </div>
                    {feature.label}
                  </div>
                  <span>{feature.value}</span>
                </motion.li>
              ))}
            </ul>

            {/* Divider */}
            <div className="flex justify-center mt-8">
              <div className="bg-[#C2C2C2] w-[248px] h-[1px] animate-pulse" />
            </div>

            {/* Steps */}
            <div className="mt-6 text-center">
              <p className="md:text-[20px] font-bold">3-Step Process</p>
              <p className="md:text-[20px] font-medium">
                Purchase → Register → Start
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PricingSection;
