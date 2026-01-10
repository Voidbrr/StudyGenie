import React, { useState } from 'react';
import { Publisher, Subject, GenerationRequest } from '../types';
import { BookOpen, GraduationCap, School, Layers, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (request: GenerationRequest) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [publisher, setPublisher] = useState<Publisher>(Publisher.OXFORD);
  const [grade, setGrade] = useState<string>('5');
  const [subject, setSubject] = useState<Subject>(Subject.HISTORY);
  const [topic, setTopic] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate({ publisher, grade, subject, topic });
    }
  };

  const grades = Array.from({ length: 11 }, (_, i) => (i + 1).toString());

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" />
          Course Generator
        </h2>
        <p className="text-indigo-100 mt-2 text-sm">Create custom study materials instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Publisher & Grade Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <School className="w-4 h-4 text-indigo-500" />
              Publisher
            </label>
            <div className="relative">
              <select
                value={publisher}
                onChange={(e) => setPublisher(e.target.value as Publisher)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value={Publisher.OXFORD}>Oxford</option>
                <option value={Publisher.CAMBRIDGE}>Cambridge</option>
                <option value={Publisher.KIFAYAT}>Kifayat</option>
                <option value={Publisher.FEROZSONS}>Ferozsons</option>
                <option value={Publisher.TECHTREE}>TechTree</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              Grade (1-11)
            </label>
            <div className="relative">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {grades.map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Subject
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(Subject).map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSubject(sub)}
                className={`p-2 rounded-lg text-sm border transition-all ${
                  subject === sub
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The Water Cycle, Mughal Empire, Fractions..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-lg transition-all transform active:scale-[0.98] ${
            isLoading || !topic.trim()
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Course...
            </span>
          ) : (
            'Generate Study Material'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputSection;