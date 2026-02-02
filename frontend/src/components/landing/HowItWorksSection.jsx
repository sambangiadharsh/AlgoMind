import React, { useState, useEffect } from 'react';
import { Clipboard, Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

const StepCard = ({ number, title, description, icon, delay, isActive, onClick, isMobile }) => {
  return (
    <div 
      className={`flex flex-col items-center text-center p-6 rounded-2xl shadow-md border-2 transition-all duration-300 transform h-full ${
        isActive && !isMobile
          ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-500 scale-105 shadow-lg' 
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:scale-105'
      } ${isMobile ? 'w-full flex-shrink-0 mx-2' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 transition-colors ${
        isActive && !isMobile
          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' 
          : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
      }`}>
        {number}
      </div>
      <div className="mb-4 text-indigo-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">{description}</p>
    </div>
  );
};

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Auto-rotation for steps
    let interval;
    if (isMobile && isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % steps.length);
      }, 4000);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [isMobile, isAutoPlaying]);

  const steps = [
    {
      number: "1",
      title: "Add a Problem",
      description: "Paste a link from LeetCode, GFG, or any coding platform and fill out all the details about the problem.",
      icon: <Clipboard size={24} />,
      delay: 100
    },
    {
      number: "2",
      title: "Revise Daily",
      description: "Get personalized revision sessions based on spaced repetition algorithms for optimal learning.",
      icon: <Calendar size={24} />,
      delay: 200
    },
    {
      number: "3",
      title: "Track Progress",
      description: "Monitor your streaks, solved counts, and performance analytics to see your growth over time.",
      icon: <TrendingUp size={24} />,
      delay: 300
    }
  ];

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-gray-900 dark:to-indigo-900/20 rounded-3xl px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">How AlgoMind Works</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Master coding problems in just three simple steps - designed for maximum learning efficiency
        </p>
      </div>
      
      {/* Mobile carousel */}
      {isMobile ? (
        <div className="relative max-w-md mx-auto">
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeStep * 100}%)` }}>
              {steps.map((step, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <StepCard
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                    delay={step.delay}
                    isActive={activeStep === index}
                    onClick={() => setActiveStep(index)}
                    isMobile={isMobile}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation arrows only */}
          <div className="flex justify-between items-center mt-6 px-2">
            <button 
              onClick={prevStep} 
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mobile-tap-highlight"
              aria-label="Previous step"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {activeStep + 1} / {steps.length}
            </span>
            <button 
              onClick={nextStep} 
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mobile-tap-highlight"
              aria-label="Next step"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      ) : (
        // Desktop grid view
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              delay={step.delay}
              isActive={activeStep === index}
              onClick={() => setActiveStep(index)}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HowItWorksSection;
