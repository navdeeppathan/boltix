import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const AboutUs = () => {
  return (
    <div>
      <Header />
      <div className="w-full">
        {/* Hero Section */}
        {/* <section
          className="w-full h-[90vh] bg-cover bg-center relative flex items-center justify-center"
          style={{ backgroundImage: `url("/bgimg.png")` }}
        >
          <div className="bg-black/40 absolute inset-0"></div> 
          <div className="text-center text-white relative z-10 px-4 sm:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-semibold leading-snug sm:leading-snug md:leading-tight lg:leading-tight">
              The first <span className="font-extrabold">AI-driven</span>
              <br />
              <span className="font-extrabold"> collaboration</span> hub for
              industrial <br /> plants and OEM ecosystems.
            </h1>
          </div>
        </section> */}

        <div className="h-[50vh] mt-50">
          <h1 className="text-6xl text-center text-[#212121]">Coming Soon</h1>
        </div>
        {/* Info Cards Section */}
        {/* <section className="w-full py-16 bg-white flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-8 md:px-16">
            
            <div className="bg-white shadow-lg p-6 text-center rounded">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Make Donation</h3>
              <p className="text-gray-600 mb-2">
                Help today because tomorrow you may be the one who needs
                helping!
              </p>
              <span className="text-yellow-500 font-semibold cursor-pointer">
                Read More
              </span>
            </div>

            <div className="bg-white shadow-lg p-6 text-center rounded">
              <div className="text-4xl mb-4">💵</div>
              <h3 className="text-xl font-semibold mb-2">Fundraising</h3>
              <p className="text-gray-600 mb-2">
                Help today because tomorrow you may be the one who needs
                helping!
              </p>
              <span className="text-yellow-500 font-semibold cursor-pointer">
                Read More
              </span>
            </div>

           
            <div className="bg-white shadow-lg p-6 text-center rounded">
              <div className="text-4xl mb-4">🙋‍♂️</div>
              <h3 className="text-xl font-semibold mb-2">Become A Volunteer</h3>
              <p className="text-gray-600 mb-2">
                Help today because tomorrow you may be the one who needs
                helping!
              </p>
              <span className="text-yellow-500 font-semibold cursor-pointer">
                Read More
              </span>
            </div>
          </div>
        </section> */}
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
