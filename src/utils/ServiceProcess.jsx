import React from "react";
import Header from "./Header";
import Footer from "./Footer";

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

      {/* <div className="w-full mt-20 bg-gray-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
         
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Building Process
            </h1>
            <p className="text-gray-600 text-lg">
              Every building starts with a concept and design. Turn your vision
              into a<br />
              reality with planning and design.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            

            {cards.map((card, index) => (
              <div key={index} className={`relative z-10 ${card.offset}`}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                 
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {card.description}
                    </p>
                    <button className="w-full text-center text-gray-900 font-semibold text-sm tracking-wider hover:text-orange-500 transition-colors">
                      MORE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <div className="h-[50vh] mt-50">
        <h1 className="text-6xl text-center text-[#212121]">Coming Soon</h1>
      </div>
      <Footer />
    </div>
  );
}
