import React, { useState, useEffect } from 'react';
import { Plus, Repeat, BarChart, Zap, Filter, Settings, ChevronLeft, ChevronRight as RightIcon } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay, isActive, isMobile }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 transform transition-all duration-300 hover:shadow-xl group relative overflow-hidden ${
        isMobile ? (isActive ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-0 absolute pointer-events-none') : 'hover:-translate-y-2'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mr-4 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-0">{description}</p>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Plus className="text-indigo-600 dark:text-indigo-400" size={20} />,
      title: "Log Your Problems",
      description: "Save problems with title, link, tags, difficulty, and notes from any platform. Organize everything in one place.",
      delay: 100,
    },
    {
      icon: <Filter className="text-indigo-600 dark:text-indigo-400" size={20} />,
      title: "Organize by Topic & Company",
      description: "Categorize problems by topics (arrays, trees, DP) and companies (Google, Amazon, Meta) for targeted practice.",
      delay: 200,
    },
    {
      icon: <Repeat className="text-indigo-600 dark:text-indigo-400" size={20} />,
      title: "Smart Revision Scheduling",
      description: "Customize revision settings by difficulty, topics, or companies. Our algorithm schedules revisions for maximum retention.",
      delay: 300,
    },
    {
      icon: <BarChart className="text-indigo-600 dark:text-indigo-400" size={20} />,
      title: "Track Progress",
      description: "Visualize your strengths and weaknesses with detailed analytics. See improvement over time with performance metrics.",
      delay: 400,
    },
    {
      icon: <Settings className="text-indigo-600 dark:text-indigo-400" size={20} />,
      title: "Customizable Settings",
      description: "Tailor your experience with personalized revision frequency, notification preferences, and display options.",
      delay: 500,
    },
    {
      icon: <Zap className="text-indigo-600 dark:text-indigo-400" size={20} />,
      title: "Quick Edit & Search",
      description: "Easily find and update your saved problems with powerful search and bulk editing capabilities.",
      delay: 600,
    }
  ];

  const [currentFeature, setCurrentFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Auto-play for mobile carousel
    let interval;
    if (isMobile && isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
      }, 4000);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [isMobile, isAutoPlaying, features.length]);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <section id="features" className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/50 dark:from-gray-900 dark:to-indigo-900/10 -z-10"></div>
      
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Everything You Need to Ace Technical Interviews
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          A comprehensive platform designed specifically for coding interview preparation
        </p>
      </div>
      
      {/* Mobile carousel */}
      {isMobile ? (
        <div className="relative max-w-md mx-auto px-4">
          <div 
            className="overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentFeature * 100}%)` }}>
              {features.map((feature, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className="h-full pb-4">
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      delay={feature.delay}
                      isActive={currentFeature === index}
                      isMobile={isMobile}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Only arrows + counter (no dots) */}
          <div className="flex justify-between items-center mt-6 px-2">
            <button 
              onClick={prevFeature} 
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous feature"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {currentFeature + 1} / {features.length}
            </span>
            <button 
              onClick={nextFeature} 
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next feature"
            >
              <RightIcon size={24} />
            </button>
          </div>
        </div>
      ) : (
        // Desktop grid view
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
              isActive={true}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturesSection;
