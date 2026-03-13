import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutUs = () => {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about-us" },
  ];

  return (
    <div>
      <div>
        <Header />
        <RegHeroSection />
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
          <div>
            <Breadcrumb items={breadcrumbItems} />
            <TrustedBy />
            <WhoWeAre />
            <ImageSection />
            <SpreadAroundWorld />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;

const TrustedBy = () => {
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const logoVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const companies = [
    { id: 1, src: "/image 18.png", alt: "RCF Bolt & Nut" },
    { id: 2, src: "/image 17.png", alt: "GWR Fasteners" },
    { id: 3, src: "/image 16.png", alt: "Carbolts" },
    { id: 4, src: "/image 15.png", alt: "Shell" },
    { id: 5, src: "/image 14.png", alt: "Saudi Aramco" },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariant}
      className="w-full bg-white py-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-4 sm:px-6">
        {/* Left Text */}
        <motion.p
          variants={logoVariant}
          className="text-[#0088ffcf] text-center sm:text-left text-sm sm:text-base md:text-lg font-bold leading-snug max-w-[400px]"
        >
          Trusted by 10,000 world-class Plants, OEM’s service providers of all
          sizes.
        </motion.p>

        {/* Logos */}
        <motion.div
          variants={containerVariant}
          className="flex flex-wrap justify-center sm:justify-end items-center gap-8 sm:gap-10"
        >
          {companies.map((company) => (
            <motion.img
              key={company.id}
              src={company.src}
              alt={company.alt}
              variants={logoVariant}
              whileHover={{
                y: -6,
                scale: 1.05,
                filter: "grayscale(0%)",
              }}
              className="h-8 sm:h-10 md:h-12 object-contain grayscale transition duration-300 cursor-pointer"
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

const WhoWeAre = () => {
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const textVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const listVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const imageVariant = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };
  return (
    <section className="w-full py-16 bg-white overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-[#FAF9F6] items-stretch rounded-md overflow-hidden shadow-sm"
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Left Content */}
        <motion.div
          className="flex flex-col justify-center p-8 md:p-12"
          variants={containerVariant}
        >
          <motion.h3
            variants={textVariant}
            className="text-[#0088ffcf] text-[20px] font-bold mb-3"
          >
            Who We Are
          </motion.h3>

          <motion.h2
            variants={textVariant}
            className="text-2xl sm:text-3xl md:text-[32px] font-bold text-[#0088ffcf] leading-snug mb-4"
          >
            Redefining industrial support with real-time connections between
            Plants and OEMs.
          </motion.h2>

          <motion.p
            variants={textVariant}
            className="text-[#212529] text-sm sm:text-base leading-relaxed mb-6"
          >
            Our AI-driven supply chain collaboration platform transforms the way
            industrial plants connect with OEMs, suppliers, and service
            providers during equipment and service breakdowns.
          </motion.p>

          <motion.div variants={textVariant}>
            <h4 className="font-bold text-[#212529] mb-3">
              Seamless & Secure Communication
            </h4>

            <ul className="list-disc list-inside space-y-1 text-[#212529] text-sm">
              {[
                "Real-time troubleshooting between plant engineers and maintenance teams",
                "Secure document & information sharing",
                "Integrated chat, audio/video conferencing for instant support",
                "AI-powered predictive analysis to prevent failures and optimize downtime",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  variants={listVariant}
                  transition={{ delay: index * 0.08 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div className="w-full h-full" variants={imageVariant}>
          <img
            src="/aboutimg.png"
            alt="Team discussion"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
const ImageSection = () => {
  return (
    <section className="w-full flex justify-center items-center py-8 overflow-hidden">
      <motion.img
        src="/World_Map_2_.png"
        alt="World Map"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-6xl h-auto object-contain"
      />
    </section>
  );
};

const stats = [
  { number: 25, suffix: "+", label: "Years of Experience" },
  { number: 77, suffix: "+", label: "Plants Registered" },
  { number: 200, suffix: "+", label: "OEM’s Registered" },
  { number: 750, suffix: "+", label: "Problem Resolved" },
];

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
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

// Counter component
const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const incrementTime = 20;
    const totalSteps = duration / incrementTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const SpreadAroundWorld = () => {
  return (
    <section className="w-full my-6 bg-[#FAF9F6] py-16 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto text-center px-6"
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Heading */}
        <motion.h2
          variants={cardVariant}
          className="text-3xl md:text-4xl font-bold text-[#0088ffcf] mb-4"
        >
          We Spread Around the World
        </motion.h2>

        <motion.p
          variants={cardVariant}
          className="text-[#212529] max-w-2xl mx-auto mb-12 text-sm md:text-base"
        >
          Our AI-driven supply chain collaboration platform transforms the way
          industrial plants connect with OEMs, suppliers, and service providers
          during equipment and service breakdowns.
        </motion.p>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              whileHover={{
                y: -8,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.12)",
              }}
              className="bg-white py-8 px-4 rounded-lg transition-all"
            >
              <h3 className="text-3xl md:text-4xl font-semibold text-[#212529] mb-2">
                <CountUp end={item.number} suffix={item.suffix} />
              </h3>
              <p className="text-[#212529] text-sm md:text-base">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const RegHeroSection = () => {
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25 },
    },
  };

  const lineVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full h-[406px] flex items-center overflow-hidden">
      {/* Background Image (slow zoom) */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url("/reghero.png")`,
        }}
      />

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-black"
      />

      {/* Content */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        className="relative z-20 px-4 sm:px-8 md:px-16 top-15 lg:px-24 xl:px-32 max-w-6xl"
      >
        <motion.h1 className="text-white font-semibold text-xl sm:text-2xl md:text-3xl lg:text-[41.78px] leading-snug">
          <motion.div variants={lineVariant}>
            <span className="font-extrabold">About Boltix</span>
          </motion.div>

          <motion.div variants={lineVariant}>
            Building a smarter bridge between Plants
          </motion.div>

          <motion.div variants={lineVariant}>
            and OEMs for faster, more reliable solutions.
          </motion.div>
        </motion.h1>
      </motion.div>
    </section>
  );
};

const Breadcrumb = ({ items }) => {
  const containerVariant = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
        ease: "easeOut",
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
  };
  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-2 py-4 text-sm font-medium text-gray-800"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariant}
          className="flex items-center gap-2"
        >
          {index !== items.length - 1 ? (
            <motion.div whileHover={{ y: -2 }}>
              <Link
                to={item.path}
                className="text-gray-600 hover:text-black transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ) : (
            <span className="font-semibold text-black">{item.label}</span>
          )}

          {index < items.length - 1 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-gray-500"
            >
              »
            </motion.span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
