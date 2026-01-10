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
    
    text += `[ FLASHCARDS ]\n`;
    data.flashcards.forEach((fc, i) => {
      text += `${i + 1}. Q: ${fc.front}\n   A: ${fc.back}\n   Expl: ${fc.explanation}\n\n`;
    });
    
    text += `[ FILL IN THE BLANKS ]\n`;
    data.fillInTheBlanks.forEach((fb, i) => {
      text += `${i + 1}. ${fb.sentence} (Answer: ${fb.answer})\n`;
    });
    text += `\n`;

    text += `[ TRUE OR FALSE ]\n`;
    data.trueFalse.forEach((tf, i) => {
      text += `${i + 1}. ${tf.statement} -> ${tf.isTrue ? 'True' : 'False'} (${tf.explanation})\n`;
    });
    text += `\n`;

    text += `[ SCENARIOS ]\n`;
    data.scenarios.forEach((sc, i) => {
      text += `${i + 1}. Scenario: ${sc.scenario}\n   Question: ${sc.question}\n   Correct Option: ${sc.options[sc.correctAnswerIndex]}\n   Explanation: ${sc.explanation}\n\n`;
    });

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
      
      {/* Header with Actions */}
      <div className="relative space-y-2">
        
        {/* Action Buttons (Hidden in Print) */}
        <div className="flex flex-wrap justify-center md:justify-end gap-2 mb-4 no-print">
          <button
            onClick={handleDownloadText}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-all"
            title="Download as Text File"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Text</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-all"
            title="Save as PDF via Print"
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
                  ? 'bg-green-100 text-green-700 cursor-default border border-green-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm border border-transparent'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 pt-2">{data.topic}</h1>
          <div className="flex justify-center gap-3 text-sm font-medium text-slate-500 mt-2">
            <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">{data.subject}</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">Grade {data.grade}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Hidden in Print) */}
      <div className="flex justify-center no-print">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex flex-wrap justify-center gap-1 sm:gap-0">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'flashcards' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Copy className="w-4 h-4" />
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'practice' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            Practice Quiz
          </button>
        </div>
      </div>

      {/* Content Area - Logic for Print Mode vs Screen Mode */}
      <div className="min-h-[400px]">
        {/* On Screen: Show only active tab */}
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

        {/* On Print: Show ALL sections */}
        <div className="hidden print:block space-y-8">
           <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Summary</h2>
           <SummaryView summary={data.summary} />
           
           <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mt-8">Flashcards</h2>
           <div className="grid grid-cols-1 gap-4">
             {data.flashcards.map((fc, i) => (
               <div key={i} className="border border-slate-300 p-4 rounded-lg break-inside-avoid">
                 <p className="font-bold text-lg mb-2">Q: {fc.front}</p>
                 <p className="mb-2">A: {fc.back}</p>
                 <p className="text-sm text-slate-600 italic">Note: {fc.explanation}</p>
               </div>
             ))}
           </div>

           <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mt-8">Practice Quiz</h2>
           <PracticeView 
              fillInTheBlanks={data.fillInTheBlanks} 
              trueFalse={data.trueFalse} 
              scenarios={data.scenarios} 
            />
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const SummaryView: React.FC<{ summary: string }> = ({ summary }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 print:border-none print:shadow-none print:p-0">
    <div className="prose prose-lg prose-indigo max-w-none print:prose-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 no-print">
        <Book className="w-5 h-5 text-indigo-600" />
        Key Concepts
      </h3>
      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{summary}</div>
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
        <div className={`relative w-full h-full text-center transition-all duration-500 transform-style-3d shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-indigo-100 p-8 flex flex-col items-center justify-center backface-hidden">
             <div className="absolute top-4 left-4 text-xs font-bold text-indigo-400 uppercase tracking-wider">Question</div>
             <p className="text-xl md:text-2xl font-semibold text-slate-800 overflow-y-auto max-h-[80%] hide-scrollbar">{flashcards[currentIndex].front}</p>
             <div className="absolute bottom-4 text-xs text-slate-400">Tap to flip</div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full bg-indigo-600 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 text-white">
             <div className="absolute top-4 left-4 text-xs font-bold text-indigo-200 uppercase tracking-wider">Answer</div>
             <p className="text-lg md:text-xl font-medium mb-4">{flashcards[currentIndex].back}</p>
             
             {flashcards[currentIndex].explanation && (
                <div className="mt-4 p-3 bg-indigo-700/50 rounded-lg text-sm text-indigo-100 border border-indigo-500/30">
                  <span className="font-bold text-indigo-200 block mb-1 text-xs uppercase">Explanation</span>
                  {flashcards[currentIndex].explanation}
                </div>
             )}
             
             <div className="absolute bottom-4 text-xs text-indigo-200">Tap to flip</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 no-print">
        <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-medium text-slate-500">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
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
    <div className="space-y-8 print:space-y-4">
      {/* Fill in Blanks */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:border-none print:shadow-none print:p-0">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 print:mb-2">
          <span className="bg-green-100 text-green-600 p-1.5 rounded-lg no-print"><FileText className="w-4 h-4" /></span>
          Fill in the Blanks
        </h3>
        <div className="space-y-4">
          {fillInTheBlanks.map((item, idx) => (
            <FillInBlankItem key={idx} item={item} index={idx} />
          ))}
        </div>
      </div>

      {/* True/False */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:border-none print:shadow-none print:p-0">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 print:mb-2">
          <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg no-print"><CheckCircle2 className="w-4 h-4" /></span>
          True or False
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1">
          {trueFalse.map((q, idx) => (
            <TrueFalseItem key={idx} question={q} />
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:border-none print:shadow-none print:p-0 break-inside-avoid">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 print:mb-2">
           <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg no-print"><Lightbulb className="w-4 h-4" /></span>
           Scenario Challenges
        </h3>
        <div className="space-y-8 print:space-y-4">
          {scenarios.map((s, idx) => (
            <ScenarioItem key={idx} scenario={s} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Interactive Components for Practice Section

const FillInBlankItem: React.FC<{ item: FillInBlank; index: number }> = ({ item, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const parts = item.sentence.split('_____');
  
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors print:bg-white print:border-slate-300">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center mt-0.5">{index + 1}</span>
        <div className="flex-1">
          <p className="text-slate-700 font-medium leading-relaxed">
            {parts[0]}
            <span className={`inline-block border-b-2 px-2 min-w-[80px] text-center transition-colors ${showAnswer ? 'border-green-500 text-green-700 font-bold' : 'border-slate-400 text-transparent print:text-black print:border-slate-800'}`}>
              {showAnswer ? item.answer : '?'}
            </span>
            {parts[1]}
          </p>
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-xs text-indigo-600 font-semibold mt-2 hover:underline no-print"
          >
            {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
          </button>
           {/* For print, always show answer in small text */}
           <p className="hidden print:block text-xs text-slate-500 mt-1">Answer: {item.answer}</p>
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
    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between h-full print:bg-white print:border-slate-300 break-inside-avoid">
      <p className="text-slate-700 font-medium mb-4">{question.statement}</p>
      
      {!hasAnswered ? (
        <div className="flex gap-2 mt-auto no-print">
          <button onClick={() => setSelected(true)} className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all">True</button>
          <button onClick={() => setSelected(false)} className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all">False</button>
        </div>
      ) : (
        <div className={`mt-auto p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} no-print`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {isCorrect ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          <p className="text-xs opacity-90">{question.explanation}</p>
          <button onClick={() => setSelected(null)} className="mt-2 text-xs underline flex items-center gap-1"><RotateCw className="w-3 h-3"/> Reset</button>
        </div>
      )}
      
      {/* Print only answer key */}
      <div className="hidden print:block text-sm text-slate-600 border-t pt-2 mt-2">
        Answer: {question.isTrue ? "True" : "False"} - {question.explanation}
      </div>
    </div>
  );
};

const ScenarioItem: React.FC<{ scenario: ScenarioQuestion; index: number }> = ({ scenario, index }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden print:border-slate-300 break-inside-avoid">
      <div className="bg-slate-50 p-5 border-b border-slate-200 print:bg-white print:border-slate-300">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Scenario {index + 1}</span>
        <p className="text-slate-600 italic mb-4">"{scenario.scenario}"</p>
        <p className="text-slate-800 font-semibold">{scenario.question}</p>
      </div>
      <div className="p-5 space-y-2 bg-white">
        {scenario.options.map((opt, i) => {
          let btnClass = "w-full text-left p-3 rounded-lg border text-sm transition-all ";
          if (selectedIdx === null) {
            btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 no-print";
          } else if (i === scenario.correctAnswerIndex) {
            btnClass += "bg-green-50 border-green-500 text-green-700 font-medium";
          } else if (i === selectedIdx) {
            btnClass += "bg-red-50 border-red-300 text-red-700";
          } else {
             btnClass += "border-slate-100 opacity-50";
          }
          
          // Print styling override
          const printClass = " print:border-slate-200 print:p-2";

          return (
            <button key={i} onClick={() => selectedIdx === null && setSelectedIdx(i)} disabled={selectedIdx !== null} className={btnClass + printClass}>
              {opt}
              {selectedIdx !== null && i === scenario.correctAnswerIndex && <span className="float-right text-green-600 font-bold no-print">✓</span>}
            </button>
          );
        })}
        {selectedIdx !== null && (
          <div className="mt-4 p-3 bg-indigo-50 text-indigo-800 text-sm rounded-lg no-print">
            <span className="font-bold block mb-1">Explanation:</span>
            {scenario.explanation}
          </div>
        )}
        {/* Print Answer */}
        <div className="hidden print:block mt-4 text-sm border-t pt-2">
             <b>Correct Answer:</b> {scenario.options[scenario.correctAnswerIndex]} <br/>
             <b>Explanation:</b> {scenario.explanation}
        </div>
      </div>
    </div>
  );
};

export default CourseResults;