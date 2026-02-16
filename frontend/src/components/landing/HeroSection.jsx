import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Sparkles, Code, Cpu, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  const [counters, setCounters] = useState({ problems: 0, revisions: 0, streak: 0 });
  const [typedText, setTypedText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const phrases = [
    "Master coding interviews",
    "Never forget a solution",
    "Build consistent habits",
    "Ace technical interviews"
  ];

  const benefits = [
    "Spaced repetition algorithm",
    "Track progress visually",
    "Organize by topic & company",
    "Customizable revision settings"
  ];



useEffect(() => {
  // Animate counters
  const counterInterval = setInterval(() => {
    setCounters(prev => {
      const newProblems = prev.problems < 500 ? prev.problems + 5 : 500;
      const newRevisions = prev.revisions < 100 ? prev.revisions + 2 : 100;
      const newStreak = prev.streak < 100 ? prev.streak + 2 : 100;

      if (newProblems === 500 && newRevisions === 100 && newStreak === 100) {
        clearInterval(counterInterval);
      }

      return {
        problems: newProblems,
        revisions: newRevisions,
        streak: newStreak
      };
    });
  }, 30); // speed of animation

  // Typewriter effect
  let currentIndex = 0;
  const typewriterInterval = setInterval(() => {
    if (currentIndex < phrases[currentPhrase].length) {
      setTypedText(phrases[currentPhrase].substring(0, currentIndex + 1));
      currentIndex++;
    } else {
      setIsTypingComplete(true);
      setTimeout(() => {
        setIsTypingComplete(false);
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        setTypedText('');
        currentIndex = 0;
      }, 2000);
    }
  }, 100);

  return () => {
    clearInterval(counterInterval);
    clearInterval(typewriterInterval);
  };
}, [currentPhrase]);

  return (
    <section className="relative text-center py-12 md:py-20 bg-white dark:bg-gray-900 overflow-hidden min-h-screen flex items-center">
      {/* Background elements */}
      <div className="absolute top-10 left-5 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-5 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
      
      <div className="relative max-w-6xl mx-auto px-4" style={{ zIndex: 2 }}>
        <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full mb-6 shadow-md">
          <Sparkles className="text-yellow-300 mr-2" size={16} />
          <span className="text-sm font-medium">Join 10,000+ developers</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl leading-tight">
          Never Forget a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 relative">
            Coding Problem
          </span> Again
        </h1>
        
        <div className="h-16 mt-4 md:mt-6">
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium">
            AlgoMind helps you <span className="text-indigo-600 dark:text-indigo-400 font-bold">{typedText}</span>
            <span className={`inline-block w-1 h-6 bg-indigo-600 dark:bg-indigo-400 align-middle ml-1 ${isTypingComplete ? 'opacity-0' : 'animate-pulse'}`}></span>
          </p>
        </div>

        <div className="space-x-6">
       
      </div>

        {/* Benefits list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mt-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-8 md:mt-10 flex justify-center gap-4 flex-col sm:flex-row">
          <Link to="/register" className="w-full sm:w-auto">
            {/* <Button variant="primary" className="w-full sm:w-auto !text-base md:!text-lg !px-6 md:!px-8 !py-3 md:!py-4 group">
              Get Started for Free
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button> */}
            <Button
               variant="primary"
               className="w-full sm:w-auto text-base md:text-lg px-5 md:px-7 py-3 md:py-4 group flex items-center justify-center"
               >
               <span>Get Started for Free</span>
               <ArrowRight
               size={18}
               className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
               strokeWidth={2.2}
               />
            </Button>
          </Link>
        </div>
        
        {/* Stats Counter */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {[
            { value: counters.problems, label: 'Problems Logged', id: 'problems-counter', icon: <Code size={20} /> },
            { value: counters.revisions, label: 'Revisions Completed', id: 'revisions-counter', icon: <Cpu size={20} /> },
            { value: counters.streak, label: 'Days Streak', id: 'streak-counter', icon: <Zap size={20} /> }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex justify-center mb-2 text-indigo-600 dark:text-indigo-400">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-indigo-700 dark:text-indigo-300" id={stat.id}>
                {stat.value.toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-2 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* Trusted by section */}
        {/* <div className="mt-12 md:mt-16">
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm md:text-base">Trusted by developers at</p>
          <div className="flex justify-center items-center gap-6 md:gap-8 flex-wrap">
            {['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix'].map((company, index) => (
              <div key={index} className="font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                {company}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;