import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getProblem, updateProblem, reset, checkProblemInTodaysRevision } from '../features/problems/problemSlice';
import { updateSessionFromProblem } from '../features/revision/revisionSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Link as LinkIcon, Type, Tag, Notebook, Briefcase, AlertCircle, Sparkles, Zap, Crown, Hash, Save, Plus } from 'lucide-react';

const AutocompleteInput = ({ initialSuggestions, placeholder, Icon, onTagsChange, disabled = false, initialTags = [] }) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState(initialTags);
    const [suggestions, setSuggestions] = useState(initialSuggestions);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [isInputFocused, setInputFocused] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const suggestionRefs = useRef([]);

    // Add this useEffect to update tags when initialTags changes
    useEffect(() => {
        setTags(initialTags);
    }, [initialTags]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setFilteredSuggestions([]);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            const lowerValue = value.toLowerCase();
            const matched = suggestions.filter(
                s => s.toLowerCase().includes(lowerValue) && !tags.includes(s)
            );
            setFilteredSuggestions(matched);
            setHighlightedIndex(-1);
        } else {
            setFilteredSuggestions([]);
            setHighlightedIndex(-1);
        }
    };

    const addTag = (tag) => {
        const newTag = tag.trim();
        if (!newTag || tags.includes(newTag)) {
            setInputValue('');
            setFilteredSuggestions([]);
            return;
        }

        const newTags = [...tags, newTag];
        setTags(newTags);
        onTagsChange(newTags);
        setInputValue('');
        setFilteredSuggestions([]);
        setHighlightedIndex(-1);

        if (!suggestions.includes(newTag)) {
            setSuggestions(prev => [...prev, newTag].sort());
        }
    };

    const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        onTagsChange(newTags);
    };

    const handleKeyDown = (e) => {
        if (disabled) return;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev < filteredSuggestions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev > 0 ? prev - 1 : filteredSuggestions.length - 1
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
                addTag(filteredSuggestions[highlightedIndex]);
            } else {
                addTag(inputValue);
            }
        } else if (e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            e.preventDefault();
            removeTag(tags[tags.length - 1]);
        }
    };

    // Auto-scroll highlighted suggestion into view
    useEffect(() => {
        if (highlightedIndex >= 0 && suggestionRefs.current[highlightedIndex]) {
            suggestionRefs.current[highlightedIndex].scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        }
    }, [highlightedIndex]);

    return (
        <div className="relative" ref={wrapperRef}>
            <div className={`relative flex flex-wrap items-center gap-2 p-3 border rounded-lg transition-all duration-200 ${isInputFocused ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <Icon className="h-5 w-5 text-gray-400 ml-1 flex-shrink-0" />
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 text-sm font-medium px-2.5 py-1.5 rounded-full transition-all duration-200 hover:bg-indigo-200 dark:hover:bg-indigo-800/60">
                        {tag}
                        {!disabled && (
                            <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                                <XCircle size={14} />
                            </button>
                        )}
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => !disabled && setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder={placeholder}
                    className="flex-grow bg-transparent outline-none p-1 min-w-[100px] placeholder-gray-400 dark:placeholder-gray-500"
                    disabled={disabled}
                />
            </div>
            {(filteredSuggestions.length > 0 || inputValue.trim()) && !disabled && (
                <ul className="absolute z-10 w-full mt-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            ref={el => suggestionRefs.current[index] = el}
                            onClick={() => addTag(suggestion)}
                            className={`px-4 py-2.5 cursor-pointer transition-colors duration-150 ${index === highlightedIndex ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                        >
                            {suggestion}
                        </li>
                    ))}
                    {inputValue.trim() && !suggestions.includes(inputValue.trim()) && (
                        <li
                            onClick={() => addTag(inputValue.trim())}
                            className="px-4 py-2.5 cursor-pointer text-indigo-600 font-medium hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 flex items-center gap-2"
                        >
                            <Plus size={14} />
                            Add "{inputValue.trim()}"
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

// --- Reusable Difficulty Button Component ---
const DifficultyButton = ({ value, selected, onClick, children, disabled = false }) => {
    const getDifficultyIcon = () => {
        switch(value) {
            case 'Easy': return <Sparkles size={18} className="text-green-500" />;
            case 'Medium': return <Zap size={18} className="text-yellow-500" />;
            case 'Hard': return <Crown size={18} className="text-red-500" />;
            default: return <Hash size={18} className="text-gray-400" />;
        }
    };

    const baseClasses = "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group";
    const selectedClasses = "bg-indigo-50 border-indigo-500 shadow-md dark:bg-indigo-900/20";
    const unselectedClasses = "bg-white border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 hover:shadow-sm";
    const disabledClasses = "opacity-60 cursor-not-allowed";

    return (
        <button 
            type="button" 
            onClick={() => !disabled && onClick(value)} 
            className={`${baseClasses} ${selected ? selectedClasses : unselectedClasses} ${disabled ? disabledClasses : ''}`}
            disabled={disabled}
        >
            <div className="flex items-center gap-3">
                {getDifficultyIcon()}
                <p className="font-semibold text-gray-800 dark:text-gray-200">{children}</p>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${selected ? 'bg-indigo-500 scale-110' : 'bg-gray-200 dark:bg-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-500'}`}>
                {selected && <CheckCircle2 size={14} className="text-white" />}
            </div>
        </button>
    );
};

// Edit Warning Modal Component
const EditWarningModal = ({ isOpen, onClose, problem }) => {
    if (!isOpen) return null;
    
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Cannot Edit Problem</h3>
                </div>
                
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                        This problem is scheduled for revision today and cannot be edited:
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800/30">
                        <p className="text-red-700 dark:text-red-300 font-medium">
                            {problem.title} ({problem.difficulty})
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Please try editing this problem tomorrow when it is no longer scheduled for revision.
                    </p>
                </div>
                
                <div className="flex justify-end">
                    <Button 
                        onClick={onClose}
                        variant="primary"
                        className="min-w-[80px]"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- Constants ---
const VALID_URL_REGEX = /^(https?:\/\/)?(www\.)?(leetcode\.com|geeksforgeeks\.org|hackerrank\.com|codingninjas\.com|interviewbit\.com|codeforces\.com|atcoder\.jp|codechef\.com|topcoder\.com|spoj\.com|cses\.fi)\/.+/;
const TAG_SUGGESTIONS = [
    "Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting", "Greedy", "Depth-First Search", 
    "Binary Search", "Breadth-First Search", "Tree", "Matrix", "Two Pointers", "Bit Manipulation", "Stack", 
    "Heap (Priority Queue)", "Graph", "Backtracking", "Linked List", "Trie", "Recursion", "Sliding Window", 
    "Union Find", "Design", "Segment Tree", "Queue", "Simulation", "Counting", "Prefix Sum", "Divide and Conquer", 
    "Monotonic Stack", "Geometry", "Topological Sort", "Binary Indexed Tree", "Minimax", "Memoization", 
    "Combinatorics", "Game Theory", "Hashing", "Number Theory", "Randomized", "Shell", "Database", "Concurrency", 
    "Bitmask", "Order Statistics", "Probability and Statistics"
];
const COMPANY_SUGGESTIONS = [
    "Google", "Amazon", "Microsoft", "Facebook", "Apple", "Netflix", "Adobe", "Uber", "Bloomberg", "Goldman Sachs", 
    "ByteDance", "Oracle", "Atlassian", "Twitter", "Salesforce", "Walmart", "Morgan Stanley", "LinkedIn", "Flipkart", 
    "Paypal", "SAP", "Yandex", "Expedia", "Infosys", "Wipro", "TCS", "Cisco", "Qualcomm", "Intuit", "Paytm", "VMware", 
    "Zomato", "Swiggy", "ServiceNow", "JPMorgan Chase", "American Express", "DE Shaw", "Nvidia", "Tesla", "Samsung", "Dell"
];

const EditProblemPage = () => {
     const { id } = useParams();
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { problem, isLoading, isError, message } = useSelector(state => state.problems);
     
     const [formData, setFormData] = useState({
          title: '', link: '', difficulty: 'Medium', notes: '', tags: [], companyTags: [],
     });
          const [isLinkValid, setIsLinkValid] = useState(false);
          const [linkTouched, setLinkTouched] = useState(false);
          const [showEditWarning, setShowEditWarning] = useState(false);
          const [isCheckingRevision, setIsCheckingRevision] = useState(false);
          const [apiErrors, setApiErrors] = useState({});
          const [isSubmitting, setIsSubmitting] = useState(false);
          const [tags, setTags] = useState([]);
          const [companyTags, setCompanyTags] = useState([]);



     // Use useCallback to memoize the function and prevent unnecessary re-renders
     const fetchProblem = useCallback(() => {
          if (isError) toast.error(message);
          dispatch(getProblem(id));
     }, [dispatch, id, isError, message]);

     useEffect(() => {
          fetchProblem();
          return () => dispatch(reset());
     }, [fetchProblem, dispatch]);

     // Use useCallback to memoize the updateFormData function
          const updateFormData = useCallback(() => {
               if (problem) {
                    setFormData({
                         title: problem.title || '',
                         link: problem.link || '',
                         difficulty: problem.difficulty || 'Medium',
                         notes: problem.notes || '',
                         tags: problem.tags || [],
                         companyTags: problem.companyTags || [],
                    });
                    setIsLinkValid(VALID_URL_REGEX.test(problem.link || ''));
                    setLinkTouched(true);

                    setTags(problem.tags || []);
                    setCompanyTags(problem.companyTags || []);               
               }
          }, [problem]);

     useEffect(() => {
          updateFormData();
     }, [updateFormData]);

     // Reset API errors when form data changes
     useEffect(() => {
          setApiErrors({});
     }, [formData.title, formData.link, formData.difficulty]);

     const handleLinkChange = (e) => {
          const newLink = e.target.value;
          setFormData(prev => ({ ...prev, link: newLink }));
          setIsLinkValid(VALID_URL_REGEX.test(newLink));
          setLinkTouched(true);
          
          // Clear link validation error
          if (apiErrors.link) {
               setApiErrors(prev => ({ ...prev, link: '' }));
          }
     };
     

     const onSubmit = async (e) => {
     e.preventDefault();

     // Clear previous errors
     setApiErrors({});

     setIsCheckingRevision(true);
     setIsSubmitting(true);

     try {
     // Step 1: Check if this problem is already in today's revision
     const result = await dispatch(checkProblemInTodaysRevision(id)).unwrap();

     if (result.problemsInRevision && result.problemsInRevision.length > 0) {
          setShowEditWarning(true);
          setIsCheckingRevision(false);
          setIsSubmitting(false);
          return;
     }

     // Step 2: Update problem
     const updateResult = await dispatch(
          updateProblem({ id, problemData: formData })
     ).unwrap();

     // Step 3: Handle session refresh if backend sends it
     if (updateResult.session) {
          dispatch(updateSessionFromProblem(updateResult));
          toast.success(updateResult.message || "Problem updated and included in today's revision!");
     } else {
          toast.success('Problem updated successfully!');
     }

     navigate('/problems');
     } catch (err) {
     console.error('Error updating problem:', err);

     // Error handling
     if (err.includes && (err.includes('network') || err.includes('Failed to fetch'))) {
          setApiErrors({ submit: 'Network error. Please check your connection.' });
          toast.error('Network error. Please check your connection.');
     } else if (err.includes && (err.includes('401') || err.includes('unauthorized'))) {
          setApiErrors({ submit: 'Authentication failed. Please login again.' });
          toast.error('Session expired. Please login again.');
     } else if (err.includes && err.includes('500')) {
          setApiErrors({ submit: 'Server error. Please try again later.' });
          toast.error('Server error. Please try again later.');
     } else if (err.includes && err.includes('scheduled for revision today')) {
          setShowEditWarning(true);
     } else {
          setApiErrors({ submit: err.message || 'Failed to update problem.' });
          toast.error(err.message || 'Failed to update problem.');
     }
     } finally {
     setIsCheckingRevision(false);
     setIsSubmitting(false);
     }
     };

     const isFormValid = formData.title && linkTouched && isLinkValid;

     if (isLoading || !problem) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <Spinner size="lg" />
               </div>
          );
     }

     return (
          <div className="max-w-6xl mx-auto px-4 py-8">
               <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Edit Problem</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Refine the details of your challenge</p>
               </div>
               
               {/* Display API errors at the top */}
               {apiErrors.submit && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                         <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                         <AlertCircle size={18} />
                         <p className="font-medium">{apiErrors.submit}</p>
                         </div>
                    </div>
               )}

               <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-6">
                         <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Type className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                         </div>
                         <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Problem Details</h2>
                         </div>

                         <fieldset>
                         <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Title <span className="text-red-500">*</span>
                         </label>
                         <div className="relative">
                              <Input 
                                   type="text" 
                                   name="title" 
                                   id="title" 
                                   value={formData.title}
                                   onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                                   required 
                                   className="pl-10 h-12"
                                   disabled={isSubmitting}
                              />
                              <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                         </div>
                         {apiErrors.title && (
                              <p className="text-xs text-red-500 mt-2 flex items-center">
                                   <AlertCircle size={12} className="mr-1" />
                                   {apiErrors.title}
                              </p>
                         )}
                         </fieldset>

                         <fieldset>
                         <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Problem Link <span className="text-red-500">*</span>
                         </label>
                         <div className="relative flex items-center">
                              <LinkIcon className="absolute left-3 h-5 w-5 text-gray-400 z-10" />
                              <Input
                                   type="url"
                                   name="link"
                                   id="link"
                                   value={formData.link}
                                   onChange={handleLinkChange}
                                   required
                                   className={`pl-10 pr-10 h-12 ${isLinkValid ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-red-500 focus:ring-red-500 focus:border-red-500'}`}
                                   disabled={isSubmitting}
                              />
                              {isLinkValid ? (
                                   <CheckCircle2 className="absolute right-3 h-5 w-5 text-green-500" />
                              ) : (
                                   <XCircle className="absolute right-3 h-5 w-5 text-red-500" />
                              )}
                         </div>
                         {!isLinkValid && (
                              <p className="text-xs text-red-500 mt-2 flex items-center">
                                   <AlertCircle size={12} className="mr-1" />
                                   Please provide a valid URL from LeetCode, GFG, etc.
                              </p>
                         )}
                         {apiErrors.link && (
                              <p className="text-xs text-red-500 mt-2 flex items-center">
                                   <AlertCircle size={12} className="mr-1" />
                                   {apiErrors.link}
                              </p>
                         )}
                         </fieldset>

                         <fieldset>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                         <AutocompleteInput 
                              initialSuggestions={TAG_SUGGESTIONS} 
                              placeholder="Type and press Enter to add tags" 
                              Icon={Tag} 
                              onTagsChange={tags => setFormData(p => ({...p, tags}))} 
                              initialTags={tags}
                              disabled={isSubmitting}
                         />
                         {apiErrors.tags && (
                              <p className="text-xs text-red-500 mt-2 flex items-center">
                                   <AlertCircle size={12} className="mr-1" />
                                   {apiErrors.tags}
                              </p>
                         )}
                         </fieldset>
                         
                         <fieldset>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Tags</label>
                         <AutocompleteInput 
                              initialSuggestions={COMPANY_SUGGESTIONS} 
                              placeholder="Type and press Enter to add companies" 
                              Icon={Briefcase} 
                              onTagsChange={companyTags => setFormData(p => ({...p, companyTags}))} 
                              initialTags={companyTags}
                              disabled={isSubmitting}
                         />
                         {apiErrors.companyTags && (
                              <p className="text-xs text-red-500 mt-2 flex items-center">
                                   <AlertCircle size={12} className="mr-1" />
                                   {apiErrors.companyTags}
                              </p>
                         )}
                         </fieldset>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                         <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                         <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                   <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                   Difficulty <span className="text-red-500">*</span>
                              </h2>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <DifficultyButton 
                                   value="Easy" 
                                   selected={formData.difficulty === 'Easy'} 
                                   onClick={(val) => setFormData(p => ({...p, difficulty: val}))}
                                   disabled={isSubmitting}
                              >
                                   Easy
                              </DifficultyButton>
                              <DifficultyButton 
                                   value="Medium" 
                                   selected={formData.difficulty === 'Medium'} 
                                   onClick={(val) => setFormData(p => ({...p, difficulty: val}))}
                                   disabled={isSubmitting}
                              >
                                   Medium
                              </DifficultyButton>
                              <DifficultyButton 
                                   value="Hard" 
                                   selected={formData.difficulty === 'Hard'} 
                                   onClick={(val) => setFormData(p => ({...p, difficulty: val}))}
                                   disabled={isSubmitting}
                              >
                                   Hard
                              </DifficultyButton>
                         </div>
                         {apiErrors.difficulty && (
                              <p className="text-xs text-red-500 mt-2 flex items-center">
                                   <AlertCircle size={12} className="mr-1" />
                                   {apiErrors.difficulty}
                              </p>
                         )}
                         </div>
                         
                         <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                         <div className="flex items-center gap-3 mb-6">
                              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                   <Notebook className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Notes & Solution</h2>
                         </div>
                         <fieldset>
                              <div className="relative">
                                   <textarea 
                                        name="notes" 
                                        id="notes"
                                        placeholder="Your notes and solution approach..."
                                        value={formData.notes}
                                        onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                                        className="w-full min-h-[200px] p-4 border border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
                                        disabled={isSubmitting}
                                   ></textarea>
                              </div>
                         </fieldset>
                         {apiErrors.notes && (
                              <p className="text-xs text-red-500 mt-2 flex items-center">
                                   <AlertCircle size={12} className="mr-1" />
                                   {apiErrors.notes}
                              </p>
                         )}
                         </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="lg:col-span-2 flex justify-center mt-4">
                         <Button 
                         type="submit" 
                         variant="primary" 
                         className="w-full max-w-md !py-4 !text-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                         disabled={isLoading || !isFormValid || isSubmitting}
                         >
                         {isCheckingRevision ? (
                              <>
                                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                   Checking...
                              </>
                         ) : isSubmitting ? (
                              <>
                                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                   Saving Changes...
                              </>
                         ) : (
                              <>
                                   <Save size={20} />
                                   Save Changes
                              </>
                         )}
                         </Button>
                    </div>
               </form>

               <EditWarningModal 
                    isOpen={showEditWarning}
                    onClose={() => setShowEditWarning(false)}
                    problem={problem}
               />
          </div>
     );
};

export default EditProblemPage;