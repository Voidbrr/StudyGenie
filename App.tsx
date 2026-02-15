import React, { useState, useEffect, useRef } from 'react';
import InputSection from './components/InputSection';
import CourseResults from './components/CourseResults';
import SavedCoursesList from './components/SavedCoursesList';
import DetailedStudyView from './components/DetailedStudyView';
import SettingsView from './components/SettingsView';
import { CourseData, GenerationRequest, Subject } from './types';
import { generateCourseContent, solveDetailedQuestion } from './services/geminiService';
import { Brain, BookOpen, FolderHeart, Settings, Layout, ChevronRight } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'studyGenie_courses';
const SETTINGS_STORAGE_KEY = 'studyGenie_settings';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedCourses, setSavedCourses] = useState<CourseData[]>([]);
  const [activeView, setActiveView] = useState<'create' | 'solve' | 'saved' | 'settings'>('create');
  
  // Settings state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [systemInstruction, setSystemInstruction] = useState<string>('');

  useEffect(() => {
    // Load courses
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) setSavedCourses(JSON.parse(saved));
      
      // Load settings
      const settingsRaw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (settingsRaw) {
        const settings = JSON.parse(settingsRaw);
        setTheme(settings.theme || 'dark');
        setSystemInstruction(settings.systemInstruction || '');
      }
    } catch (e) {
      console.error("Failed to load saved data", e);
    }
  }, []);

  // Update body class for theme
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    } else {
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
    }
  }, [theme]);

  const handleGenerate = async (request: GenerationRequest) => {
    setIsLoading(true);
    setError(null);
    setCourseData(null);

    try {
      const data = await generateCourseContent(request, systemInstruction);
      setCourseData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCourse = (data: CourseData) => {
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

  const handleSaveSettings = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ theme, systemInstruction }));
    setActiveView('create');
  };

  const isCurrentCourseSaved = courseData ? savedCourses.some(c => c.id === courseData.id) : false;

  const NavItem = ({ view, icon: Icon, label }: { view: any, icon: any, label: string }) => (
    <div className="relative group flex justify-center py-4">
      <button
        onClick={() => {
          setCourseData(null);
          setActiveView(view);
        }}
        className={`w-12 h-12 flex items-center justify-center transition-all rounded-xl ${
          activeView === view 
            ? 'bg-sky-600 shadow-lg shadow-sky-900/20' 
            : 'hover:bg-sky-400/50'
        }`}
      >
        <Icon className={`w-6 h-6 text-white transition-transform ${activeView === view ? 'opacity-100 scale-110' : 'opacity-70 group-hover:scale-110'}`} />
      </button>
      
      {/* Tooltip on Hover (Desktop) */}
      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap border border-slate-800 z-[100]">
        {label}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-b border-slate-800 rotate-45"></div>
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      
      {/* SIDEBAR (Desktop) */}
      <aside className="fixed left-0 top-0 bottom-0 w-[72px] bg-sky-500 flex flex-col items-stretch z-50 shadow-2xl no-print hidden md:flex">
        <div 
          className="h-[72px] flex items-center justify-center bg-sky-500 border-b border-sky-400 cursor-pointer hover:bg-sky-400 transition-colors"
          onClick={() => { setCourseData(null); setActiveView('create'); }}
        >
          <ChevronRight className="w-8 h-8 text-sky-900 fill-current rotate-45 transform -translate-x-0.5" />
        </div>

        <div className="flex flex-col flex-1 py-4">
          <NavItem view="create" icon={Layout} label="Course Genie" />
          <NavItem view="solve" icon={Brain} label="Deepmind" />
          <NavItem view="saved" icon={FolderHeart} label="My Library" />
          
          <div className="mt-auto">
            <NavItem view="settings" icon={Settings} label="App Settings" />
          </div>
        </div>
      </aside>

      {/* MOBILE NAVIGATION - Bottom Dock with Labels */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-sky-500 flex items-center justify-around z-50 shadow-2xl no-print px-2 border-t border-sky-400">
        <button 
          onClick={() => { setCourseData(null); setActiveView('create'); }} 
          className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${activeView === 'create' ? 'bg-sky-600 rounded-2xl' : ''}`}
        >
          <Layout className="w-6 h-6 text-white" />
          <span className="text-[10px] font-bold text-white tracking-tight uppercase">Genie</span>
        </button>
        <button 
          onClick={() => { setCourseData(null); setActiveView('solve'); }} 
          className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${activeView === 'solve' ? 'bg-sky-600 rounded-2xl' : ''}`}
        >
          <Brain className="w-6 h-6 text-white" />
          <span className="text-[10px] font-bold text-white tracking-tight uppercase">Deepmind</span>
        </button>
        <button 
          onClick={() => { setCourseData(null); setActiveView('saved'); }} 
          className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${activeView === 'saved' ? 'bg-sky-600 rounded-2xl' : ''}`}
        >
          <FolderHeart className="w-6 h-6 text-white" />
          <span className="text-[10px] font-bold text-white tracking-tight uppercase">Library</span>
        </button>
        <button 
          onClick={() => { setCourseData(null); setActiveView('settings'); }} 
          className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${activeView === 'settings' ? 'bg-sky-600 rounded-2xl' : ''}`}
        >
          <Settings className="w-6 h-6 text-white" />
          <span className="text-[10px] font-bold text-white tracking-tight uppercase">Settings</span>
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-[72px] p-4 md:p-12 transition-all">
        <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <h1 className={`text-3xl font-black bg-clip-text text-transparent tracking-tighter uppercase italic ${theme === 'light' ? 'bg-gradient-to-r from-slate-900 to-slate-500' : 'bg-gradient-to-r from-white to-slate-500'}`}>
              StudyGenie
            </h1>
            <div className="px-2 py-0.5 rounded bg-sky-500 text-[10px] font-black text-white uppercase tracking-widest">
              AI 3.0
            </div>
          </div>
          {courseData && (
             <button 
               onClick={() => setCourseData(null)} 
               className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-sky-500 transition-colors"
             >
               Back to Home
             </button>
          )}
        </header>

        <div className="max-w-6xl mx-auto pb-24 md:pb-0">
          {!courseData ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {activeView === 'create' && (
                <div className="flex flex-col items-center">
                  <div className="text-center mb-12 max-w-2xl">
                    <h2 className={`text-5xl md:text-6xl font-black mb-6 tracking-tight leading-none uppercase ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      The Ultimate <span className="text-sky-500">Study Guide</span> Generator.
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">Skip the reading. Get the knowledge.</p>
                  </div>
                  <InputSection onGenerate={handleGenerate} isLoading={isLoading} />
                  {error && (
                    <div className="mt-8 p-4 bg-red-900/20 border border-red-800 text-red-400 rounded-2xl max-w-xl w-full text-center">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {activeView === 'solve' && (
                <div className="w-full max-w-3xl mx-auto">
                   <div className="mb-8 text-center">
                    <h2 className={`text-4xl font-black uppercase italic tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Deepmind</h2>
                   </div>
                   <DetailedStudyView 
                    subject={Subject.SCIENCE} 
                    grade="5" 
                    defaultTopic="" 
                    isStandalone={true}
                    systemInstruction={systemInstruction}
                  />
                </div>
              )}

              {activeView === 'saved' && (
                <div className="w-full">
                  <SavedCoursesList 
                    courses={savedCourses} 
                    onLoad={setCourseData} 
                    onDelete={handleDeleteCourse} 
                  />
                  {savedCourses.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-700">
                      <FolderHeart className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-xl font-black uppercase tracking-widest opacity-30">Library is empty</p>
                    </div>
                  )}
                </div>
              )}

              {activeView === 'settings' && (
                <SettingsView 
                  theme={theme}
                  onThemeChange={setTheme}
                  systemInstruction={systemInstruction}
                  onInstructionChange={setSystemInstruction}
                  onSave={handleSaveSettings}
                />
              )}
            </div>
          ) : (
            <CourseResults 
              data={courseData} 
              onSave={handleSaveCourse}
              isSaved={isCurrentCourseSaved}
            />
          )}
        </div>
      </main>

    </div>
  );
};

export default App;