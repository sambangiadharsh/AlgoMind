import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/revision`;

// Get today's revision list
const getTodaysRevision = async (token) => {
     const config = {
     headers: {
          Authorization: `Bearer ${token}`,
     },
     };
     const response = await axios.get(API_URL + '/today', config);
     return response.data;
};

// Mark a problem as reviewed
const markProblemAsReviewed = async (problemId, reviewData, token) => {
     const config = {
     headers: {
          Authorization: `Bearer ${token}`,
     },
     };
     const response = await axios.post(API_URL + `/review/${problemId}`, reviewData, config);
     return response.data;
};

const revisionService = {
     getTodaysRevision,
     markProblemAsReviewed,
};

export default revisionService;