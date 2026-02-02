import axios from 'axios';

const API_URL = '/api/problems';

const createProblem = async (problemData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  
  try {
    const response = await axios.post(API_URL, problemData, config);
    return response.data;
  } catch (error) {
    // FALLBACK: Save to local queue if server is unreachable
    const localQueue = JSON.parse(localStorage.getItem('pending_problems')) || [];
    localQueue.push({ ...problemData, tempId: Date.now() });
    localStorage.setItem('pending_problems', JSON.stringify(localQueue));
    
    // Return a temporary object so the UI updates
    return { ...problemData, _id: 'temp_' + Date.now(), status: 'Pending Sync' };
  }
};

const getProblems = async (token, filters = {}) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {}
  };
  if (filters.search) config.params.search = filters.search;
  if (filters.difficulty && filters.difficulty !== 'All') config.params.difficulty = filters.difficulty;
  if (filters.status && filters.status !== 'All') config.params.status = filters.status;
  const response = await axios.get(API_URL, config);
  return response.data;
};

const getProblem = async (problemId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + "/" + problemId, config);
    return response.data;
};

const updateProblem = async (problemId, problemData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + '/' + problemId, problemData, config);
    return response.data;
};

const deleteProblem = async (problemId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(API_URL + problemId, config);
  return response.data;
};

const deleteMultipleProblems = async (ids, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    data: { ids } 
  };
  const response = await axios.delete(API_URL, config);
  return response.data;
};

const checkProblemsInTodaysRevision = async (problemIds, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  
  const response = await axios.post('/api/revision/check-todays-problems', 
    { problemIds }, 
    config
  );
  
  return response.data;
};

const checkProblemInTodaysRevision = async (problemId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  
  const response = await axios.post('/api/revision/check-todays-problems', 
    { problemIds: [problemId] }, 
    config
  );
  
  return response.data;
};

const checkDuplicateProblem = async (title, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}check-duplicate/${encodeURIComponent(title)}`, config);
  return response.data;
};

const problemService = {
  createProblem, getProblems, getProblem, updateProblem, deleteProblem, deleteMultipleProblems, checkProblemsInTodaysRevision, checkDuplicateProblem, checkProblemInTodaysRevision,
};
export default problemService;


