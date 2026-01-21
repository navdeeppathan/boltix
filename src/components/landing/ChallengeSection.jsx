// ChallengeSection.jsx
import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ChallengeSection = () => {
  return (
    <section className="bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-32 overflow-hidden">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mx-auto mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]">
          The Challenge in Industry Collaboration
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-[24px] font-medium text-[#212529]">
          The Collaboration Problem in Today’s
        </p>
        <p className="mt-1 text-sm sm:text-base md:text-[24px] font-medium text-[#212529]">
          Industrial Ecosystem
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 cursor-pointer sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {/* Card 1 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -12,
            boxShadow: "0px 25px 60px rgba(0,0,0,0.12)",
          }}
          className="bg-[#FFFFFF] rounded-[14px] shadow flex flex-col overflow-hidden"
        >
          <div className="p-6">
            <h3 className="font-mulish font-bold text-[30px] leading-[36px] text-[#212529] mb-2">
              Fragmented & Inefficient Communication
            </h3>
            <p className="font-mulish text-[16px] leading-[25px] text-[#212529]">
              Traditional supply chain communication is disorganized, leading to
              delays in troubleshooting and resolving equipment breakdowns.
            </p>
          </div>

          <motion.img
            src="/sec1.png"
            alt="Fragmented Communication"
            variants={imageVariants}
            whileHover="hover"
            className="mt-auto w-full h-[319px] object-cover"
          />
        </motion.div>

        {/* Card 2 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -12,
            boxShadow: "0px 25px 60px rgba(0,0,0,0.12)",
          }}
          className="bg-[#FFFFFF] rounded-[14px] shadow flex flex-col overflow-hidden"
        >
          <div className="p-6">
            <h3 className="font-mulish font-bold text-[30px] leading-[36px] text-[#212529] mb-2">
              Data Security Risks
            </h3>
            <p className="font-mulish text-[16px] leading-[25px] text-[#212529]">
              Sensitive design files and technical documents are often shared
              through unsecured channels, increasing breach risks.
            </p>
          </div>

          <motion.img
            src="/sec2.png"
            alt="Data Security Risks"
            variants={imageVariants}
            whileHover="hover"
            className="mt-auto w-full h-[319px] object-cover"
          />
        </motion.div>

        {/* Card 3 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -12,
            boxShadow: "0px 25px 60px rgba(0,0,0,0.12)",
          }}
          className="bg-[#FFFFFF] rounded-[14px] shadow flex flex-col overflow-hidden"
        >
          <div className="p-6">
            <h3 className="font-mulish font-bold text-[30px] leading-[36px] text-[#212529] mb-2">
              Difficulty in Identifying the Right OEM
            </h3>
            <p className="font-mulish text-[16px] leading-[25px] text-[#212529]">
              Industrial plants struggle to locate the right OEM quickly,
              increasing downtime and operational loss.
            </p>
          </div>

          <motion.img
            src="/sec3.png"
            alt="Identifying Partners"
            variants={imageVariants}
            whileHover="hover"
            className="mt-auto w-full h-[319px] object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ChallengeSection;
