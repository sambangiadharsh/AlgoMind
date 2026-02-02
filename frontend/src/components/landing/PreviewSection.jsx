import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import your images
import dashboard1 from '../../assets/img/screenshots/dashboard-1.png';
import dashboard2 from '../../assets/img/screenshots/dashboard-2.png';
import dashboard3 from '../../assets/img/screenshots/dashboard-3.png';
import dashboard4 from '../../assets/img/screenshots/dashboard-4.png';
import problems1 from '../../assets/img/screenshots/problems-1.png';
import problems2 from '../../assets/img/screenshots/problems-2.png';
import problems3 from '../../assets/img/screenshots/problems-3.png';
import problems4 from '../../assets/img/screenshots/problems-4.png';
import problems5 from '../../assets/img/screenshots/problems-5.png';
import problems6 from '../../assets/img/screenshots/problems-6.png';
import problems7 from '../../assets/img/screenshots/problems-7.png';
import revision1 from '../../assets/img/screenshots/revision-1.png';
import revision2 from '../../assets/img/screenshots/revision-2.png';
import revision3 from '../../assets/img/screenshots/revision-3.png';
import revision4 from '../../assets/img/screenshots/revision-4.png';
import revision5 from '../../assets/img/screenshots/revision-5.png';
import revision6 from '../../assets/img/screenshots/revision-6.png';
import setting1 from '../../assets/img/screenshots/setting-1.png';
import setting2 from '../../assets/img/screenshots/setting-2.png';
import setting3 from '../../assets/img/screenshots/setting-3.png';
import setting4 from '../../assets/img/screenshots/setting-4.png';
import setting5 from '../../assets/img/screenshots/setting-5.png';
import setting6 from '../../assets/img/screenshots/setting-6.png';
import setting7 from '../../assets/img/screenshots/setting-7.png';
import analytics1 from '../../assets/img/screenshots/analytics-1.png';
import analytics2 from '../../assets/img/screenshots/analytics-2.png';

const PreviewSection = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      desc: "Overview of your progress and upcoming revisions",
      images: [dashboard1, dashboard2, dashboard3, dashboard4]
    },
    { 
      id: 'problems', 
      label: 'Problem Library', 
      desc: "Browse and manage your saved coding problems",
      images: [problems1, problems2, problems3, problems4, problems5, problems6, problems7]
    },
    { 
      id: 'revision', 
      label: 'Revision Session', 
      desc: "Practice problems with our spaced repetition system",
      images: [revision1, revision2, revision3, revision4, revision5, revision6]
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      desc: "Customize the settings how you want to Practice.",
      images: [setting1, setting2, setting3, setting4, setting5, setting6, setting7]
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      desc: "Track your performance and identify areas for improvement",
      images: [analytics1, analytics2]
    }
  ];

  const currentTabData = tabs.find(tab => tab.id === activeTab);
  const currentImages = currentTabData?.images || [];
  const currentImage = currentImages[currentImageIndex] || dashboard1; // Fallback to dashboard1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentImageIndex(0);
  };

  return (
    <section className="py-12 md:py-16 px-4 bg-white dark:bg-gray-900">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Explore AlgoMind's Features</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 md:mt-4 max-w-2xl mx-auto">
          See how our platform helps you master coding interview preparation
        </p>
      </div>
      
      {/* Tab selector */}
      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab description */}
      <div className="text-center mb-6 max-w-2xl mx-auto">
        <p className="text-gray-600 dark:text-gray-400">
          {currentTabData?.desc}
        </p>
      </div>
      
      {/* Preview container with carousel */}
      <div className="max-w-5xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-950 px-4 py-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500"></div>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">app.algoMind.com/{activeTab}</div>
            <div className="w-16"></div>
          </div>
          
          {/* Preview content with carousel */}
          <div className="relative p-2 bg-gray-50 dark:bg-gray-800">
            {/* Navigation arrows */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {/* Image */}
            <img 
              src={currentImage} 
              alt={`${activeTab} preview ${currentImageIndex + 1}`}
              className="w-full h-auto rounded-lg shadow-md"
            />
            
            {/* Image indicators */}
            {currentImages.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {currentImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === index 
                        ? 'bg-indigo-500 w-4' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-indigo-400'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Feature highlights */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
          <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">Custom Revision Settings</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tailor revision frequency and focus areas based on your needs</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
          <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">Company & Topic Filters</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Practice problems by specific companies or technical topics</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
          <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">Detailed Analytics</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Track your progress with comprehensive performance metrics</p>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;