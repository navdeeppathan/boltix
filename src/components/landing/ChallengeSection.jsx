// ChallengeSection.jsx
import React from "react";

const ChallengeSection = () => {
  return (
    <section className="bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-32">
      {/* Heading */}
      <div className="text-center  mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]">
          The Challenge in Industry Collaboration
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-[24px] font-medium text-[#212529]">
          The Collaboration Problem in Today’s
        </p>
        <p className="mt-1 text-sm sm:text-base md:text-[24px] font-medium text-[#212529]">
          Industrial Ecosystem
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-[#FFFFFF] rounded-[14px] shadow  flex flex-col items-start">
          <div className="p-6">
            <h3 className="font-mulish font-bold text-[30px] leading-[36px] text-[#212529] mb-2">
              Fragmented & Inefficient Communication
            </h3>

            <p className="font-mulish font-normal text-[16px] leading-[25px] text-[#212529] mb-4">
              Traditional supply chain communication is disorganized, leading to
              delays in troubleshooting and resolving equipment breakdowns. Most
              plant engineers rely on emails, phone calls, third-party
              suppliers, and distributors, making issue resolution slow and
              inefficient.
            </p>
          </div>
          <img
            src="/sec1.png"
            alt="Fragmented Communication"
            className="mt-auto w-full h-[319px]"
          />
        </div>

        {/* Card 2 */}
        <div className="bg-[#FFFFFF] rounded-[14px] shadow  flex flex-col items-start">
          <div className="p-6">
            <h3 className="font-mulish font-bold text-[30px] leading-[36px] text-[#212529] mb-2">
              Data Security Risks
            </h3>
            <p className="font-mulish font-normal text-[16px] leading-[25px] text-[#212529] mb-4">
              Sensitive design files and technical documents are often shared
              through unsecured channels, increasing the risk of data breaches,
              IP theft, and compliance issues.
            </p>
          </div>

          <img
            src="/sec2.png"
            alt="Data Security Risks"
            className="mt-auto w-full h-[319px]"
          />
        </div>

        {/* Card 3 */}
        <div className="bg-[#FFFFFF] rounded-[14px] shadow  flex flex-col items-start">
          <div className="p-6">
            <h3 className="font-mulish font-bold text-[30px] leading-[36px] text-[#212529] mb-2">
              Difficulty in Identifying the Right OEM
            </h3>
            <p className="font-mulish font-normal text-[16px] leading-[25px] text-[#212529] mb-4">
              Industrial plants struggle to quickly locate the right OEM,
              service provider, or manufacturer for critical equipment and
              service issues, further delaying resolution and increasing
              downtime.
            </p>
          </div>

          <img
            src="/sec3.png"
            alt="Identifying Partners"
            className="mt-auto w-full h-[319px]"
          />
        </div>
      </div>
    </section>
  );
};

export default ChallengeSection;
