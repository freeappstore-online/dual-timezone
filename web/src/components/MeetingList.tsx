import { Check, Trash2 } from 'lucide-react';
import type { Meeting } from '../types';
import { getCityName } from '../data/timezones';
import { convertTime } from '../utils/timeHelpers';

interface Props {
  meetings: Meeting[];
  homeCityId: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MeetingList({ meetings, homeCityId, onToggle, onDelete }: Props) {
  if (meetings.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-sm">
        No meetings scheduled yet. Use the form above to add one.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">Scheduled Meetings</h2>
      {meetings.map(m => {
        const isCompleted = m.completed;
        const targetCityName = getCityName(m.targetCityId);
        const homeCityName = getCityName(homeCityId);
        
        const homeConverted = convertTime(m.timeStr, homeCityId, homeCityId);
        const targetConverted = convertTime(m.timeStr, homeCityId, m.targetCityId);

        return (
          <div 
            key={m.id} 
            className={`flex items-start md:items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition-opacity ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
          >
            <button 
              type="button"
              onClick={() => onToggle(m.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 md:mt-0 transition-colors cursor-pointer ${isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}
              aria-label="Toggle completed"
            >
              {isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h3 className={`font-medium text-slate-900 truncate text-base ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                  {m.title}
                </h3>
                <span className="inline-block self-start text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {targetCityName}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 text-sm mt-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  Home ({homeCityName}): {m.timeStr} {homeConverted.abbr}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  Target ({targetCityName}): {targetConverted.time} {targetConverted.abbr}
                </span>
              </div>
              
              {m.note && (
                <p className={`text-sm text-slate-500 mt-2 ${isCompleted ? 'line-through' : ''}`}>
                  {m.note}
                </p>
              )}
            </div>
            
            <button 
              type="button"
              onClick={() => onDelete(m.id)}
              className="text-slate-400 hover:text-red-500 p-2 transition-colors focus:outline-none cursor-pointer"
              aria-label="Delete meeting"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
