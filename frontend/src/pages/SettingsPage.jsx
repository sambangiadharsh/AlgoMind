import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSettings, updateSettings, reset } from '../features/settings/settingsSlice.js';
import { getProblems } from '../features/problems/problemSlice.js';
import Spinner from '../components/common/Spinner.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { toast } from 'react-hot-toast';
import { XCircle, Tag, Briefcase, AlertTriangle } from 'lucide-react';

// --- Reusable Autocomplete Input for Settings ---
const AutocompleteSettingsInput = ({ suggestions = [], placeholder, Icon, onTagsChange, initialTags = [] }) => {
     const [inputValue, setInputValue] = useState('');
     const [tags, setTags] = useState(initialTags);
     const [allSuggestions, setAllSuggestions] = useState(suggestions);
     const [filteredSuggestions, setFilteredSuggestions] = useState([]);
     const [activeIndex, setActiveIndex] = useState(-1);
     const [isInputFocused, setInputFocused] = useState(false);
     const wrapperRef = useRef(null);
     const listRef = useRef(null);

     useEffect(() => { setTags(initialTags); }, [initialTags]);
     useEffect(() => { setAllSuggestions(suggestions); }, [suggestions]);

     useEffect(() => {
          const handleClickOutside = (event) => {
               if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                    setFilteredSuggestions([]);
               }
          };
          document.addEventListener('mousedown', handleClickOutside);
          return () => document.removeEventListener('mousedown', handleClickOutside);
     }, []);

     useEffect(() => {
          if (activeIndex >= 0 && listRef.current?.children[activeIndex]) {
               listRef.current.children[activeIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
               });
          }
     }, [activeIndex]);

     const handleInputChange = (e) => {
          const value = e.target.value;
          setInputValue(value);
          setActiveIndex(-1);
          if (value) {
               const lowerValue = value.toLowerCase();
               setFilteredSuggestions(
                    (allSuggestions || []).filter(s => s.toLowerCase().includes(lowerValue) && !tags.includes(s))
               );
          } else {
               setFilteredSuggestions([]);
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
          
          if (!allSuggestions.includes(newTag)) {
               setAllSuggestions(prev => [...prev, newTag].sort());
          }
     };

     const removeTag = (tagToRemove) => {
          const newTags = tags.filter(tag => tag !== tagToRemove);
          setTags(newTags);
          onTagsChange(newTags);
     };
     
     const handleKeyDown = (e) => {
          const totalSuggestions = filteredSuggestions.length;
          const canAddNew = inputValue.trim() && !(allSuggestions || []).find(s => s.toLowerCase() === inputValue.trim().toLowerCase());

          if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
               e.preventDefault();
               removeTag(tags[tags.length - 1]);
          } else if (e.key === 'ArrowDown') {
               e.preventDefault();
               setActiveIndex(prev => (prev + 1) % (totalSuggestions + (canAddNew ? 1 : 0)));
          } else if (e.key === 'ArrowUp') {
               e.preventDefault();
               setActiveIndex(prev => (prev - 1 + (totalSuggestions + (canAddNew ? 1 : 0))) % (totalSuggestions + (canAddNew ? 1 : 0)));
          } else if (e.key === ',' || e.key === 'Enter') {
               e.preventDefault();
               if (activeIndex !== -1) {
                    if (activeIndex < totalSuggestions) {
                         addTag(filteredSuggestions[activeIndex]);
                    } else {
                         addTag(inputValue.trim());
                    }
               } else {
                    addTag(inputValue);
               }
          }
     };

     return (
          <div className="relative" ref={wrapperRef}>
               <div className={`relative flex flex-wrap items-center gap-2 p-2 border rounded-md transition-shadow ${isInputFocused ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    <Icon className="h-5 w-5 text-gray-400 ml-1 flex-shrink-0" />
                    {tags.map(tag => (
                         <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-sm font-medium px-2 py-1 rounded">
                         {tag}
                         <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-700"><XCircle size={14} /></button>
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
                         className="flex-grow bg-transparent outline-none p-1 min-w-[100px]"
                    />
               </div>
               {(filteredSuggestions.length > 0 || (inputValue.trim() && !(allSuggestions || []).find(s => s.toLowerCase() === inputValue.trim().toLowerCase()))) && (
                    <ul ref={listRef} className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                         {filteredSuggestions.map((suggestion, index) => (
                         <li key={suggestion} onClick={() => addTag(suggestion)} className={`px-4 py-2 cursor-pointer ${activeIndex === index ? 'bg-indigo-100 dark:bg-indigo-900' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/50'}`}>
                              {suggestion}
                         </li>
                         ))}
                         {inputValue.trim() && !(allSuggestions || []).find(s => s.toLowerCase() === inputValue.trim().toLowerCase()) && (
                              <li onClick={() => addTag(inputValue.trim())} className={`px-4 py-2 cursor-pointer text-indigo-600 font-medium ${activeIndex === filteredSuggestions.length ? 'bg-indigo-100 dark:bg-indigo-900' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/50'}`}>
                              Add "{inputValue.trim()}"
                         </li>
                         )}
                    </ul>
               )}
          </div>
     );
     };

     const SettingsPage = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { settings, isLoading, isError, message } = useSelector(state => state.settings);
     const { problems } = useSelector(state => state.problems);
     
     const [formData, setFormData] = useState({
          difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
          revisionMode: 'RANDOM',
          customRevisionTopics: [],
          customRevisionCompanies: [],
     });
     const [isSaveDisabled, setSaveDisabled] = useState(false);
     const [warningMessage, setWarningMessage] = useState('');

     useEffect(() => {
          dispatch(getProblems());
          dispatch(getSettings());
          return () => { dispatch(reset()); };
     }, [dispatch]);

     useEffect(() => {
          if (isError) toast.error(message);
          if (settings) {
               setFormData({
                    difficultyDistribution: settings.difficultyDistribution || { easy: 2, medium: 2, hard: 1 },
                    revisionMode: settings.revisionMode || 'RANDOM',
                    customRevisionTopics: settings.customRevisionTopics || [],
                    customRevisionCompanies: settings.customRevisionCompanies || [],
               });
          }
     }, [settings, isError, message]);
     
     //     useEffect(() => {
     //         let isDisabled = false;
     //         let warning = '';

     //         const { easy, medium, hard } = formData.difficultyDistribution;
     //         if (easy + medium + hard === 0) {
     //             isDisabled = true;
     //             warning = 'Total problems per session must be at least 1.';
     //         }

     //         if (!isDisabled && problems && problems.length > 0 && formData.revisionMode !== 'RANDOM') {
     //             const now = new Date();
     //             const dueProblems = problems.filter(p => new Date(p.nextRevisionDate) <= now && !p.isArchived);
               
     //             let filtered = dueProblems;
     //             const isTopicMode = formData.revisionMode === 'TOPIC' || formData.revisionMode === 'COMBO';
     //             const isCompanyMode = formData.revisionMode === 'COMPANY' || formData.revisionMode === 'COMBO';

     //             if (isTopicMode) {
     //                 if (formData.customRevisionTopics.length === 0) {
     //                     isDisabled = true;
     //                     warning = 'Please select at least one topic for topic-focused revision.';
     //                 } else {
     //                     filtered = filtered.filter(p => p.tags.some(tag => formData.customRevisionTopics.includes(tag)));
     //                 }
     //             }
     //             if (isCompanyMode) {
     //                  if (formData.customRevisionCompanies.length === 0) {
     //                     isDisabled = true;
     //                     warning = 'Please select at least one company for company-focused revision.';
     //                 } else {
     //                     filtered = filtered.filter(p => p.companyTags.some(tag => formData.customRevisionCompanies.includes(tag)));
     //                 }
     //             }
               
     //             if (!isDisabled && filtered.length === 0) {
     //                 warning = 'You have no problems due for revision that match your selected focus.';
     //                 isDisabled = true;
     //             }
     //         }
     //         setSaveDisabled(isDisabled);
     //         setWarningMessage(warning);
     //     }, [problems, formData]);

     // In SettingsPage.jsx - fix the validation useEffect
     useEffect(() => {
     let isDisabled = false;
     let warning = '';

     const { easy, medium, hard } = formData.difficultyDistribution;
     if (easy + medium + hard === 0) {
          isDisabled = true;
          warning = 'Total problems per session must be at least 1.';
     }

     // For new users without problems, show helpful message
     if (!isDisabled && (!problems || problems.length === 0)) {
          if (formData.revisionMode !== 'RANDOM') {
               if (formData.revisionMode === 'TOPIC' && formData.customRevisionTopics.length > 0) {
                    warning = 'No problems found with selected topics. Please add problems with these topics first.';
               } else if (formData.revisionMode === 'COMPANY' && formData.customRevisionCompanies.length > 0) {
                    warning = 'No problems found with selected companies. Please add problems with these companies first.';
               } else if (formData.revisionMode === 'COMBO' && 
                         (formData.customRevisionTopics.length > 0 || formData.customRevisionCompanies.length > 0)) {
                    warning = 'No problems found matching your focus. Please add problems that match your selected topics/companies first.';
               } else if (formData.revisionMode !== 'RANDOM') {
                    warning = 'No problems found. Please add problems first, then configure focused revision.';
               }
          }
          // Don't disable save for new users - let them configure settings for future
          isDisabled = false;
     }

     // Only validate for users with existing problems
     if (!isDisabled && problems && problems.length > 0 && formData.revisionMode !== 'RANDOM') {
          const now = new Date();
          const dueProblems = problems.filter(p => new Date(p.nextRevisionDate) <= now && !p.isArchived);
          
          let filtered = dueProblems;
          const isTopicMode = formData.revisionMode === 'TOPIC' || formData.revisionMode === 'COMBO';
          const isCompanyMode = formData.revisionMode === 'COMPANY' || formData.revisionMode === 'COMBO';

          if (isTopicMode && formData.customRevisionTopics.length === 0) {
               isDisabled = true;
               warning = 'Please select at least one topic for topic-focused revision.';
          } else if (isCompanyMode && formData.customRevisionCompanies.length === 0) {
               isDisabled = true;
               warning = 'Please select at least one company for company-focused revision.';
          } else {
               // Apply filters if selections are made
               if (isTopicMode && formData.customRevisionTopics.length > 0) {
                    filtered = filtered.filter(p => p.tags.some(tag => formData.customRevisionTopics.includes(tag)));
               }
               if (isCompanyMode && formData.customRevisionCompanies.length > 0) {
                    filtered = filtered.filter(p => p.companyTags.some(tag => formData.customRevisionCompanies.includes(tag)));
               }
               
               if (filtered.length === 0) {
                    warning = 'No problems found matching your selected focus. Please add problems with these tags/companies or switch to random mode.';
                    // Don't disable save, just warn
                    isDisabled = false;
               }
          }
     }
     
     setSaveDisabled(isDisabled);
     setWarningMessage(warning);
     }, [problems, formData]);

     const allTags = problems ? [...new Set(problems.flatMap(p => p.tags))].sort() : [];
     const allCompanies = problems ? [...new Set(problems.flatMap(p => p.companyTags))].sort() : [];

     const handleDifficultyChange = (e) => {
          const { name, value } = e.target;
          const sanitizedValue = Math.max(0, Number(value));
          setFormData(prev => ({ ...prev, difficultyDistribution: { ...prev.difficultyDistribution, [name]: sanitizedValue } }));
     };

     const handleModeChange = (e) => {
          const newMode = e.target.value;
          
          // Clear topic/company selections when switching to modes that don't use them
          setFormData(prev => {
               const updatedData = { ...prev, revisionMode: newMode };
               
               if (newMode === 'RANDOM') {
                    // Clear both topics and companies for random mode
                    updatedData.customRevisionTopics = [];
                    updatedData.customRevisionCompanies = [];
               } else if (newMode === 'TOPIC') {
                    // Clear companies when switching to topic-only mode
                    updatedData.customRevisionCompanies = [];
               } else if (newMode === 'COMPANY') {
                    // Clear topics when switching to company-only mode
                    updatedData.customRevisionTopics = [];
               }
               // For COMBO mode, keep both topics and companies
               
               return updatedData;
          });
     };

     const onSubmit = (e) => {
          e.preventDefault();
          
          // Prepare clean data for submission
          const submissionData = { ...formData };
          
          // Clear topic/company arrays for modes that don't use them
          if (submissionData.revisionMode === 'RANDOM') {
               submissionData.customRevisionTopics = [];
               submissionData.customRevisionCompanies = [];
          } else if (submissionData.revisionMode === 'TOPIC') {
               submissionData.customRevisionCompanies = [];
          } else if (submissionData.revisionMode === 'COMPANY') {
               submissionData.customRevisionTopics = [];
          }
          
          dispatch(updateSettings(submissionData)).unwrap()
               .then((response) => {
                    // Show the specific message from the server about when settings will apply
                    toast.success(response.message || 'Settings updated successfully!');
                    
                    // Redirect to revision page after a short delay to show the toast
                    setTimeout(() => {
                         navigate('/revision');
                    }, 1000);
               })
               .catch((err) => toast.error(err.message || 'Failed to update settings.'));
     };

     if (isLoading && !settings) {
          return <Spinner />;
     }

     return (
          <div className="max-w-2xl mx-auto">
               <h1 className="text-3xl font-bold mb-6">Settings</h1>
               <form onSubmit={onSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                    <fieldset>
                         <legend className="text-lg font-medium text-gray-900 dark:text-white">Problems per Revision</legend>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Set how many problems of each difficulty you want in a revision session.</p>
                         <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div>
                              <label htmlFor="easy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Easy</label>
                              <Input type="number" name="easy" id="easy" min="0" value={formData.difficultyDistribution.easy} onChange={handleDifficultyChange} />
                         </div>
                         <div>
                              <label htmlFor="medium" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Medium</label>
                              <Input type="number" name="medium" id="medium" min="0" value={formData.difficultyDistribution.medium} onChange={handleDifficultyChange} />
                         </div>
                         <div>
                              <label htmlFor="hard" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hard</label>
                              <Input type="number" name="hard" id="hard" min="0" value={formData.difficultyDistribution.hard} onChange={handleDifficultyChange} />
                         </div>
                         </div>
                    </fieldset>

                    <fieldset>
                         <legend className="text-lg font-medium text-gray-900 dark:text-white">Revision Mode</legend>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Choose how problems are selected for revision.</p>
                         <div className="mt-4">
                         <select name="revisionMode" value={formData.revisionMode} onChange={handleModeChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                              <option value="RANDOM">Random from all due problems</option>
                              <option value="TOPIC">Focus on specific topics</option>
                              <option value="COMPANY">Focus on specific companies</option>
                              <option value="COMBO">Combine topic and company focus</option>
                         </select>
                         </div>
                    </fieldset>

                    { (formData.revisionMode === 'TOPIC' || formData.revisionMode === 'COMBO') && (
                         <fieldset>
                         <label className="block text-sm font-medium mb-1">Focus Topics</label>
                         <AutocompleteSettingsInput 
                              suggestions={allTags}
                              placeholder="Select or add topics..."
                              Icon={Tag}
                              onTagsChange={tags => setFormData(p => ({...p, customRevisionTopics: tags}))}
                              initialTags={formData.customRevisionTopics}
                         />
                         </fieldset>
                    )}

                    { (formData.revisionMode === 'COMPANY' || formData.revisionMode === 'COMBO') && (
                         <fieldset>
                         <label className="block text-sm font-medium mb-1">Focus Companies</label>
                         <AutocompleteSettingsInput 
                              suggestions={allCompanies}
                              placeholder="Select or add companies..."
                              Icon={Briefcase}
                              onTagsChange={companies => setFormData(p => ({...p, customRevisionCompanies: companies}))}
                              initialTags={formData.customRevisionCompanies}
                         />
                         </fieldset>
                    )}
                    
                    {warningMessage && (
                    <div className={`p-4 border-l-4 flex items-center gap-3 ${
                         warningMessage.includes('must be at least 1') || 
                         warningMessage.includes('Please select at least')
                              ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-400 text-yellow-800 dark:text-yellow-300'
                              : 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-800 dark:text-blue-300'
                    }`}>
                         <AlertTriangle size={20} />
                         <div>
                              <p className="text-sm font-medium mb-1">Note:</p>
                              <p className="text-sm">{warningMessage}</p>
                              {warningMessage.includes('No problems found') && (
                                   <button 
                                        type="button" 
                                        onClick={() => navigate('/add-problem')}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                                   >
                                        Add Problems Now
                                   </button>
                              )}
                         </div>
                    </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                         <Button type="submit" variant="primary" disabled={isLoading || isSaveDisabled} className="flex-1">
                         {isLoading ? 'Saving...' : 'Update Settings & Go to Revision'}
                         </Button>
                         <Button 
                         type="button" 
                         variant="outline" 
                         onClick={() => navigate('/revision')}
                         className="flex-1"
                         >
                         Cancel & Back to Revision
                         </Button>
                    </div>
               </form>
          </div>
     );
};

export default SettingsPage;