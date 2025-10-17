// PricingSection.jsx
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";

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
      buttonColor: "bg-[#FFFFFF] text-gray-800 hover:bg-gray-300",
      popular: false,
    },
  ];

  return (
    <section className="bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-32">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]">
          Simple Pricing
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
          Choose the plan that fits your needs
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2  mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`${
              activeIndex === idx ? "bg-[#FFFFFF]" : "bg-[#F4F2ED]"
            } rounded-xl shadow-md p-6 relative flex flex-col`}
          >
            {/* Most Popular Tag */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#212529] text-[#FAF9F6] text-xs md:text-[16px] font-bold px-4 py-2 rounded-full flex items-center gap-3">
                <img src="/king.png" alt="" className="w-[27px] h-[27px]" />{" "}
                MOST POPULAR
              </div>
            )}

            {/* Title */}
            <h3 className="text-center text-lg md:text-[24px] font-bold text-[#212529] mt-4">
              {plan.title}
            </h3>

            {/* Price */}
            <div className="text-center mt-4">
              <p className="text-3xl md:text-[48px] font-bold text-[#212529]">
                {plan.price}
                <span className="text-base md:text-[32px] font-bold text-[#666E75]">
                  {" "}
                  /mo
                </span>
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="line-through text-[#212529] md:text-[24px] font-normal text-sm">
                  {plan.oldPrice}
                </span>
                <span className="text-[#F75200] md:text-[15px] bg-[#FAF9F6] px-2 py-1 flex items-center justify-center rounded-[8px] font-bold text-sm">
                  {plan.save}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              className={`${plan.buttonColor} mt-6 py-2 px-6 rounded-[10px] md:text-[24px] font-bold text-[#FFFFFF]`}
            >
              START NOW
            </button>

            {/* Features */}
            <ul className="mt-6 space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-[#212529] text-sm md:text-[20px] font-bold border-b border-dotted border-gray-300 pb-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-[#FAF9F6] w-[27px] h-[27px] flex items-center justify-center">
                      <FaCheck className="text-[#207EB1] text-xs" />
                    </div>
                    {feature.label}
                  </div>
                  <span className="">{feature.value}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center mt-8 justify-center">
              <div className="bg-[#C2C2C2] w-[248px]   h-[1px] rounded animate-pulse" />
            </div>

            {/* 3-step process */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#212529] md:text-[20px] font-bold mb-2">
                3-Step Process
              </p>
              <p className="text-xs text-[#212529] md:text-[20px] font-medium flex justify-center gap-2">
                <span>Purchase</span> → <span>Register</span> →{" "}
                <span>Start</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
