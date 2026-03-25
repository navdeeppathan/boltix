// HeroSection.jsx
import { motion } from "framer-motion";

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

const RegHeroSection = () => {
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

      {/* Dark Overlay */}
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
        className="relative z-20 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 max-w-4xl"
      >
        <motion.h1 className="text-white font-semibold text-xl mt-15 sm:text-2xl md:text-3xl lg:text-[41.78px] leading-snug">
          <motion.div variants={lineVariant}>
            The first <span className="font-extrabold">AI-driven</span>
          </motion.div>

          <motion.div variants={lineVariant}>
            <span className="font-extrabold">collaboration</span> hub for
            industrial
          </motion.div>

          <motion.div variants={lineVariant}>
            plants and Manufacturer ecosystems
          </motion.div>
        </motion.h1>
      </motion.div>
    </section>
  );
};

export default RegHeroSection;
