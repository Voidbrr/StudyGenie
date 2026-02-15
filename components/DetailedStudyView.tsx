import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Send, Brain, Sparkles, X, BookOpen, GraduationCap } from 'lucide-react';
import { solveDetailedQuestion } from '../services/geminiService';
import { Subject } from '../types';

interface DetailedStudyViewProps {
  subject: string;
  grade: string;
  defaultTopic: string;
  isStandalone?: boolean;
  systemInstruction?: string;
}

const DetailedStudyView: React.FC<DetailedStudyViewProps> = ({ 
  subject: initialSubject, 
  grade: initialGrade, 
  defaultTopic,
  isStandalone = false,
  systemInstruction = ""
}) => {
  const [inputText, setInputText] = useState(defaultTopic ? `Tell me more about ${defaultTopic}` : "");
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [selectedGrade, setSelectedGrade] = useState<string>(initialGrade);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!inputText.trim() && !capturedImage) return;
    
    setIsLoading(true);
    setResponse(null);
    try {
      const base64Data = capturedImage ? capturedImage.split(',')[1] : undefined;
      const result = await solveDetailedQuestion(selectedSubject, selectedGrade, inputText, base64Data, systemInstruction);
      setResponse(result);
    } catch (err) {
      alert("Failed to solve the question. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const grades = Array.from({ length: 11 }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="bg-sky-600 p-6 text-white text-center shadow-lg">
          <h3 className="text-xl font-bold flex items-center justify-center gap-2">
            <Brain className="w-6 h-6" />
            Deepmind
          </h3>
          <p className="text-sky-100 text-sm mt-1 opacity-80">Capture a problem or ask a complex topic for a deep dive.</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {isStandalone && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                   <BookOpen className="w-4 h-4 text-sky-400" />
                   Subject
                 </label>
                 <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                 >
                   {Object.values(Subject).map(sub => (
                     <option key={sub} value={sub}>{sub}</option>
                   ))}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                   <GraduationCap className="w-4 h-4 text-sky-400" />
                   Grade
                 </label>
                 <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-sm"
                 >
                   {grades.map(g => (
                     <option key={g} value={g}>Grade {g}</option>
                   ))}
                 </select>
               </div>
            </div>
          )}

          <div className="space-y-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question, paste text from a book, or describe a problem..."
              className="w-full h-32 p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none resize-none transition-all text-slate-100 placeholder:text-slate-600 shadow-inner"
            />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={isCameraActive ? capturePhoto : startCamera}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-xs uppercase tracking-widest ${
                  isCameraActive ? 'bg-sky-600 text-white animate-pulse' : 'bg-slate-800 text-sky-400 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Camera className="w-4 h-4" />
                {isCameraActive ? 'Capture' : 'Camera'}
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-bold text-xs uppercase tracking-widest border border-slate-700"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>

          {isCameraActive && (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video border-4 border-sky-600 shadow-2xl">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <button onClick={stopCamera} className="bg-black/70 p-2 rounded-full text-white hover:bg-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="relative inline-block group">
              <img src={capturedImage} className="max-h-64 rounded-xl border-2 border-slate-700 shadow-xl" alt="Captured" />
              <button onClick={() => setCapturedImage(null)} className="absolute -top-2 -right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleSolve}
            disabled={isLoading || (!inputText.trim() && !capturedImage)}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${
              isLoading || (!inputText.trim() && !capturedImage)
                ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:shadow-sky-900/40'
            }`}
          >
            {isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {isLoading ? 'Thinking...' : 'Get Deep Answer'}
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {response && (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-sky-500/30 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-sky-400 font-black mb-6 text-sm uppercase tracking-[0.2em] border-b border-slate-800 pb-4">
            <Sparkles className="w-5 h-5" />
            AI Tutor Analysis
          </div>
          <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
            {response}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 text-[10px] text-slate-600 uppercase tracking-widest flex justify-between">
            <span>Powered by Gemini 3 Pro</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sky-500 hover:text-sky-400">Back to top</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedStudyView;