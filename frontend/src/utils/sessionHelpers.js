export const shouldProblemBeInSession = (problem, settings, currentSession) => {
     if (!problem || !settings) return false;
     
     // Check if problem is already in session
     if (currentSession && currentSession.problems) {
     const isAlreadyInSession = currentSession.problems.some(
          p => p.problem._id.toString() === problem._id.toString()
     );
     if (isAlreadyInSession) return false;
     }
     
     // Check if problem is archived or mastered
     if (problem.isArchived || problem.status === 'Mastered') return false;
     
     // Check if problem is due for revision
     const now = new Date();
     if (problem.nextRevisionDate && new Date(problem.nextRevisionDate) > now) {
     return false;
     }
     
     // Check difficulty distribution needs
     const { difficultyDistribution } = settings;
     const { easy, medium, hard } = difficultyDistribution;
     
     if (currentSession) {
     const currentCounts = {
          Easy: currentSession.problems.filter(p => p.problem.difficulty === 'Easy').length,
          Medium: currentSession.problems.filter(p => p.problem.difficulty === 'Medium').length,
          Hard: currentSession.problems.filter(p => p.problem.difficulty === 'Hard').length
     };
     
     // Check if we need more problems of this difficulty
     if (problem.difficulty === 'Easy' && currentCounts.Easy >= easy) return false;
     if (problem.difficulty === 'Medium' && currentCounts.Medium >= medium) return false;
     if (problem.difficulty === 'Hard' && currentCounts.Hard >= hard) return false;
     }
     
     // Check revision mode filters
     const { revisionMode, customRevisionTopics, customRevisionCompanies } = settings;
     
     if (revisionMode === 'TOPIC' && customRevisionTopics?.length) {
     if (!problem.tags.some(tag => customRevisionTopics.includes(tag))) return false;
     } else if (revisionMode === 'COMPANY' && customRevisionCompanies?.length) {
     if (!problem.companyTags.some(tag => customRevisionCompanies.includes(tag))) return false;
     } else if (revisionMode === 'COMBO') {
     if (customRevisionTopics?.length && !problem.tags.some(tag => customRevisionTopics.includes(tag))) return false;
     if (customRevisionCompanies?.length && !problem.companyTags.some(tag => customRevisionCompanies.includes(tag))) return false;
     }
     
     return true;
};