export const formatDate = (dateString) => {
     if (!dateString) return 'Unknown date';
     try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', { 
               year: 'numeric', 
               month: 'short', 
               day: 'numeric' 
          });
     } catch (error) {
          return 'Invalid date';
     }
};

// Helper function to get status priority info
export const getStatusInfo = (status) => {
     if (!status) {
          return { text: 'Unknown', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' };
     }
     
     switch (status) {
          case 'Pending':
               return { text: 'New problem', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' };
          case 'Revisiting':
               return { text: 'Needs revision', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
          case 'Mastered':
               return { text: 'Well known', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
          default:
               return { text: status, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' };
     }
};

// Additional helper functions you might need
export const getDifficultyColor = (difficulty) => {
     if (!difficulty) return 'text-gray-500 dark:text-gray-400';
     
     switch (difficulty.toLowerCase()) {
          case 'easy':
               return 'text-green-600 dark:text-green-400';
          case 'medium':
               return 'text-yellow-600 dark:text-yellow-400';
          case 'hard':
               return 'text-red-600 dark:text-red-400';
          default:
               return 'text-gray-500 dark:text-gray-400';
     }
};

export const getDifficultyBgColor = (difficulty) => {
     if (!difficulty) return 'bg-gray-100 dark:bg-gray-700';
     
     switch (difficulty.toLowerCase()) {
          case 'easy':
               return 'bg-green-100 dark:bg-green-900/30';
          case 'medium':
               return 'bg-yellow-100 dark:bg-yellow-900/30';
          case 'hard':
               return 'bg-red-100 dark:bg-red-900/30';
          default:
               return 'bg-gray-100 dark:bg-gray-700';
     }
};