import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStats, reset } from '../features/stats/statsSlice';
import { getRevisionStreak } from '../services/statsService';
import Spinner from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import {
  Target, CheckCircle, Clock, BarChart, BookOpen, PlusCircle,
  Flame, Calendar, Trophy, TrendingUp, RefreshCw, Zap,
  Award, ChevronRight, Star, TrendingUp as TrendingUpIcon, Brain
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Bar, ComposedChart, XAxis, YAxis, CartesianGrid } from 'recharts';

const StatCard = ({ icon, title, value, subtitle, color, onClick, loading }) => {
     const colorClasses = {
     blue: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700/50',
     green: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700/50',
     yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/50',
     orange: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700/50',
     purple: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700/50',
     };

     return (
     <div
          className={`relative border rounded-2xl p-5 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group overflow-hidden ${colorClasses[color]}`}
          onClick={onClick}
     >
          {/* Animated background element */}
          <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${colorClasses[color].split(' ')[0]}`}></div>
          
          <div className={`p-3 rounded-xl bg-white dark:bg-gray-800/50 shadow-sm group-hover:scale-110 transition-transform z-10`}>
          {icon}
          </div>
          <div className="z-10">
          <p className="text-sm font-medium opacity-80">{title}</p>
          {loading ? (
               <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
          ) : (
               <p className="text-2xl font-bold mt-1">{value}</p>
          )}
          {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
          </div>
     </div>
     );
};

const StreakCalendar = ({ streakData }) => {
     const [currentMonth, setCurrentMonth] = useState(new Date());
     const navigate = useNavigate();

     const year = currentMonth.getFullYear();
     const month = currentMonth.getMonth();
     const firstDayOfMonth = new Date(year, month, 1);
     const lastDayOfMonth = new Date(year, month + 1, 0);

     const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => new Date(year, month, i + 1));

     const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
     const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

     const today = new Date();
     const todayStr = today.toLocaleDateString('en-CA');

     return (
     <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white">
               <Calendar size={20} className="mr-2 text-indigo-500" />
               {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </h3>
          <div className="flex space-x-1">
               <button 
               onClick={handlePrevMonth} 
               className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
               >
               <ChevronRight size={16} className="rotate-180" />
               </button>
               <button 
               onClick={handleNextMonth} 
               className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
               >
               <ChevronRight size={16} />
               </button>
          </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-500 dark:text-gray-400 mb-3 text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
               <div key={`${d}-${i}`} className="py-1">{d}</div>
          ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
          {Array(firstDayOfMonth.getDay()).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {daysInMonth.map((date, index) => {
               const dateStr = date.toLocaleDateString('en-CA');
               const hasRevision = streakData?.completedDates?.includes(dateStr);
               const isSessionDay = streakData?.allSessionDates?.includes(dateStr);
               const isToday = todayStr === dateStr;
               const isMissed = isSessionDay && !hasRevision && date < today;

               return (
               <div key={index} className="text-center relative">
               <button
                    onClick={() => { if (isToday) navigate('/revision'); }}
                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200
                    ${hasRevision ? "bg-green-500 text-white shadow-md" :
                         isToday ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-indigo-400" :
                         isSessionDay ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" :
                         "text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
               >
                    {date.getDate()}
               </button>
               {isMissed && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
               )}
               </div>
               );
          })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
               <div className="flex items-center">
               <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
               <span className="text-gray-600 dark:text-gray-400">Completed revision</span>
               </div>
               <div className="flex items-center">
               <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/40 rounded mr-2"></div>
               <span className="text-gray-600 dark:text-gray-400">Scheduled</span>
               </div>
          </div>
          <div className="flex items-center mt-2">
               <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
               <span className="text-gray-600 dark:text-gray-400">Missed session</span>
          </div>
          </div>
     </div>
     );
};

const CustomTooltip = ({ active, payload, label }) => {
     if (active && payload && payload.length) {
     const data = payload[0].payload;
     return (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-xl">
          <p className="font-bold text-gray-900 dark:text-white">{data.name}</p>
          <p className="mt-1" style={{color: data.color}}>
               {`Count: ${payload[0].value}`}
          </p>
          </div>
     );
     }
     return null;
};

const DashboardPage = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { userInfo } = useSelector((state) => state.auth);
     const { stats, isLoading, isError, message } = useSelector((state) => state.stats);
     const [streakData, setStreakData] = useState(null);
     const [isLoadingStreak, setIsLoadingStreak] = useState(true);
     const [refreshing, setRefreshing] = useState(false);

     // 1. Fetch data only when a real token exists
    useEffect(() => {
        if (userInfo && userInfo.token && !userInfo.isLocalOnly) {
            dispatch(getStats());
            fetchStreakData();
        }
        return () => { dispatch(reset()); };
    }, [dispatch, userInfo]);

    // 2. BACKGROUND PROBLEM SYNC: Push local questions to MongoDB
    useEffect(() => {
        const pending = JSON.parse(localStorage.getItem('pending_problems')) || [];
        if (pending.length > 0 && userInfo?.token && !userInfo.isLocalOnly) {
            pending.forEach(problem => {
                dispatch(createProblem(problem));
            });
            localStorage.removeItem('pending_problems');
            toast.success('Your local data has been backed up to the cloud!');
        }
    }, [userInfo, dispatch]);

    // 3. UI: Only show loading for a max of 5 seconds
    const [loadingWait, setLoadingWait] = useState(userInfo?.isLocalOnly);
    useEffect(() => {
        const timer = setTimeout(() => setLoadingWait(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (loadingWait && userInfo?.isLocalOnly) {
        return <div className="flex justify-center p-20"><Spinner size="xl" /></div>;
    }


     useEffect(() => {
     // ONLY fetch if we have a real user with a token from the server
     if (userInfo && userInfo.token && !userInfo.isLocalOnly) {
          dispatch(getStats());
          fetchStreakData();
     }
     
     return () => { 
          dispatch(reset()); 
     };
     // Add userInfo to the dependency array so it refetches 
     // automatically once the background sync finishes
     }, [dispatch, userInfo]);

     // 2. ADD the sync logic here
     useEffect(() => {
          const pending = JSON.parse(localStorage.getItem('pending_problems')) || [];
          
          // Only sync if there is data to sync and the user is fully authenticated on the server
          if (pending.length > 0 && userInfo?.token && !userInfo.isLocalOnly) {
               pending.forEach(problem => {
                    dispatch(createProblem(problem));
               });
               localStorage.removeItem('pending_problems');
               toast.success('Your local work has been synced to the cloud!');
               
               // Optional: Refresh stats after syncing new problems
               dispatch(getStats());
          }
     }, [userInfo, dispatch]);

     // const fetchStreakData = async () => {
     // try {
     //      setIsLoadingStreak(true);
     //      const token = userInfo.token;
     //      const data = await getRevisionStreak(token);
     //      setStreakData(data);
     // } catch (error) {
     //      console.error('Error fetching streak data:', error);
     // } finally {
     //      setIsLoadingStreak(false);
     // }
     // };

     const fetchStreakData = async () => {
    // Safety check: if no token, don't even try to call the API
    if (!userInfo?.token || userInfo?.isLocalOnly) return;

    try {
        setIsLoadingStreak(true);
        const token = userInfo.token;
        const data = await getRevisionStreak(token);
        setStreakData(data);
    } catch (error) {
        console.error('Error fetching streak data:', error);
    } finally {
        setIsLoadingStreak(false);
    }
};

     const refreshData = async () => {
     setRefreshing(true);
     await dispatch(getStats());
     await fetchStreakData();
     setTimeout(() => setRefreshing(false), 800);
     };

     if (userInfo?.isLocalOnly) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Spinner />
            <p className="mt-4 text-gray-500">Connecting your account to the cloud...</p>
        </div>
    );
}

     if (isLoading || !stats || isLoadingStreak) {
     return (
          <div className="flex justify-center items-center h-96">
          <div className="text-center">
               <Spinner size="lg" />
               <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your learning dashboard...</p>
          </div>
          </div>
     );
     }

     if (isError) {
     return (
          <div className="flex justify-center items-center h-96">
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl max-w-md">
               <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
               <Zap size={32} className="text-red-500" />
               </div>
               <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Oops! Something went wrong</h3>
               <p className="text-red-600 dark:text-red-400 mb-4">Error: {message}</p>
               <Button onClick={refreshData} variant="primary">
               Try Again
               </Button>
          </div>
          </div>
     );
     }

     const completionRate = stats.totalProblems > 0 ? Math.round((stats.byStatus.mastered / stats.totalProblems) * 100) : 0;
     const revisitingRate = stats.totalProblems > 0 ? Math.round((stats.byStatus.revisiting / stats.totalProblems) * 100) : 0;

     const difficultyData = [
     { name: 'Easy', value: stats.byDifficulty.easy, color: '#4ade80' },
     { name: 'Medium', value: stats.byDifficulty.medium, color: '#facc15' },
     { name: 'Hard', value: stats.byDifficulty.hard, color: '#f87171' }
     ];
     
     const statusData = [
     { name: 'Mastered', value: stats.byStatus.mastered, color: '#4ade80' },
     { name: 'Revisiting', value: stats.byStatus.revisiting, color: '#facc15' },
     { name: 'Pending', value: stats.byStatus.pending, color: '#60a5fa' }
     ];

     return (
     <div className="space-y-8 pb-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
               <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
               Welcome back, {userInfo.name}!
               </h1>
               <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
               {streakData && streakData.currentStreak > 0 
               ? `You're on a ${streakData.currentStreak}-day streak! Keep up the amazing work! 🔥` 
               : "Every expert was once a beginner. Start your learning journey today!"}
               </p>
          </div>
          <Button 
               onClick={refreshData} 
               variant="secondary" 
               className="flex items-center gap-2 self-start sm:self-auto"
               disabled={refreshing}
          >
               <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
               {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
               icon={<Target size={24} className="text-blue-500" />} 
               title="Total Problems" 
               value={stats.totalProblems} 
               color="blue" 
               onClick={() => navigate('/problems')} 
               loading={isLoading}
          />
          <StatCard 
               icon={<CheckCircle size={24} className="text-green-500" />} 
               title="Mastered" 
               value={stats.byStatus.mastered} 
               subtitle={`${completionRate}% completion`} 
               color="green" 
               loading={isLoading}
          />
          <StatCard 
               icon={<Clock size={24} className="text-yellow-500" />} 
               title="Revisiting" 
               value={stats.byStatus.revisiting} 
               subtitle={`${revisitingRate}% of total`} 
               color="yellow" 
               loading={isLoading}
          />
          <StatCard 
               icon={<Flame size={24} className="text-orange-500" />} 
               title="Current Streak" 
               value={streakData ? `${streakData.currentStreak} days` : '0 days'} 
               subtitle={streakData ? `Longest: ${streakData.longestStreak} days` : 'Start your streak!'} 
               color="orange" 
               onClick={() => navigate('/revision')} 
               loading={isLoadingStreak}
          />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar and Actions */}
          <div className="lg:col-span-1 space-y-6">
               <StreakCalendar streakData={streakData} />
               
               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 p-6 rounded-2xl">
               <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white mb-4">
               <Zap size={20} className="mr-2 text-indigo-500" />
               Quick Actions
               </h3>
               <div className="grid grid-cols-1 gap-3">
               <Link to="/revision">
                    <Button variant="primary" className="w-full flex items-center justify-between gap-2 py-3 px-4">
                    <div className="flex items-center">
                         <BookOpen size={18} className="mr-2" />
                         Start Revision Session
                    </div>
                    <ChevronRight size={16} />
                    </Button>
               </Link>
               <Link to="/add-problem">
                    <Button variant="secondary" className="w-full flex items-center justify-between gap-2 py-3 px-4">
                    <div className="flex items-center">
                         <PlusCircle size={18} className="mr-2" />
                         Add New Problem
                    </div>
                    <ChevronRight size={16} />
                    </Button>
               </Link>
               <Link to="/problems">
                    <Button variant="secondary" className="w-full flex items-center justify-between gap-2 py-3 px-4">
                    <div className="flex items-center">
                         <Brain size={18} className="mr-2" />
                         View All Problems
                    </div>
                    <ChevronRight size={16} />
                    </Button>
               </Link>
               </div>
               </div>
               
               {/* Progress Summary */}
               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl">
               <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white mb-4">
               <TrendingUpIcon size={20} className="mr-2 text-green-500" />
               Learning Progress
               </h3>
               <div className="space-y-4">
               <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Mastery Progress</span>
                    <span>{completionRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                         className="h-full bg-green-500 rounded-full transition-all duration-700" 
                         style={{ width: `${completionRate}%` }}
                    ></div>
                    </div>
               </div>
               <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Revision Needed</span>
                    <span>{revisitingRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                         className="h-full bg-yellow-500 rounded-full transition-all duration-700" 
                         style={{ width: `${revisitingRate}%` }}
                    ></div>
                    </div>
               </div>
               </div>
               </div>
          </div>
          
          {/* Right Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
               {/* Difficulty Distribution Chart */}
               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl">
               <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white">
                    <BarChart size={20} className="mr-2 text-indigo-500" />
                    Difficulty Distribution
               </h3>
               <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center mr-3">
                    <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                    <span>Easy</span>
                    </div>
                    <div className="flex items-center mr-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
                    <span>Medium</span>
                    </div>
                    <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                    <span>Hard</span>
                    </div>
               </div>
               </div>
               <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie 
                         data={difficultyData} 
                         dataKey="value" 
                         nameKey="name" 
                         cx="50%" 
                         cy="50%" 
                         outerRadius={80} 
                         innerRadius={60}
                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                         labelLine={false}
                    >
                         {difficultyData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} />
                         ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    </PieChart>
               </ResponsiveContainer>
               </div>
               </div>
               
               {/* Problem Status Chart */}
               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl">
               <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white mb-6">
               <TrendingUp size={20} className="mr-2 text-indigo-500" />
               Problem Status Breakdown
               </h3>
               <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={document.documentElement.classList.contains('dark') ? '#6b7280' : '#9ca3af'} interval={0} angle={-30} textAnchor="end" />
                    <YAxis stroke={document.documentElement.classList.contains('dark') ? '#6b7280' : '#9ca3af'} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" barSize={40} radius={[4, 4, 0, 0]}>
                         {statusData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                    </Bar>
                    </ComposedChart>
               </ResponsiveContainer>
               </div>
               </div>
          </div>
          </div>
     </div>
     );
};

export default DashboardPage;