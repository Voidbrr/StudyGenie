
import React from 'react';
import { Settings, Moon, Sun, Terminal, Info, Save } from 'lucide-react';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  systemInstruction: string;
  onInstructionChange: (instruction: string) => void;
  onSave: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  theme, 
  onThemeChange, 
  systemInstruction, 
  onInstructionChange,
  onSave
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-sky-500" />
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">App Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Appearance</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onThemeChange('light')}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                theme === 'light' 
                ? 'border-sky-500 bg-sky-500/10 text-white' 
                : 'border-slate-800 bg-slate-800/50 text-slate-500 hover:border-slate-700'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span className="font-bold">Light Mode</span>
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                theme === 'dark' 
                ? 'border-sky-500 bg-sky-500/10 text-white' 
                : 'border-slate-800 bg-slate-800/50 text-slate-500 hover:border-slate-700'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span className="font-bold">Dark Mode</span>
            </button>
          </div>
        </div>

        {/* AI Behavior Settings */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">AI Personality & Instructions</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 font-medium italic">
            Add custom instructions to influence how the AI generates content or solves questions.
          </p>
          <textarea
            value={systemInstruction}
            onChange={(e) => onInstructionChange(e.target.value)}
            placeholder="e.g. Always include a joke, use simpler language, or focus on real-world engineering examples..."
            className="w-full h-40 p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none resize-none transition-all text-slate-100 placeholder:text-slate-600 shadow-inner font-mono text-sm"
          />
          <div className="mt-4 flex items-start gap-2 p-3 bg-sky-900/10 border border-sky-800/30 rounded-lg text-[10px] text-sky-400 font-medium leading-tight">
            <Info className="w-3 h-3 flex-shrink-0" />
            <span>These instructions will be appended to every request made to the Gemini model.</span>
          </div>
        </div>

        <button
          onClick={onSave}
          className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-sky-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
