import React from 'react';
import { CourseData } from '../types';
import { Trash2, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface SavedCoursesListProps {
  courses: CourseData[];
  onLoad: (course: CourseData) => void;
  onDelete: (id: string) => void;
}

const SavedCoursesList: React.FC<SavedCoursesListProps> = ({ courses, onLoad, onDelete }) => {
  if (courses.length === 0) return null;

  return (
    <div className="mt-12 max-w-4xl mx-auto w-full">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-500" />
        Saved Courses
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            onClick={() => onLoad(course)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                     {course.subject}
                   </span>
                   <span className="text-xs text-slate-500 border border-slate-200 px-2 py-1 rounded-md">
                     Grade {course.grade}
                   </span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors mb-1">
                  {course.topic}
                </h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                  {course.summary.substring(0, 100)}...
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
               <span className="text-xs text-slate-400">
                 {new Date(course.createdAt).toLocaleDateString()}
               </span>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(course.id!);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-indigo-600 flex items-center gap-1 text-sm font-medium">
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
