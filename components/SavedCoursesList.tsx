import React from 'react';
import { CourseData } from '../types';
import { Trash2, Clock, ArrowRight } from 'lucide-react';

interface SavedCoursesListProps {
  courses: CourseData[];
  onLoad: (course: CourseData) => void;
  onDelete: (id: string) => void;
}

const SavedCoursesList: React.FC<SavedCoursesListProps> = ({ courses, onLoad, onDelete }) => {
  if (courses.length === 0) return null;

  return (
    <div className="mt-16 max-w-4xl mx-auto w-full">
      <h3 className="text-lg font-black text-slate-500 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] px-2">
        <Clock className="w-5 h-5" />
        Saved for later
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 shadow-xl hover:shadow-indigo-900/20 hover:border-slate-700 transition-all cursor-pointer relative overflow-hidden flex flex-col"
            onClick={() => onLoad(course)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded-md border border-indigo-800/50">
                   {course.subject}
                 </span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                   Gr {course.grade}
                 </span>
              </div>
            </div>
            
            <h4 className="font-bold text-white text-xl group-hover:text-indigo-400 transition-colors mb-2">
              {course.topic}
            </h4>
            
            <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
              {course.summary}
            </p>
            
            <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                 {new Date(course.createdAt).toLocaleDateString()}
               </span>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(course.id!);
                    }}
                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-950/30 rounded-full transition-colors z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-indigo-400 flex items-center gap-1 text-xs font-black uppercase tracking-[0.1em] group-hover:translate-x-1 transition-transform">
                    Study <ArrowRight className="w-3 h-3" />
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCoursesList;