import React from "react";
import { motion } from "framer-motion";

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Register",
      description:
        "Sign up as a Plant Operator or Manufacturer Supplier by filling out a short registration form with your business details and contact information.",
    },
    {
      title: "Get Verified",
      description:
        "Our system reviews and validates your information. Once approved, you’ll receive an email containing a secure link along with your username and password.",
    },
    {
      title: "Log In & Connect",
      description:
        "Click the link in your email to log in, access your personalized dashboard, and start connecting with verified partners to grow and collaborate efficiently.",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-12 bg-white overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Heading */}
        <motion.h2
          variants={cardVariant}
          className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]"
        >
          How it works
        </motion.h2>

        <motion.p
          variants={cardVariant}
          className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]"
        >
          Submit a link with the list of Question
        </motion.p>

        {/* Cards */}
        <motion.div
          variants={containerVariant}
          className="mt-10 grid grid-cols-1 py-4 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#000000]/20 rounded-lg border-[2px] border-[#EBE8DD] overflow-hidden"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="p-6 text-left transition-all"
            >
              <motion.h3
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
                className="text-lg md:text-[32px] font-bold text-[#212529]"
              >
                {step.title}
              </motion.h3>

              <p className="mt-3 text-[#212529] md:text-[16px] font-normal text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
