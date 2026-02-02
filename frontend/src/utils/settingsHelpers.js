export const getCurrentSettings = (settings) => {
     const safeSettings = settings && Object.keys(settings).length > 0 ? settings : {};

     return {
     mode: safeSettings.revisionMode || 'RANDOM',
     difficulty: safeSettings.difficultyDistribution || { easy: 2, medium: 2, hard: 1 },
     topics: Array.isArray(safeSettings.customRevisionTopics) ? safeSettings.customRevisionTopics : [],
     companies: Array.isArray(safeSettings.customRevisionCompanies) ? safeSettings.customRevisionCompanies : [],
     };
};

