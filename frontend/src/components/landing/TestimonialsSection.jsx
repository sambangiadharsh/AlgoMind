import React, { useState, useEffect } from 'react';
import { Users, Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialCard = ({ name, role, text, delay, isActive }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transform transition-all duration-500 h-full flex flex-col ${
        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0 absolute'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center mr-4 flex-shrink-0">
          <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">{role}</p>
          <div className="flex text-yellow-400 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
        </div>
      </div>
      <div className="relative flex-grow">
        <Quote className="absolute -top-2 -left-1 text-indigo-200 dark:text-indigo-900/40" size={24} />
        <p className="text-gray-600 dark:text-gray-400 text-sm pl-4">"{text}"</p>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah ",
      role: "Software Engineer ",
      text: "AlgoMind helped me stay consistent with my interview preparation. The spaced repetition system made sure I never forgot important patterns. I landed my dream job at Google!",
      delay: 100
    },
    {
      name: "Karan",
      role: "Frontend Developer",
      text: "The spaced repetition system is genius. I've never retained coding patterns this well before. It's like having a personal coach that knows exactly when you need to review.",
      delay: 200
    },
    {
      name: "Neha",
      role: "Computer Science Student",
      text: "The progress tracking motivated me to keep going. My problem-solving speed has doubled since I started using AlgoMind. The analytics helped me identify my weak areas.",
      delay: 300
    },
    {
      name: "Jessica",
      role: "Data Scientist",
      text: "Being able to organize problems by company and topic was a game-changer for my Amazon interview preparation. I could focus exactly on what I needed to practice.",
      delay: 400
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Auto-rotation for testimonials
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000); // Rotate every 5 seconds
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">What Our Users Say</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Join thousands of developers who have improved their coding skills with AlgoMind
        </p>
      </div>
      
      {/* Mobile carousel */}
      {isMobile ? (
        <div className="relative max-w-md mx-auto">
          <div 
            className="overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="h-full pb-4">
                    <TestimonialCard
                      name={testimonial.name}
                      role={testimonial.role}
                      text={testimonial.text}
                      delay={testimonial.delay}
                      isActive={currentTestimonial === index}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation arrows only */}
          <div className="flex justify-between items-center mt-6 px-2">
            <button 
              onClick={prevTestimonial} 
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mobile-tap-highlight"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {currentTestimonial + 1} / {testimonials.length}
            </span>
            <button 
              onClick={nextTestimonial} 
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mobile-tap-highlight"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      ) : (
        // Desktop grid view
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              text={testimonial.text}
              delay={testimonial.delay}
              isActive={true}
            />
          ))}
        </div>
      )}
      
      
    </section>
  );
};

export default TestimonialsSection;
