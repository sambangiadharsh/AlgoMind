import axios from 'axios';

const API_URL = '/api/stats';

export const getStats = async (token) => {
     const config = { headers: { Authorization: `Bearer ${token}` } };
     const response = await axios.get(API_URL, config);
     return response.data;
};

export const getRevisionStreak = async (token) => {
     const config = { headers: { Authorization: `Bearer ${token}` } };
     const response = await axios.get(API_URL + '/streak', config);
     return response.data;
};


const statsService = {
     getStats,
     getRevisionStreak,
};

export default statsService;
