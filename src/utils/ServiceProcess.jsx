import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
export default function ServiceProcess() {
  const cards = [
    {
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
      title: "Concept",
      description:
        "Etiam erat velit scelerisque in dictum non consectetur. Nisl purus in mollis nunc sed id semper. Cras fermentum odio eu feugiat pretium nibh ipsum. Tristique senectus.",
      offset: "mt-0",
    },
    {
      image:
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
      title: "Prototyping",
      description:
        "Etiam erat velit scelerisque in dictum non consectetur. Nisl purus in mollis nunc sed id semper. Cras fermentum odio eu feugiat pretium nibh ipsum. Tristique senectus.",
      offset: "mt-16",
    },
    {
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      title: "Building",
      description:
        "Etiam erat velit scelerisque in dictum non consectetur. Nisl purus in mollis nunc sed id semper. Cras fermentum odio eu feugiat pretium nibh ipsum. Tristique senectus.",
      offset: "mt-32",
    },
  ];

  return (
    <div>
      <Header />
      <ProcessPage />
      {/* <HowItWorks /> */}
      <Footer />
    </div>
  );
}

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

const HowItWorks = () => {
  const registrationSteps = [
    {
      title: "Click Let’s Start",
      description:
        "From the website header, click the “Let’s Start” button to begin your registration journey.",
    },
    {
      title: "Choose Your Role",
      description:
        "Select whether you want to register as a Plant Operator or an Manufacturer / Service Provider.",
    },
    {
      title: "Register & Get Verified",
      description:
        "Complete the registration form with your business details. Our system verifies your information and sends login credentials via email after approval.",
    },
  ];

  const loginSteps = [
    {
      title: "Click Login",
      description:
        "From the website header, click on the “Login” button to access the login options.",
    },
    {
      title: "Select User Type",
      description:
        "Choose your role: Plant Supervisor, Plant User, Manufacturer Supervisor, or Manufacturer User.",
    },
    {
      title: "Login & Access Dashboard",
      description:
        "Enter your credentials to log in and get instant access to your personalized dashboard.",
    },
  ];

  return (
    <section className="py-12 mt-24 px-4 sm:px-6 lg:px-12 bg-white overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Registration */}
        <div className="text-center">
          <motion.h2
            variants={cardVariant}
            className="text-2xl sm:text-3xl md:text-[48px] font-bold text-[#212529]"
          >
            Registration Process
          </motion.h2>

          <motion.p
            variants={cardVariant}
            className="mt-2 text-sm sm:text-base md:text-[20px] text-[#212529]"
          >
            Register quickly and get verified to start collaborating
          </motion.p>
        </div>

        <motion.div
          variants={containerVariant}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#000]/20 border-[2px] border-[#EBE8DD] rounded-lg overflow-hidden"
        >
          {registrationSteps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="p-6 text-left"
            >
              <h3 className="text-lg md:text-[28px] font-bold text-[#212529]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm md:text-[16px] text-[#212529] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Login */}
        <div className="text-center mt-20">
          <motion.h2
            variants={cardVariant}
            className="text-2xl sm:text-3xl md:text-[48px] font-bold text-[#212529]"
          >
            Login Process
          </motion.h2>

          <motion.p
            variants={cardVariant}
            className="mt-2 text-sm sm:text-base md:text-[20px] text-[#212529]"
          >
            Secure login based on your assigned role
          </motion.p>
        </div>

        <motion.div
          variants={containerVariant}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#000]/20 border-[2px] border-[#EBE8DD] rounded-lg overflow-hidden"
        >
          {loginSteps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="p-6 text-left"
            >
              <h3 className="text-lg md:text-[28px] font-bold text-[#212529]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm md:text-[16px] text-[#212529] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ProcessPage = () => {
  return (
    <main className="bg-white mt-24 overflow-hidden">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-12 py-20 bg-[#F8F9FA]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-[56px] font-bold text-[#0088ffcf]"
          >
            Our Process
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-3xl mx-auto md:text-[20px] text-[#212529]/80"
          >
            A simple, secure, and role-based process designed to help Plant
            Operators an Manufacturer partners get started quickly and work
            efficiently.
          </motion.p>
        </motion.div>
      </section>

      {/* Registration Process */}
      <section className="px-4 sm:px-6 lg:px-12 py-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            className="md:text-[42px] text-[#0088ffcf] font-bold"
          >
            Registration Process
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-3xl md:text-[18px] text-[#212529]/80"
          >
            Create your account by selecting your role and submitting your
            details for verification.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              [
                "Start Registration",
                "Click the “Let’s Start” button from the website header to begin the registration process.",
              ],
              [
                "Choose Your Role",
                "Select whether you want to register as a Plant Operator or an Manufacturer/ Service Provider.",
              ],
              [
                "Get Verified",
                "Submit your details for verification. Once approved, you’ll receive login credentials via email.",
              ],
            ].map(([title, desc], index) => (
              <motion.div
                key={index}
                variants={card}
                whileHover={{ y: -6 }}
                className="border border-[#EBE8DD] rounded-lg p-6 transition"
              >
                <span className="text-sm font-semibold text-[#212529]/60">
                  Step {index + 1}
                </span>
                <h3 className="mt-2 md:text-[22px] text-[#0088ffcf] font-bold">
                  {title}
                </h3>
                <p className="mt-3 md:text-[16px] text-[#212529]/80">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Login Process */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 bg-[#F8F9FA]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            className="md:text-[42px] text-[#0088ffcf] font-bold"
          >
            Login Process
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-3xl md:text-[18px] text-[#212529]/80"
          >
            Secure login with role-based access to ensure the right permissions.
          </motion.p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              [
                "Click Login",
                "Click the “Login” button from the website header.",
              ],
              ["Select User Type", "Choose Plant or Manufacturer role."],
              [
                "Access Dashboard",
                "Log in and access your role-specific dashboard.",
              ],
            ].map(([title, desc], index) => (
              <motion.div
                key={index}
                variants={card}
                whileHover={{ y: -6 }}
                className="border border-[#EBE8DD] rounded-lg p-6"
              >
                <span className="text-sm font-semibold text-[#212529]/60">
                  Step {index + 1}
                </span>
                <h3 className="mt-2 md:text-[22px] text-[#0088ffcf] font-bold">
                  {title}
                </h3>
                <p className="mt-3 md:text-[16px] text-[#212529]/80">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* After Login */}
      <section className="px-4 sm:px-6 lg:px-12 py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="md:text-[42px] text-[#0088ffcf] font-bold">
            What Happens After Login?
          </h2>

          <ul className="mt-6 space-y-3 md:text-[16px] text-[#212529]/80">
            {[
              "Access role-specific dashboards and tools",
              "Manage users, operations, and data securely",
              "Collaborate with verified partners",
              "Track updates and activities in real time",
            ].map((item, i) => (
              <motion.li key={i} variants={fadeUp}>
                • {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Why Our Process */}
      <section className="px-4 sm:px-6 lg:px-12 py-20 bg-[#212529] text-white">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUp} className="md:text-[42px] font-bold">
            Why Our Process Works
          </motion.h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Quick and simple onboarding",
              "Secure role-based access",
              "Verified and trusted users",
              "Scalable for growing organizations",
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={card}
                whileHover={{ y: -6 }}
                className="border border-white/20 rounded-lg p-6 md:text-[16px]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
};
