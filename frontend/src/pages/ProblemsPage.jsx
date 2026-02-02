import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProblems, deleteMultipleProblems, checkProblemsInTodaysRevision } from '../features/problems/problemSlice';
import ProblemItem from '../components/problems/ProblemItem';
import Spinner from '../components/common/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-hot-toast';
import { 
     Trash2, 
     AlertCircle, 
     Plus, 
     Search, 
     Filter, 
     BarChart3, 
     Download,
     Upload,
     RefreshCw,
     ChevronDown,
     ChevronUp,
     Table,
     Grid,
     ChevronLeft,
     ChevronRight,
     MoreHorizontal,
     Star,
     Calendar,
     Tag,
     Building,
     ExternalLink,
     Edit3,
     Archive,
     BookOpen,
     X,
     List
     } from 'lucide-react';

     // Delete Confirmation Modal Component
     const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, problemsInRevision }) => {
     if (!isOpen) return null;
     
     return (
     <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
               <AlertCircle className="h-6 w-6 text-red-500" />
               <h3 className="text-lg font-semibold">Cannot Delete Problems</h3>
          </div>
          
          <div className="mb-6">
               <p className="text-gray-600 dark:text-gray-300 mb-3">
               The following problems are scheduled for revision today and cannot be deleted:
               </p>
               <ul className="list-disc list-inside bg-red-50 dark:bg-red-900/20 p-4 rounded-lg max-h-40 overflow-y-auto">
               {problemsInRevision.map(problem => (
               <li key={problem._id} className="text-red-700 dark:text-red-300">
                    {problem.title} ({problem.difficulty})
               </li>
               ))}
               </ul>
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
               Please try deleting these problems tomorrow when they are no longer scheduled for revision.
               </p>
          </div>
          
          <div className="flex justify-end gap-3">
               <Button onClick={onClose} variant="secondary">
               Close
               </Button>
          </div>
          </div>
     </div>
     );
     };

     // Stats Card Component
     const StatsCard = ({ title, value, icon, color, onClick }) => (
     <div 
     onClick={onClick}
     className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${color} transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] cursor-pointer`}
     >
     <div className="flex justify-between items-center">
          <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-opacity-20 bg-gray-500">
          {icon}
          </div>
     </div>
     </div>
     );

     // Quick Action Button Component
     const QuickActionButton = ({ icon, label, onClick, variant = "default" }) => {
     const variants = {
     default: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700",
     primary: "bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700 dark:hover:bg-indigo-800",
     };
     
     return (
     <button
          onClick={onClick}
          className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all duration-200 hover:shadow-md ${variants[variant]}`}
     >
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 mb-2">
          {icon}
          </div>
          <span className="text-xs font-medium">{label}</span>
     </button>
     );
     };

     // Enhanced Table Header Component
     const TableHeader = ({ label, sortKey, sortConfig, onSort, className = "" }) => {
     const isSorted = sortConfig.key === sortKey;
     const isAscending = isSorted && sortConfig.direction === 'asc';
     
     return (
     <th 
          scope="col" 
          className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer group ${className}`}
          onClick={() => onSort(sortKey)}
     >
          <div className="flex items-center justify-between">
          <span>{label}</span>
          <div className="flex flex-col">
               <ChevronUp 
               size={14} 
               className={`transition-all ${isSorted && isAscending ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200'}`} 
               />
               <ChevronDown 
               size={14} 
               className={`transition-all -mt-2 ${isSorted && !isAscending ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200'}`} 
               />
          </div>
          </div>
     </th>
     );
     };

     const ProblemsPage = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { problems, isLoading, isError, message } = useSelector(state => state.problems);
     
     const [searchTerm, setSearchTerm] = useState('');
     const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
     const [difficultyFilter, setDifficultyFilter] = useState('All');
     const [statusFilter, setStatusFilter] = useState('All');
     const [selectedProblems, setSelectedProblems] = useState([]);
     const [showDeleteModal, setShowDeleteModal] = useState(false);
     const [problemsInRevision, setProblemsInRevision] = useState([]);
     const [showFilters, setShowFilters] = useState(false);
     const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
     const [viewMode, setViewMode] = useState('table');
     const [expandedProblem, setExpandedProblem] = useState(null);
     const [currentPage, setCurrentPage] = useState(1);
     const [problemsPerPage, setProblemsPerPage] = useState(10);
     const [showColumns, setShowColumns] = useState({
          title: true,
          difficulty: true,
          status: true,
          tags: true,
          companies: true,
          added: true,
          actions: true
     });

     // Calculate statistics
     const totalProblems = problems.length;
     const easyProblems = problems.filter(p => p.difficulty === 'Easy').length;
     const mediumProblems = problems.filter(p => p.difficulty === 'Medium').length;
     const hardProblems = problems.filter(p => p.difficulty === 'Hard').length;
     const masteredProblems = problems.filter(p => p.status === 'Mastered').length;
     const revisitingProblems = problems.filter(p => p.status === 'Revisiting').length;
     const pendingProblems = problems.filter(p => p.status === 'Pending').length;

     // Debounce search input
     useEffect(() => {
          const timerId = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
          return () => clearTimeout(timerId);
     }, [searchTerm]);

     // Fetch problems when filters change
     useEffect(() => {
          if (isError) console.log(message);
          dispatch(getProblems({ search: debouncedSearchTerm, difficulty: difficultyFilter, status: statusFilter }));
     }, [dispatch, isError, message, debouncedSearchTerm, difficultyFilter, statusFilter]);

     const handleEditProblem = (problemId) => {
          navigate(`/problem/${problemId}/edit`);
          };

     // Handle sorting
     const handleSort = (key) => {
          let direction = 'asc';
          if (sortConfig.key === key && sortConfig.direction === 'asc') {
               direction = 'desc';
          }
          setSortConfig({ key, direction });
     };

     // Sort problems based on sortConfig
     const sortedProblems = React.useMemo(() => {
          if (!problems.length) return [];
          
          const sorted = [...problems];
          sorted.sort((a, b) => {
               // Handle different data types for sorting
               if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
                    return sortConfig.direction === 'asc' 
                         ? a[sortConfig.key].localeCompare(b[sortConfig.key])
                         : b[sortConfig.key].localeCompare(a[sortConfig.key]);
               } else if (sortConfig.key === 'createdAt') {
                    return sortConfig.direction === 'asc' 
                         ? new Date(a.createdAt) - new Date(b.createdAt)
                         : new Date(b.createdAt) - new Date(a.createdAt);
               } else {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                         return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                         return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
               }
          });
          return sorted;
     }, [problems, sortConfig]);

     // Pagination logic
     const indexOfLastProblem = currentPage * problemsPerPage;
     const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
     const currentProblems = sortedProblems.slice(indexOfFirstProblem, indexOfLastProblem);
     const totalPages = Math.ceil(sortedProblems.length / problemsPerPage);

     const handleSelectProblem = (id) => {
          setSelectedProblems(prev => 
               prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
          );
     };

     const handleSelectAll = (e) => {
          if (e.target.checked) {
               setSelectedProblems(currentProblems.map(p => p._id));
          } else {
               setSelectedProblems([]);
          }
     };

     const handleDeleteSelected = async () => {
          // First check if any selected problems are in today's revision
          try {
               const result = await dispatch(checkProblemsInTodaysRevision(selectedProblems)).unwrap();
               
               if (result.problemsInRevision && result.problemsInRevision.length > 0) {
                    // Find the full problem objects for display
                    const revisionProblems = problems.filter(p => 
                         result.problemsInRevision.includes(p._id)
                    );
                    setProblemsInRevision(revisionProblems);
                    setShowDeleteModal(true);
                    return;
               }
               
               // If no problems in revision, proceed with deletion
               if (window.confirm(`Are you sure you want to delete ${selectedProblems.length} problems?`)) {
                    dispatch(deleteMultipleProblems(selectedProblems))
                         .unwrap()
                         .then(() => {
                         toast.success('Selected problems deleted.');
                         setSelectedProblems([]);
                         })
                         .catch(err => {
                         if (err.includes('scheduled for revision today')) {
                              // Extract problem titles from error message
                              const problemTitles = err.split(':')[1]?.split('.')[0] || '';
                              const revisionProblems = problems.filter(p => 
                                   problemTitles.includes(p.title)
                              );
                              setProblemsInRevision(revisionProblems);
                              setShowDeleteModal(true);
                         } else {
                              toast.error(err.message || 'Failed to delete problems.');
                         }
                         });
               }
          } catch (err) {
               toast.error(err.message || 'Failed to check problems.');
          }
     };
     
     const isAllSelected = currentProblems.length > 0 && selectedProblems.length === currentProblems.length;

     // Clear all filters
     const clearFilters = () => {
          setSearchTerm('');
          setDifficultyFilter('All');
          setStatusFilter('All');
          setCurrentPage(1);
          toast.success('Filters cleared');
     };

     // Refresh the problems list
     const refreshProblems = () => {
          dispatch(getProblems({ search: debouncedSearchTerm, difficulty: difficultyFilter, status: statusFilter }));
          setSelectedProblems([]);
          toast.success('Problems refreshed');
     };

     // Apply filter from stats card
     const applyFilter = (type, value) => {
          if (type === 'difficulty') {
               setDifficultyFilter(value);
          } else if (type === 'status') {
               setStatusFilter(value);
          }
          setCurrentPage(1);
          toast.success(`Filtered by ${value} ${type}`);
     };

     // Toggle problem expansion
     const toggleExpandProblem = (problemId) => {
          setExpandedProblem(expandedProblem === problemId ? null : problemId);
     };

     // Change page
     const paginate = (pageNumber) => setCurrentPage(pageNumber);

     // Change problems per page
     const handleProblemsPerPageChange = (e) => {
          setProblemsPerPage(parseInt(e.target.value));
          setCurrentPage(1);
     };

     // Column visibility toggle
     const toggleColumnVisibility = (column) => {
          setShowColumns(prev => ({
               ...prev,
               [column]: !prev[column]
          }));
     };


     return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
               <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                         <div>
                         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Problem Repository</h1>
                         <p className="text-gray-600 dark:text-gray-400 mt-1">
                              Manage your coding problems and track your progress
                         </p>
                         </div>
                         <Link to="/add-problem">
                         <Button variant="primary" className="flex items-center gap-2">
                              <Plus size={20} /> Add New Problem
                         </Button>
                         </Link>
                    </div>

                    {/* Quick Actions
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                         <QuickActionButton 
                         icon={<BookOpen size={18} />} 
                         label="Start Revision" 
                         onClick={() => toast.success('Revision session started')}
                         variant="primary"
                         />
                         <QuickActionButton 
                         icon={<Download size={18} />} 
                         label="Export Data" 
                         onClick={() => toast.success('Data exported successfully')}
                         />
                         <QuickActionButton 
                         icon={<Upload size={18} />} 
                         label="Import Data" 
                         onClick={() => toast.success('Data imported successfully')}
                         />
                         <QuickActionButton 
                         icon={<Archive size={18} />} 
                         label="Archive Mastered" 
                         onClick={() => toast.success('Mastered problems archived')}
                         />
                    </div> */}

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                         <StatsCard 
                         title="Total" 
                         value={totalProblems} 
                         icon={<BarChart3 size={20} className="text-blue-500" />}
                         color="border-l-blue-500"
                         onClick={() => clearFilters()}
                         />
                         <StatsCard 
                         title="Easy" 
                         value={easyProblems} 
                         icon={<div className="w-5 h-5 rounded-full bg-green-500"></div>}
                         color="border-l-green-500"
                         onClick={() => applyFilter('difficulty', 'Easy')}
                         />
                         <StatsCard 
                         title="Medium" 
                         value={mediumProblems} 
                         icon={<div className="w-5 h-5 rounded-full bg-yellow-500"></div>}
                         color="border-l-yellow-500"
                         onClick={() => applyFilter('difficulty', 'Medium')}
                         />
                         <StatsCard 
                         title="Hard" 
                         value={hardProblems} 
                         icon={<div className="w-5 h-5 rounded-full bg-red-500"></div>}
                         color="border-l-red-500"
                         onClick={() => applyFilter('difficulty', 'Hard')}
                         />
                         <StatsCard 
                         title="Mastered" 
                         value={masteredProblems} 
                         icon={<Star size={20} className="text-purple-500" />}
                         color="border-l-purple-500"
                         onClick={() => applyFilter('status', 'Mastered')}
                         />
                         <StatsCard 
                         title="Revisiting" 
                         value={revisitingProblems} 
                         icon={<RefreshCw size={20} className="text-yellow-500" />}
                         color="border-l-yellow-500"
                         onClick={() => applyFilter('status', 'Revisiting')}
                         />
                         <StatsCard 
                         title="Pending" 
                         value={pendingProblems} 
                         icon={<Calendar size={20} className="text-blue-500" />}
                         color="border-l-blue-500"
                         onClick={() => applyFilter('status', 'Pending')}
                         />
                    </div>

                    {/* Action Bar */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <div className="flex-1 relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                   <Search size={20} className="text-gray-400" />
                              </div>
                              <Input 
                                   type="text" 
                                   placeholder="Search problems by title, tags, or notes..." 
                                   value={searchTerm} 
                                   onChange={e => setSearchTerm(e.target.value)}
                                   className="pl-10 w-full"
                              />
                         </div>
                         
                         <div className="flex items-center gap-2">
                              <Button 
                                   variant="secondary" 
                                   onClick={() => setShowFilters(!showFilters)}
                                   className="flex items-center gap-2"
                                   active={showFilters}
                              >
                                   <Filter size={16} /> Filters
                                   {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </Button>
                              
                              <Button 
                                   variant="outline" 
                                   onClick={refreshProblems}
                                   className="flex items-center gap-2"
                                   title="Refresh problems"
                              >
                                   <RefreshCw size={16} />
                              </Button>
                              
                              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                                   <button 
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}
                                        title="Table view"
                                   >
                                        <List size={16} />
                                   </button>
                                   <button 
                                        onClick={() => setViewMode('card')}
                                        className={`p-2 ${viewMode === 'card' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}
                                        title="Card view"
                                   >
                                        <Grid size={16} />
                                   </button>
                              </div>

                              {/* Column visibility dropdown */}
                              <div className="relative group">
                                   <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <MoreHorizontal size={16} />
                                   </button>
                                   <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Show Columns</div>
                                        {Object.entries(showColumns).map(([key, visible]) => (
                                             <label key={key} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                             <input
                                                  type="checkbox"
                                                  checked={visible}
                                                  onChange={() => toggleColumnVisibility(key)}
                                                  className="rounded text-indigo-600 focus:ring-indigo-500"
                                             />
                                             <span className="ml-2 capitalize">{key}</span>
                                             </label>
                                        ))}
                                   </div>
                              </div>
                         </div>
                         </div>

                         {/* Expandable Filters */}
                         {showFilters && (
                         <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Difficulty
                                   </label>
                                   <select 
                                        value={difficultyFilter} 
                                        onChange={e => setDifficultyFilter(e.target.value)} 
                                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                   >
                                        <option value="All">All Difficulties</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                   </select>
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                   </label>
                                   <select 
                                        value={statusFilter} 
                                        onChange={e => setStatusFilter(e.target.value)} 
                                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                   >
                                        <option value="All">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Revisiting">Revisiting</option>
                                        <option value="Mastered">Mastered</option>
                                   </select>
                              </div>
                              <div className="flex items-end gap-2">
                                   <Button 
                                        onClick={clearFilters}
                                        variant="outline"
                                        className="flex-1"
                                   >
                                        Clear Filters
                                   </Button>
                                   <Button 
                                        onClick={() => setShowFilters(false)}
                                        variant="secondary"
                                   >
                                        <X size={16} />
                                   </Button>
                              </div>
                         </div>
                         )}
                    </div>

                    {/* Selection Actions */}
                    {selectedProblems.length > 0 && (
                         <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg mb-6 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                              <span className="font-semibold text-indigo-800 dark:text-indigo-200">
                                   {selectedProblems.length} problem{selectedProblems.length !== 1 ? 's' : ''} selected
                              </span>
                              <button 
                                   onClick={() => setSelectedProblems([])}
                                   className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                   Clear selection
                              </button>
                         </div>
                         <Button 
                              variant="danger" 
                              onClick={handleDeleteSelected} 
                              className="flex items-center gap-2"
                         >
                              <Trash2 size={16} /> Delete Selected
                         </Button>
                         </div>
                    )}

                    {/* Problems List */}
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                         <Spinner />
                         </div>
                    ) : problems.length > 0 ? (
                         viewMode === 'table' ? (
                         /* Enhanced Table View */
                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                              <div className="overflow-x-auto">
                                   <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                             <tr>
                                             <th scope="col" className="p-4 w-12">
                                                  <input 
                                                       type="checkbox" 
                                                       checked={isAllSelected} 
                                                       onChange={handleSelectAll} 
                                                       className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                                  />
                                             </th>
                                             {showColumns.title && (
                                                  <TableHeader 
                                                       label="Title" 
                                                       sortKey="title" 
                                                       sortConfig={sortConfig} 
                                                       onSort={handleSort} 
                                                  />
                                             )}
                                             {showColumns.difficulty && (
                                                  <TableHeader 
                                                       label="Difficulty" 
                                                       sortKey="difficulty" 
                                                       sortConfig={sortConfig} 
                                                       onSort={handleSort} 
                                                       className="text-center"
                                                  />
                                             )}
                                             {showColumns.status && (
                                                  <TableHeader 
                                                       label="Status" 
                                                       sortKey="status" 
                                                       sortConfig={sortConfig} 
                                                       onSort={handleSort} 
                                                       className="text-center"
                                                  />
                                             )}
                                             {showColumns.tags && (
                                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                       <div className="flex items-center gap-1">
                                                            <Tag size={14} /> Tags
                                                       </div>
                                                  </th>
                                             )}
                                             {showColumns.companies && (
                                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                       <div className="flex items-center gap-1">
                                                            <Building size={14} /> Companies
                                                       </div>
                                                  </th>
                                             )}
                                             {showColumns.added && (
                                                  <TableHeader 
                                                       label="Added On" 
                                                       sortKey="createdAt" 
                                                       sortConfig={sortConfig} 
                                                       onSort={handleSort} 
                                                  />
                                             )}
                                             {showColumns.actions && (
                                                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                       Actions
                                                  </th>
                                             )}
                                             </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                             {currentProblems.map((problem) => (
                                             <React.Fragment key={problem._id}>
                                                  <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                                       <td className="p-4 w-12">
                                                            <input
                                                                 type="checkbox"
                                                                 checked={selectedProblems.includes(problem._id)}
                                                                 onChange={() => handleSelectProblem(problem._id)}
                                                                 className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            />
                                                       </td>
                                                       {showColumns.title && (
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-xs">
                                                                 <div className="flex items-center gap-2">
                                                                 <a 
                                                                      href={problem.link} 
                                                                      target="_blank" 
                                                                      rel="noopener noreferrer" 
                                                                      className="hover:underline truncate"
                                                                      title={problem.title}
                                                                 >
                                                                      {problem.title}
                                                                 </a>
                                                                 <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
                                                                 </div>
                                                            </td>
                                                       )}
                                                       {showColumns.difficulty && (
                                                            <td className="px-4 py-3 text-center">
                                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                 problem.difficulty === 'Easy' 
                                                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                      : problem.difficulty === 'Medium'
                                                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                                 }`}>
                                                                 {problem.difficulty}
                                                                 </span>
                                                            </td>
                                                       )}
                                                       {showColumns.status && (
                                                            <td className="px-4 py-3 text-center">
                                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                 problem.status === 'Pending' 
                                                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                                      : problem.status === 'Mastered'
                                                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                                 }`}>
                                                                 {problem.status}
                                                                 </span>
                                                            </td>
                                                       )}
                                                       {showColumns.tags && (
                                                            <td className="px-4 py-3">
                                                                 {problem.tags && problem.tags.length > 0 ? (
                                                                 <div className="flex flex-wrap gap-1">
                                                                      {problem.tags.slice(0, 2).map(tag => (
                                                                           <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                                                {tag}
                                                                           </span>
                                                                      ))}
                                                                      {problem.tags.length > 2 && (
                                                                           <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                                                +{problem.tags.length - 2}
                                                                           </span>
                                                                      )}
                                                                 </div>
                                                                 ) : (
                                                                 <span className="text-xs text-gray-500 dark:text-gray-400">No tags</span>
                                                                 )}
                                                            </td>
                                                       )}
                                                       {showColumns.companies && (
                                                            <td className="px-4 py-3">
                                                                 {problem.companyTags && problem.companyTags.length > 0 ? (
                                                                 <div className="flex flex-wrap gap-1">
                                                                      {problem.companyTags.slice(0, 2).map(company => (
                                                                           <span key={company} className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                                                                                {company}
                                                                           </span>
                                                                      ))}
                                                                      {problem.companyTags.length > 2 && (
                                                                           <span className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                                                                                +{problem.companyTags.length - 2}
                                                                           </span>
                                                                      )}
                                                                 </div>
                                                                 ) : (
                                                                 <span className="text-xs text-gray-500 dark:text-gray-400">No companies</span>
                                                                 )}
                                                            </td>
                                                       )}
                                                       {showColumns.added && (
                                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                                 {new Date(problem.createdAt).toLocaleDateString()}
                                                            </td>
                                                       )}
                                                       {showColumns.actions && (
                                                            <td className="px-4 py-3 text-right">
                                                                 <div className="flex items-center justify-end gap-2">
                                                                 <button 
                                                                      onClick={() => handleEditProblem(problem._id)}
                                                                      className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                                                      title="Edit problem"
                                                                 >
                                                                      <Edit3 size={16} />
                                                                 </button>
                                                                 <button 
                                                                      onClick={() => {
                                                                           handleSelectProblem(problem._id);
                                                                           handleDeleteSelected();
                                                                      }} 
                                                                      className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
                                                                      title="Delete problem"
                                                                 >
                                                                      <Trash2 size={16} />
                                                                 </button>
                                                                 <button 
                                                                      onClick={() => toggleExpandProblem(problem._id)}
                                                                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                      title={expandedProblem === problem._id ? "Collapse details" : "Expand details"}
                                                                 >
                                                                      {expandedProblem === problem._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                 </button>
                                                                 </div>
                                                            </td>
                                                       )}
                                                  </tr>
                                                  {expandedProblem === problem._id && (
                                                       <tr className="bg-gray-50 dark:bg-gray-700/30">
                                                            <td colSpan={Object.values(showColumns).filter(v => v).length + 1} className="px-4 py-3">
                                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                 <div>
                                                                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                                                                      <div className="flex flex-wrap gap-2">
                                                                           {problem.tags && problem.tags.length > 0 ? (
                                                                                problem.tags.map(tag => (
                                                                                     <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                                                     {tag}
                                                                                     </span>
                                                                                ))
                                                                           ) : (
                                                                                <span className="text-xs text-gray-500 dark:text-gray-400">No tags</span>
                                                                           )}
                                                                      </div>
                                                                 </div>
                                                                 <div>
                                                                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Companies</h4>
                                                                      <div className="flex flex-wrap gap-2">
                                                                           {problem.companyTags && problem.companyTags.length > 0 ? (
                                                                                problem.companyTags.map(company => (
                                                                                     <span key={company} className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                                                                                     {company}
                                                                                     </span>
                                                                                ))
                                                                           ) : (
                                                                                <span className="text-xs text-gray-500 dark:text-gray-400">No companies</span>
                                                                           )}
                                                                      </div>
                                                                 </div>
                                                                 {problem.notes && (
                                                                      <div className="md:col-span-2">
                                                                           <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                                                                           <p className="text-sm text-gray-600 dark:text-gray-400">{problem.notes}</p>
                                                                      </div>
                                                                 )}
                                                                 </div>
                                                            </td>
                                                       </tr>
                                                  )}
                                             </React.Fragment>
                                             ))}
                                        </tbody>
                                   </table>
                              </div>

                              {/* Pagination */}
                              {totalPages > 1 && (
                                   <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                        <div className="flex-1 flex justify-between items-center sm:hidden">
                                             <button
                                             onClick={() => paginate(Math.max(1, currentPage - 1))}
                                             disabled={currentPage === 1}
                                             className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                             >
                                             Previous
                                             </button>
                                             <span className="text-sm text-gray-700 dark:text-gray-300">
                                             Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                                             </span>
                                             <button
                                             onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                             disabled={currentPage === totalPages}
                                             className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                             >
                                             Next
                                             </button>
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                             <div>
                                             <p className="text-sm text-gray-700 dark:text-gray-300">
                                                  Showing <span className="font-medium">{indexOfFirstProblem + 1}</span> to{' '}
                                                  <span className="font-medium">
                                                       {Math.min(indexOfLastProblem, sortedProblems.length)}
                                                  </span>{' '}
                                                  of <span className="font-medium">{sortedProblems.length}</span> results
                                             </p>
                                             </div>
                                             <div className="flex items-center gap-4">
                                             <div className="flex items-center">
                                                  <label htmlFor="problems-per-page" className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                                                       Rows per page:
                                                  </label>
                                                  <select
                                                       id="problems-per-page"
                                                       value={problemsPerPage}
                                                       onChange={handleProblemsPerPageChange}
                                                       className="border border-gray-300 rounded-md py-1 px-2 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
                                                  >
                                                       <option value="5">5</option>
                                                       <option value="10">10</option>
                                                       <option value="25">25</option>
                                                       <option value="50">50</option>
                                                  </select>
                                             </div>
                                             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                  <button
                                                       onClick={() => paginate(Math.max(1, currentPage - 1))}
                                                       disabled={currentPage === 1}
                                                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                  >
                                                       <span className="sr-only">Previous</span>
                                                       <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                                  </button>
                                                  {/* Page numbers */}
                                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                       <button
                                                            key={page}
                                                            onClick={() => paginate(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                 currentPage === page
                                                                 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-300'
                                                                 : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                                                            }`}
                                                       >
                                                            {page}
                                                       </button>
                                                  ))}
                                                  <button
                                                       onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                                       disabled={currentPage === totalPages}
                                                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                  >
                                                       <span className="sr-only">Next</span>
                                                       <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                                  </button>
                                             </nav>
                                             </div>
                                        </div>
                                   </div>
                              )}
                         </div>
                         ) : (
                         /* Card View */
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {currentProblems.map(problem => (
                                   <div key={problem._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
                                        <div className="flex justify-between items-start mb-3">
                                             <div className="flex items-center gap-2">
                                             <input
                                                  type="checkbox"
                                                  checked={selectedProblems.includes(problem._id)}
                                                  onChange={() => handleSelectProblem(problem._id)}
                                                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                             />
                                             <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={problem.title}>
                                                  {problem.title}
                                             </h3>
                                             </div>
                                             <a 
                                             href={problem.link} 
                                             target="_blank" 
                                             rel="noopener noreferrer"
                                             className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                             title="Open problem link"
                                             >
                                             <ExternalLink size={16} />
                                             </a>
                                        </div>
                                        
                                        <div className="flex gap-2 mb-3">
                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                             problem.difficulty === 'Easy' 
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                  : problem.difficulty === 'Medium'
                                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                             }`}>
                                             {problem.difficulty}
                                             </span>
                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                             problem.status === 'Pending' 
                                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                  : problem.status === 'Mastered'
                                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                             }`}>
                                             {problem.status}
                                             </span>
                                        </div>
                                        
                                        {problem.tags && problem.tags.length > 0 && (
                                             <div className="mb-3">
                                             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tags</p>
                                             <div className="flex flex-wrap gap-1">
                                                  {problem.tags.slice(0, 3).map(tag => (
                                                       <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                            {tag}
                                                       </span>
                                                  ))}
                                                  {problem.tags.length > 3 && (
                                                       <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                            +{problem.tags.length - 3}
                                                       </span>
                                                  )}
                                             </div>
                                             </div>
                                        )}
                                        
                                        {problem.companyTags && problem.companyTags.length > 0 && (
                                             <div className="mb-3">
                                             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Companies</p>
                                             <div className="flex flex-wrap gap-1">
                                                  {problem.companyTags.slice(0, 2).map(company => (
                                                       <span key={company} className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                                                            {company}
                                                       </span>
                                                  ))}
                                                  {problem.companyTags.length > 2 && (
                                                       <span className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded">
                                                            +{problem.companyTags.length - 2}
                                                       </span>
                                                  )}
                                             </div>
                                             </div>
                                        )}
                                        
                                        {problem.notes && (
                                             <div className="mb-3">
                                             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                             <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{problem.notes}</p>
                                             </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                             <span className="text-xs text-gray-500 dark:text-gray-400">
                                             Added {new Date(problem.createdAt).toLocaleDateString()}
                                             </span>
                                             <div className="flex gap-2">
                                             <button 
                                                  onClick={() => handleEditProblem(problem._id)}
                                                  className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                                  title="Edit problem"
                                             >
                                                  <Edit3 size={16} />
                                             </button>
                                             <button 
                                                  onClick={() => {
                                                       handleSelectProblem(problem._id);
                                                       handleDeleteSelected();
                                                  }} 
                                                  className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
                                                  title="Delete problem"
                                             >
                                                  <Trash2 size={16} />
                                             </button>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                         )
                    ) : (
                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                         <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                              <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                         </div>
                         <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No problems found</h3>
                         <p className="mt-2 text-gray-500 dark:text-gray-400">
                              {debouncedSearchTerm || difficultyFilter !== 'All' || statusFilter !== 'All' 
                                   ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                   : 'Get started by adding your first coding problem.'
                              }
                         </p>
                         <div className="mt-6">
                              <Link to="/add-problem">
                                   <Button variant="primary" className="flex items-center gap-2 mx-auto">
                                        <Plus size={20} /> Add New Problem
                                   </Button>
                              </Link>
                         </div>
                         </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    <DeleteConfirmationModal 
                         isOpen={showDeleteModal}
                         onClose={() => setShowDeleteModal(false)}
                         onConfirm={() => {
                         setShowDeleteModal(false);
                         setSelectedProblems([]);
                         }}
                         problemsInRevision={problemsInRevision}
                    />
               </div>
          </div>
     );
};

export default ProblemsPage;