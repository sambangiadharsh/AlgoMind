import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProblem, checkDuplicateProblem, deleteProblem } from '../features/problems/problemSlice';
import { updateSessionFromProblem } from '../features/revision/revisionSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Link as LinkIcon, Type, Tag, Notebook, Briefcase, AlertCircle, Clock, Plus, Sparkles, Zap, Crown, Hash } from 'lucide-react';

// --- Reusable Autocomplete Input Component ---
const AutocompleteInput = ({ initialSuggestions, placeholder, Icon, onTagsChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState([]);
    const [suggestions, setSuggestions] = useState(initialSuggestions);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [isInputFocused, setInputFocused] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const suggestionRefs = useRef([]);

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
            <div className={`relative flex flex-wrap items-center gap-2 p-3 border rounded-lg transition-all duration-200 ${isInputFocused ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                <Icon className="h-5 w-5 text-gray-400 ml-1 flex-shrink-0" />
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 text-sm font-medium px-2.5 py-1.5 rounded-full transition-all duration-200 hover:bg-indigo-200 dark:hover:bg-indigo-800/60">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                            <XCircle size={14} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder={placeholder}
                    className="flex-grow bg-transparent outline-none p-1 min-w-[100px] placeholder-gray-400 dark:placeholder-gray-500"
                />
            </div>
            {(filteredSuggestions.length > 0 || inputValue.trim()) && (
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
const DifficultyButton = ({ value, selected, onClick, children }) => {
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
    const unselectedClasses = "bg-white border-gray-200 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 hover:shadow-sm";

    return (
        <button 
            type="button" 
            onClick={() => onClick(value)} 
            className={`${baseClasses} ${selected ? selectedClasses : unselectedClasses}`}
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

// --- Modal Components ---
const DuplicateProblemModal = ({ isOpen, onClose, onConfirm, duplicateProblem, replacing }) => {
    if (!isOpen) return null;
    
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Duplicate Problem</h3>
                </div>
                
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                        A problem with the same title already exists:
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/30">
                        <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                            {duplicateProblem.title} ({duplicateProblem.difficulty})
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                            Added on: {new Date(duplicateProblem.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            Status: {duplicateProblem.status}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        {duplicateProblem.status === 'Mastered' 
                            ? 'This is a mastered problem. It will be automatically replaced.'
                            : 'This problem is not mastered. Would you like to replace it?'
                        }
                    </p>
                </div>
                
                <div className="flex justify-end gap-3">
                    <Button 
                        onClick={onClose}
                        variant="outline"
                        disabled={replacing}
                        className="min-w-[80px]"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={onConfirm}
                        variant="primary"
                        disabled={replacing}
                        className="min-w-[80px]"
                    >
                        {replacing ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Replacing...
                            </div>
                        ) : 'Replace'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const RevisionProblemModal = ({ isOpen, onClose, duplicateProblem }) => {
    if (!isOpen) return null;
    
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Problem in Today's Revision</h3>
                </div>
                
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                        A problem with the same name is scheduled for today's revision:
                    </p>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800/30">
                        <p className="text-orange-700 dark:text-orange-300 font-medium">
                            {duplicateProblem.title} ({duplicateProblem.difficulty})
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                            Added on: {new Date(duplicateProblem.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                            Status: {duplicateProblem.status}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        You cannot add a problem with the same name as a problem that is in today's revision session.
                        Please choose a different title or try again tomorrow.
                    </p>
                </div>
                
                <div className="flex justify-end">
                    <Button 
                        onClick={onClose}
                        variant="primary"
                        className="min-w-[80px]"
                    >
                        OK
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

// --- Main AddProblemPage Component ---
const AddProblemPage = () => {
     const [formData, setFormData] = useState({
          title: '', link: '', difficulty: '', notes: '', tags: [], companyTags: [],
     });
     const [isLinkValid, setIsLinkValid] = useState(null);
     const [linkTouched, setLinkTouched] = useState(false);
     const [showDuplicateModal, setShowDuplicateModal] = useState(false);
     const [showRevisionModal, setShowRevisionModal] = useState(false);
     const [checkingDuplicate, setCheckingDuplicate] = useState(false);
     const [checkingRevision, setCheckingRevision] = useState(false);
     const [duplicateProblem, setDuplicateProblem] = useState(null);
     const [replacing, setReplacing] = useState(false);
     const [problemInRevision, setProblemInRevision] = useState(false);

     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { isLoading } = useSelector(state => state.problems);
     const { userInfo } = useSelector(state => state.auth);

     const handleLinkChange = (e) => {
          const newLink = e.target.value;
          setFormData(prev => ({ ...prev, link: newLink }));
          if (!linkTouched) setLinkTouched(true);
          setIsLinkValid(VALID_URL_REGEX.test(newLink));
     };

     // Check for duplicates when title changes
     useEffect(() => {
          const checkForDuplicate = async () => {
               if (formData.title.trim() && formData.title.length > 2 && userInfo?.token) {
                    setCheckingDuplicate(true);
                    try {
                         const response = await fetch(`/api/problems/check-duplicate/${encodeURIComponent(formData.title)}`, {
                         headers: {
                              'Authorization': `Bearer ${userInfo.token}`
                         }
                         });
                         
                         if (response.ok) {
                         const result = await response.json();
                         setDuplicateProblem(result);
                         } else {
                         setDuplicateProblem(null);
                         }
                    } catch (error) {
                         console.error('Error checking duplicate:', error);
                         setDuplicateProblem(null);
                    } finally {
                         setCheckingDuplicate(false);
                    }
               } else {
                    setDuplicateProblem(null);
               }
          };
          
          const timeoutId = setTimeout(checkForDuplicate, 500);
          return () => clearTimeout(timeoutId);
     }, [formData.title, userInfo]);

     const isFormValid = formData.title.trim() && isLinkValid && formData.difficulty;

     const checkIfProblemInRevision = async (problemId) => {
          if (!problemId || !userInfo?.token) return false;
          
          setCheckingRevision(true);
          try {
               const response = await problemService.checkProblemInTodaysRevision(problemId, userInfo.token);
               return response.problemsInRevision && response.problemsInRevision.length > 0;
          } catch (error) {
               console.error('Error checking revision:', error);
               return false;
          } finally {
               setCheckingRevision(false);
          }
     };

     const handleReplaceProblem = async () => {
          if (!duplicateProblem) return;
          
          setReplacing(true);
          try {
               // First delete the existing problem
               await dispatch(deleteProblem(duplicateProblem._id)).unwrap();
               
               // Then create the new problem
               await dispatch(createProblem(formData)).unwrap();
               
               toast.success('Problem replaced successfully!');
               navigate('/problems');
          } catch (error) {
               toast.error(error.message || 'Failed to replace problem.');
          } finally {
               setReplacing(false);
               setShowDuplicateModal(false);
          }
     };

     // const onSubmit = async (e) => {
     //      e.preventDefault();
     //      if (!isFormValid) {
     //           toast.error('Please fill in all required fields correctly.');
     //           return;
     //      }

     //      setCheckingRevision(true);
     //      try {
     //           // First check if a problem with this title exists and is in today's revision
     //           const revisionResponse = await fetch(`/api/problems/check-in-todays-revision/${encodeURIComponent(formData.title)}`, {
     //                headers: {
     //                     'Authorization': `Bearer ${userInfo.token}`
     //                }
     //           });
               
     //           if (revisionResponse.ok) {
     //                const revisionResult = await revisionResponse.json();
                    
     //                if (revisionResult.inRevision) {
     //                     // Show revision modal if problem is in today's revision
     //                     setDuplicateProblem(revisionResult.existingProblem);
     //                     setProblemInRevision(true);
     //                     setShowRevisionModal(true);
     //                     return;
     //                }
     //           }
               
     //           // If not in today's revision, proceed with original duplicate check
     //           // This will handle mastered vs non-mastered logic
     //           await dispatch(createProblem(formData)).unwrap();
     //           toast.success('Problem added successfully!');
     //           navigate('/problems');
               
     //      } catch (error) {
     //           // Handle the duplicate error from the backend
     //           if (error.includes('already exists')) {
     //                // Fetch the duplicate problem details to show in modal
     //                try {
     //                     const duplicateResponse = await fetch(`/api/problems/check-duplicate/${encodeURIComponent(formData.title)}`, {
     //                     headers: {
     //                          'Authorization': `Bearer ${userInfo.token}`
     //                     }
     //                     });
                         
     //                     if (duplicateResponse.ok) {
     //                     const duplicateResult = await duplicateResponse.json();
     //                     setDuplicateProblem(duplicateResult);
     //                     setShowDuplicateModal(true);
     //                     } else {
     //                     toast.error('A problem with this name already exists. Please choose a different title.');
     //                     }
     //                } catch (fetchError) {
     //                     toast.error('A problem with this name already exists. Please choose a different title.');
     //                }
     //           } else {
     //                toast.error(error.message || 'Failed to add problem.');
     //           }
     //      } finally {
     //           setCheckingRevision(false);
     //      }
     // };

     const onSubmit = async (e) => {
          e.preventDefault();

          if (!isFormValid) {
          toast.error('Please fill in all required fields correctly.');
          return;
          }

          setCheckingRevision(true);
          try {
          // Step 1: Check if problem already exists in today’s revision
          const revisionResponse = await fetch(
               `/api/problems/check-in-todays-revision/${encodeURIComponent(formData.title)}`,
               {
               headers: {
                    Authorization: `Bearer ${userInfo.token}`,
               },
               }
          );

          if (revisionResponse.ok) {
               const revisionResult = await revisionResponse.json();
               if (revisionResult.inRevision) {
               setDuplicateProblem(revisionResult.existingProblem);
               setProblemInRevision(true);
               setShowRevisionModal(true);
               return;
               }
          }

          // Step 2: Create problem
          const result = await dispatch(createProblem(formData)).unwrap();

          // Step 3: Handle session refresh if backend sends it
          if (result.session) {
               dispatch(updateSessionFromProblem(result));
               toast.success(result.message || "Problem added and included in today's revision!");
          } else {
               toast.success("Problem added successfully!");
          }

          navigate('/problems');
          } catch (error) {
          // Handle duplicate error from backend
          if (error.includes && error.includes('already exists')) {
               try {
               const duplicateResponse = await fetch(
                    `/api/problems/check-duplicate/${encodeURIComponent(formData.title)}`,
                    {
                    headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    },
                    }
               );

               if (duplicateResponse.ok) {
                    const duplicateResult = await duplicateResponse.json();
                    setDuplicateProblem(duplicateResult);
                    setShowDuplicateModal(true);
               } else {
                    toast.error('A problem with this name already exists. Please choose a different title.');
               }
               } catch (fetchError) {
               toast.error('A problem with this name already exists. Please choose a different title.');
               }
          } else {
               toast.error(error.message || 'Failed to add problem.');
          }
          } finally {
          setCheckingRevision(false);
          }
     };

     return (
          <div className="max-w-6xl mx-auto px-4 py-8">
               <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Add New Problem</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Expand your collection of coding challenges</p>
               </div>
               
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
                         <div className="flex items-center justify-between mb-2">
                              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                   Title <span className="text-red-500">*</span>
                              </label>
                              {checkingDuplicate && (
                                   <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Checking...
                                   </span>
                              )}
                              {duplicateProblem && !checkingDuplicate && (
                                   <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        Duplicate found
                                   </span>
                              )}
                         </div>
                         <div className="relative">
                              <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input 
                                   type="text" 
                                   name="title" 
                                   id="title" 
                                   placeholder="e.g., Two Sum"
                                   value={formData.title}
                                   onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                   required 
                                   className={`pl-10 ${duplicateProblem ? 'border-yellow-500' : ''}`} 
                              />
                         </div>
                         </fieldset>

                         <fieldset>
                              <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Problem Link <span className="text-red-500">*</span>
                              </label>
                              <div className="relative flex items-center">
                              {/* Left Icon */}
                              <LinkIcon className="absolute left-3 h-5 w-5 text-gray-400" />

                              {/* Input */}
                              <Input
                                   type="url"
                                   name="link"
                                   id="link"
                                   value={formData.link}
                                   onChange={handleLinkChange}
                                   required
                                   className={`pl-10 pr-10 h-12 ${isLinkValid ? 'border-green-500' : 'border-red-500'}`}
                              />

                              {/* Right Icon */}
                              {linkTouched && (
                                   isLinkValid ? (
                                   <CheckCircle2 className="absolute right-3 h-5 w-5 text-green-500" />
                                   ) : (
                                   <XCircle className="absolute right-3 h-5 w-5 text-red-500" />
                                   )
                              )}
                              </div>

                              {!isLinkValid && linkTouched && (
                              <p className="text-xs text-red-500 mt-2 flex items-center">
                                   <AlertCircle size={12} className="mr-1" />
                                   Please provide a valid URL from LeetCode, GFG, etc.
                              </p>
                              )}
                         </fieldset>

                         <fieldset>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                         <AutocompleteInput
                              initialSuggestions={TAG_SUGGESTIONS}
                              placeholder="Type and press Enter to add tags"
                              Icon={Tag}
                              onTagsChange={tags => setFormData(p => ({ ...p, tags }))}
                         />
                         </fieldset>

                         <fieldset>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Tags</label>
                         <AutocompleteInput
                              initialSuggestions={COMPANY_SUGGESTIONS}
                              placeholder="Type and press Enter to add companies"
                              Icon={Briefcase}
                              onTagsChange={companyTags => setFormData(p => ({ ...p, companyTags }))}
                         />
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
                              <DifficultyButton value="Easy" selected={formData.difficulty === 'Easy'} onClick={(val) => setFormData(p => ({ ...p, difficulty: val }))}>Easy</DifficultyButton>
                              <DifficultyButton value="Medium" selected={formData.difficulty === 'Medium'} onClick={(val) => setFormData(p => ({ ...p, difficulty: val }))}>Medium</DifficultyButton>
                              <DifficultyButton value="Hard" selected={formData.difficulty === 'Hard'} onClick={(val) => setFormData(p => ({ ...p, difficulty: val }))}>Hard</DifficultyButton>
                         </div>
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
                                   ></textarea>
                              </div>
                         </fieldset>
                         </div>
                    </div>

                    {/* Submit Button */}
                    <div className="lg:col-span-2 flex justify-center mt-4">
                         <Button 
                         type="submit" 
                         variant="primary" 
                         className="w-full max-w-md !py-4 !text-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                         disabled={isLoading || !isFormValid || checkingDuplicate}
                         >
                         {isLoading || checkingRevision ? (
                              <>
                                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                   {checkingRevision ? 'Checking...' : 'Adding...'}
                              </>
                         ) : (
                              <>
                                   <Plus size={20} />
                                   Add Problem to Collection
                              </>
                         )}
                         </Button>
                    </div>
               </form>

               {/* Modals */}
               <DuplicateProblemModal 
                    isOpen={showDuplicateModal}
                    onClose={() => setShowDuplicateModal(false)}
                    onConfirm={handleReplaceProblem}
                    duplicateProblem={duplicateProblem}
                    replacing={replacing}
               />
               
               <RevisionProblemModal 
                    isOpen={showRevisionModal}
                    onClose={() => setShowRevisionModal(false)}
                    duplicateProblem={duplicateProblem}
               />
          </div>
     );
};

export default AddProblemPage;