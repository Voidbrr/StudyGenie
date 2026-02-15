import React, { useState } from 'react';
import { CourseData, Flashcard, FillInBlank, TrueFalseQuestion, ScenarioQuestion } from '../types';
import { Book, Copy, CheckCircle2, XCircle, RotateCw, Lightbulb, BrainCircuit, FileText, Save, Check, Download, Printer } from 'lucide-react';

interface CourseResultsProps {
  data: CourseData;
  onSave?: (data: CourseData) => void;
  isSaved?: boolean;
}

const CourseResults: React.FC<CourseResultsProps> = ({ data, onSave, isSaved = false }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'practice'>('summary');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    let text = `TOPIC: ${data.topic}\n`;
    text += `SUBJECT: ${data.subject} | GRADE: ${data.grade}\n`;
    text += `================================================\n\n`;
    text += `[ SUMMARY ]\n${data.summary}\n\n`;
    // ... logic remains same, exported text is generic
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_study_guide.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="relative space-y-2">
        <div className="flex flex-wrap justify-center md:justify-end gap-2 mb-4 no-print">
          <button
            onClick={handleDownloadText}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-indigo-400 transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Text</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-indigo-400 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">PDF / Print</span>
          </button>

          {onSave && (
            <button
              onClick={() => onSave(data)}
              disabled={isSaved}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSaved 
                  ? 'bg-green-900/20 text-green-400 border border-green-800' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 border border-transparent'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white pt-2">{data.topic}</h1>
          <div className="flex justify-center gap-3 text-sm font-medium text-slate-400 mt-2">
            <span className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800">{data.subject}</span>
            <span className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800">Grade {data.grade}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-12 border-b border-slate-800 pb-4 no-print">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex flex-col items-center gap-2 transition-all ${
            activeTab === 'summary' ? 'text-sky-400 scale-105' : 'text-slate-600 hover:text-slate-400'
          }`}
        >
          <FileText className={`w-8 h-8 transition-colors ${activeTab === 'summary' ? 'text-sky-400' : 'text-slate-800'}`} />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase">Summary</span>
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex flex-col items-center gap-2 transition-all ${
            activeTab === 'flashcards' ? 'text-sky-400 scale-105' : 'text-slate-600 hover:text-slate-400'
          }`}
        >
          <Copy className={`w-8 h-8 transition-colors ${activeTab === 'flashcards' ? 'text-sky-400' : 'text-slate-800'}`} />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase">Flashcards</span>
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex flex-col items-center gap-2 transition-all ${
            activeTab === 'practice' ? 'text-sky-400 scale-105' : 'text-slate-600 hover:text-slate-400'
          }`}
        >
          <BrainCircuit className={`w-8 h-8 transition-colors ${activeTab === 'practice' ? 'text-sky-400' : 'text-slate-800'}`} />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase">Practice</span>
        </button>
      </div>

      <div className="min-h-[400px]">
        <div className="no-print">
          {activeTab === 'summary' && <SummaryView summary={data.summary} />}
          {activeTab === 'flashcards' && <FlashcardsView flashcards={data.flashcards} />}
          {activeTab === 'practice' && (
            <PracticeView 
              fillInTheBlanks={data.fillInTheBlanks} 
              trueFalse={data.trueFalse} 
              scenarios={data.scenarios} 
            />
          )}
        </div>

        <div className="hidden print:block space-y-8 bg-white text-black p-4">
           {/* Print view kept simple/light */}
           <h2 className="text-2xl font-bold">Summary: {data.topic}</h2>
           <p className="whitespace-pre-wrap">{data.summary}</p>
        </div>
      </div>
    </div>
  );
};

const SummaryView: React.FC<{ summary: string }> = ({ summary }) => (
  <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 md:p-10">
    <div className="prose prose-lg prose-invert prose-indigo max-w-none">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 no-print">
        <Book className="w-5 h-5 text-indigo-400" />
        Key Concepts
      </h3>
      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{summary}</div>
    </div>
  </div>
);

const FlashcardsView: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % flashcards.length), 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length), 150);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="relative h-96 w-full perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full text-center transition-all duration-500 transform-style-3d shadow-2xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-2xl border-2 border-slate-800 p-8 flex flex-col items-center justify-center backface-hidden">
             <div className="absolute top-4 left-4 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Front</div>
             <p className="text-xl md:text-2xl font-semibold text-white overflow-y-auto max-h-[80%]">{flashcards[currentIndex].front}</p>
             <div className="absolute bottom-4 text-xs text-slate-500 font-medium">Click to reveal answer</div>
          </div>
          <div className="absolute inset-0 w-full h-full bg-indigo-700 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 text-white border-2 border-indigo-500/50">
             <div className="absolute top-4 left-4 text-[10px] font-bold text-indigo-100 uppercase tracking-[0.2em]">Back</div>
             <p className="text-lg md:text-xl font-medium mb-4">{flashcards[currentIndex].back}</p>
             {flashcards[currentIndex].explanation && (
                <div className="mt-4 p-3 bg-indigo-800/50 rounded-lg text-sm text-indigo-50 border border-indigo-400/30">
                  <span className="font-bold text-indigo-200 block mb-1 text-[10px] uppercase tracking-wider">Note</span>
                  {flashcards[currentIndex].explanation}
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 text-slate-500">
        <button onClick={handlePrev} className="p-3 rounded-full hover:bg-slate-800 hover:text-indigo-400 transition-all border border-transparent hover:border-slate-700">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-bold tracking-widest text-slate-600">
          {currentIndex + 1} / {flashcards.length}
        </span>
        <button onClick={handleNext} className="p-3 rounded-full hover:bg-slate-800 hover:text-indigo-400 transition-all border border-transparent hover:border-slate-700">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

const PracticeView: React.FC<{ 
  fillInTheBlanks: FillInBlank[]; 
  trueFalse: TrueFalseQuestion[]; 
  scenarios: ScenarioQuestion[];
}> = ({ fillInTheBlanks, trueFalse, scenarios }) => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="bg-green-950 text-green-400 p-1.5 rounded-lg"><FileText className="w-4 h-4" /></span>
          Fill in the Blanks
        </h3>
        <div className="space-y-4">
          {fillInTheBlanks.map((item, idx) => (
            <FillInBlankItem key={idx} item={item} index={idx} />
          ))}
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="bg-blue-950 text-blue-400 p-1.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
          True or False
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trueFalse.map((q, idx) => (
            <TrueFalseItem key={idx} question={q} />
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
           <span className="bg-purple-950 text-purple-400 p-1.5 rounded-lg"><Lightbulb className="w-4 h-4" /></span>
           Scenario Challenges
        </h3>
        <div className="space-y-6">
          {scenarios.map((s, idx) => (
            <ScenarioItem key={idx} scenario={s} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FillInBlankItem: React.FC<{ item: FillInBlank; index: number }> = ({ item, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const parts = item.sentence.split('_____');
  return (
    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center mt-0.5 border border-slate-700">{index + 1}</span>
        <div className="flex-1">
          <p className="text-slate-200 font-medium leading-relaxed">
            {parts[0]}
            <span className={`inline-block border-b-2 px-2 min-w-[100px] text-center transition-all ${showAnswer ? 'border-indigo-400 text-indigo-400 font-bold' : 'border-slate-600 text-transparent'}`}>
              {showAnswer ? item.answer : '?'}
            </span>
            {parts[1]}
          </p>
          <button onClick={() => setShowAnswer(!showAnswer)} className="text-xs text-indigo-400 font-bold mt-4 hover:text-indigo-300 tracking-wider uppercase">
            {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TrueFalseItem: React.FC<{ question: TrueFalseQuestion }> = ({ question }) => {
  const [selected, setSelected] = useState<boolean | null>(null);
  const isCorrect = selected === question.isTrue;
  const hasAnswered = selected !== null;
  return (
    <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-800 flex flex-col justify-between h-full">
      <p className="text-slate-200 font-medium mb-6">{question.statement}</p>
      {!hasAnswered ? (
        <div className="flex gap-3 mt-auto">
          <button onClick={() => setSelected(true)} className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 hover:border-indigo-500 hover:text-white transition-all">True</button>
          <button onClick={() => setSelected(false)} className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-300 hover:border-indigo-500 hover:text-white transition-all">False</button>
        </div>
      ) : (
        <div className={`mt-auto p-4 rounded-xl ${isCorrect ? 'bg-green-900/20 text-green-400 border border-green-800/50' : 'bg-red-900/20 text-red-400 border border-red-800/50'}`}>
          <div className="flex items-center gap-2 font-bold mb-2">
            {isCorrect ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
            {isCorrect ? "Brilliant!" : "Not quite"}
          </div>
          <p className="text-xs opacity-80 leading-relaxed">{question.explanation}</p>
          <button onClick={() => setSelected(null)} className="mt-3 text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1 opacity-60"><RotateCw className="w-3 h-3"/> Retry</button>
        </div>
      )}
    </div>
  );
};

const ScenarioItem: React.FC<{ scenario: ScenarioQuestion; index: number }> = ({ scenario, index }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900">
      <div className="bg-slate-800/30 p-6 border-b border-slate-800">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 block opacity-80">Scenario {index + 1}</span>
        <p className="text-slate-400 italic mb-4 text-sm leading-relaxed">"{scenario.scenario}"</p>
        <p className="text-white font-bold text-lg">{scenario.question}</p>
      </div>
      <div className="p-6 space-y-3 bg-slate-900/50">
        {scenario.options.map((opt, i) => {
          let btnClass = "w-full text-left p-4 rounded-xl border text-sm transition-all ";
          if (selectedIdx === null) btnClass += "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-white";
          else if (i === scenario.correctAnswerIndex) btnClass += "bg-green-900/20 border-green-500 text-green-400 font-bold";
          else if (i === selectedIdx) btnClass += "bg-red-900/20 border-red-500 text-red-400";
          else btnClass += "bg-slate-900/50 border-slate-800 text-slate-600";
          
          return (
            <button key={i} onClick={() => selectedIdx === null && setSelectedIdx(i)} disabled={selectedIdx !== null} className={btnClass}>
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {selectedIdx !== null && i === scenario.correctAnswerIndex && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </button>
          );
        })}
        {selectedIdx !== null && (
          <div className="mt-6 p-4 bg-indigo-900/20 text-indigo-300 text-sm rounded-xl border border-indigo-800/30">
            <span className="font-bold block mb-1 text-xs uppercase tracking-wider text-indigo-200">Explanation</span>
            {scenario.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseResults;