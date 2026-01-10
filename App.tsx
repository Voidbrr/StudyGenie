import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import CourseResults from './components/CourseResults';
import SavedCoursesList from './components/SavedCoursesList';
import { CourseData, GenerationRequest } from './types';
import { generateCourseContent } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'studyGenie_courses';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedCourses, setSavedCourses] = useState<CourseData[]>([]);

  // Load saved courses on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setSavedCourses(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load saved courses", e);
    }
  }, []);

  const handleGenerate = async (request: GenerationRequest) => {
    setIsLoading(true);
    setError(null);
    setCourseData(null);

    try {
      const data = await generateCourseContent(request);
      setCourseData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the course content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCourse = (data: CourseData) => {
    // Check if already saved
    if (savedCourses.some(c => c.id === data.id)) return;

    const newSaved = [data, ...savedCourses];
    setSavedCourses(newSaved);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSaved));
  };

  const handleDeleteCourse = (id: string) => {
    const newSaved = savedCourses.filter(c => c.id !== id);
    setSavedCourses(newSaved);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSaved));
  };

  const isCurrentCourseSaved = courseData ? savedCourses.some(c => c.id === courseData.id) : false;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
         <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCourseData(null)}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600">
              StudyGenie
            </h1>
         </div>
         <nav>
           <button 
             onClick={() => setCourseData(null)} 
             className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
           >
             {courseData ? '← Back to Home' : 'New Course'}
           </button>
         </nav>
      </header>

      <main className="max-w-6xl mx-auto pb-12">
        {!courseData ? (
          <div className="flex flex-col items-center min-h-[60vh]">
            <div className="text-center mb-10 max-w-2xl mt-8">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Study smarter, <span className="text-indigo-600">not harder.</span>
              </h2>
              <p className="text-lg text-slate-600">
                Generate summaries, flashcards, and quizzes from any topic in seconds. 
                Tailored to your grade level and curriculum.
              </p>
            </div>
            <InputSection onGenerate={handleGenerate} isLoading={isLoading} />
            
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-xl w-full text-center animate-pulse">
                {error}
              </div>
            )}

            <SavedCoursesList 
              courses={savedCourses} 
              onLoad={setCourseData} 
              onDelete={handleDeleteCourse} 
            />
          </div>
        ) : (
          <CourseResults 
            data={courseData} 
            onSave={handleSaveCourse}
            isSaved={isCurrentCourseSaved}
          />
        )}
      </main>
      
      <footer className="max-w-6xl mx-auto mt-auto pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
         <p>© {new Date().getFullYear()} StudyGenie. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
