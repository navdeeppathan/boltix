import { useEffect, useRef, useState } from "react";

const FinanceIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="3" y="11" width="4" height="8" rx="1" fill="#4ADE80" />
    <rect x="10" y="7" width="4" height="12" rx="1" fill="#4ADE80" />
    <rect x="17" y="3" width="4" height="16" rx="1" fill="#4ADE80" />
  </svg>
);

const SupplyChainIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <circle cx="5" cy="12" r="2" fill="#38BDF8" />
    <circle cx="19" cy="6" r="2" fill="#38BDF8" />
    <circle cx="19" cy="18" r="2" fill="#38BDF8" />
    <path
      d="M7 12 L17 6 M7 12 L17 18"
      stroke="#38BDF8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const sections = [
  {
    id: "boltix",
    icon: FinanceIcon,
    label: "BOLTIX",
    title:
      "AI-driven diagnostics predict failures early, reducing downtime and maintenance costs.",
    desc: "BOLTIX leverages advanced AI-powered diagnostics and real-time equipment monitoring to identify potential failures before they occur. By analyzing machine data continuously, it helps businesses minimize unplanned downtime, optimize maintenance schedules, and significantly reduce operational costs.",
    stat: "60%",
    statecolor: "text-green-400",
    statText: "reduction in unplanned downtime with predictive AI monitoring",
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],

    cards: [
      {
        type: "White Paper",
        title:
          "Predictive Maintenance: Transforming Operations with AI-Driven Diagnostics",
        accent: "green",
      },
      {
        type: "Blog",
        title: "How Early Failure Detection Cuts Maintenance Costs by 40%",
        accent: "blue",
      },
    ],
  },

  {
    id: "supply",
    icon: SupplyChainIcon,
    label: "BOLTIX FOR SUPPLY CHAIN",
    title:
      "Secure plant and manufacturer collaboration improves asset visibility, accountability, and decision-making.",
    desc: "BOLTIX enables secure, real-time collaboration between plants and manufacturer partners through a unified digital platform. With end-to-end asset tracking, performance insights, and AI-powered analytics, organizations gain complete visibility, improve accountability, and make faster, data-driven operational decisions across the supply chain.",
    stat: "35%",
    statecolor: "text-blue-400",
    statText:
      "improvement in asset visibility and cross-partner decision accuracy",
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],

    cards: [
      {
        type: "E-Book",
        title:
          "Strengthening Plant & Manufacturer Collaboration Through Secure Digital Integration",
        accent: "blue",
      },
      {
        type: "White Paper",
        title:
          "Achieving End-to-End Asset Visibility with AI-Driven Supply Networks",
        accent: "green",
      },
    ],
  },

  {
    id: "ai",
    icon: SupplyChainIcon,
    label: "BOLTIX AI",
    title:
      "Centralized data platforms accelerate troubleshooting and standardize workflows across global enterprises.",
    desc: "BOLTIX AI delivers a unified, centralized data platform that connects global operations, assets, and teams in real time. By standardizing workflows and leveraging advanced analytics, organizations can accelerate troubleshooting, eliminate data silos, and drive consistent performance improvements across global enterprise locations.",
    stat: "70%",
    statecolor: "text-blue-700",
    statText: "faster root-cause analysis and standardized global workflows",
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
    cards: [
      {
        type: "Blog",
        title:
          "Breaking Data Silos: How Centralized AI Platforms Improve Enterprise Efficiency",
        accent: "blue",
      },

      {
        type: "Case Study",
        title:
          "Standardizing Global Operations with AI-Powered Data Intelligence",
        accent: "blue",
      },
    ],
  },
];

export default function ScrollHero() {
  const [active, setActive] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActive(index);
          }
        });
      },
      { threshold: 0.6 },
    );

    refs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // AUTO IMAGE SLIDE
  useEffect(() => {
    const images = sections[active].images;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <section className="relative max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT SCROLL CONTENT */}
        <div className="space-y-[70vh] py-20">
          {sections.map((sec, i) => (
            <div
              key={sec.id}
              ref={(el) => (refs.current[i] = el)}
              data-index={i}
              className="min-h-[60vh]"
            >
              <div className="flex items-center gap-2 mb-4">
                <sec.icon />
                <p className="text-sm font-semibold text-slate-900">
                  {sec.label}
                </p>
              </div>

              <h1 className="text-xl md:text-3xl font-medium text-[#0088ffcf] leading-tight">
                {sec.title}
              </h1>

              <p className="mt-6 text-sm text-slate-600 max-w-lg">{sec.desc}</p>

              <div className="mt-10 flex items-center gap-4">
                <span className={`text-5xl font-bold ${sec.statecolor}`}>
                  {sec.stat}
                </span>
                <span className="text-slate-700 font-medium">
                  {sec.statText}
                </span>
              </div>

              <div className="mt-10 flex gap-6 ">
                {sec.cards.map((card, idx) => (
                  <HoverCard key={idx} {...card} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT STICKY IMAGE */}
        <div className="relative hidden lg:block">
          <div className="sticky top-24 h-[520px] flex items-center justify-center">
            {/* Background blobs */}
            <div className="absolute w-72 h-72 bg-[#0088FF] rounded-full -right-10 top-0 opacity-70" />
            <div className="absolute w-72 h-72 bg-slate-900 rounded-full right-20 bottom-0" />

            {/* Image */}
            {/* <img
              src={sections[active].image}
              alt=""
              className="relative z-10 rounded-xl shadow-2xl transition-all duration-500"
            /> */}
            {/* AUTO SLIDER IMAGE */}
            <img
              key={sections[active].images[currentImage]}
              src={sections[active].images[currentImage]}
              alt=""
              className="
                relative z-10 rounded-xl shadow-2xl
                transition-all duration-700
                animate-fadeIn
                w-full max-w-[550px] object-cover
              "
            />

            {/* Dots */}
            <div className="absolute bottom-4 flex gap-2 z-20">
              {sections[active].images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentImage ? "w-8 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>

            <style>
              {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.96);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              .animate-fadeIn {
                animation: fadeIn 0.7s ease;
              }
              `}
            </style>
          </div>
        </div>
      </div>
    </section>
  );
}

const HoverCard = ({ type, title, accent }) => {
  const accentMap = {
    green: {
      label: "group-hover:text-green-400",
      dots: "#4ADE80",
    },
    blue: {
      label: "group-hover:text-blue-400",
      dots: "#60A5FA",
    },
  };

  return (
    <div
      className="
        group relative w-80 rounded-2xl p-6 cursor-pointer
        bg-white text-slate-900
        shadow-md transition-all duration-500
        hover:bg-gradient-to-br hover:from-[#071D49] hover:to-[#0B2C6F]
        hover:shadow-2xl
      "
    >
      {/* Decorative pattern */}
      <div
        className="absolute right-4 bottom-4 w-16 h-16 opacity-0
        bg-[radial-gradient(circle_at_30%_30%,var(--dot)_2px,transparent_3px)]
        bg-[length:10px_10px]
        group-hover:opacity-100 transition"
        style={{ "--dot": accentMap[accent].dots }}
      />

      <p
        className={`text-sm font-medium text-sky-400 ${accentMap[accent].label}`}
      >
        {type}
      </p>

      <p className="mt-2 text-sm font-semibold leading-snug group-hover:text-white">
        {title}
      </p>
    </div>
  );
};
