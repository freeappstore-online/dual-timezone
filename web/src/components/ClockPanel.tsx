import { useState, useEffect } from 'react';
import { Sun, Moon, Trash2 } from 'lucide-react';
import type { Meeting } from '../types';
import { getCityName } from '../data/timezones';
import { getCurrentTime, isDaytime, getDayRelationAndDiffText } from '../utils/timeHelpers';

interface Props {
  homeCityId: string;
  targetCityIds: string[];
  meetings: Meeting[];
  onRemoveTarget: (id: string) => void;
}

export function ClockPanel({ homeCityId, targetCityIds, meetings, onRemoveTarget }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderRow = (cityId: string, isHome: boolean) => {
    const activeCount = meetings.filter(m => !m.completed && m.targetCityId === cityId).length;
    const cityName = getCityName(cityId);
    
    let subtitle = '';
    if (activeCount > 0) {
      subtitle = `${activeCount} meeting${activeCount === 1 ? '' : 's'} scheduled today`;
    } else {
      if (isHome) {
        subtitle = 'Home Location';
      } else {
        subtitle = getDayRelationAndDiffText(homeCityId, cityId, now);
      }
    }

    const timeStr = getCurrentTime(cityId, now);
    const day = isDaytime(cityId, now);

    return (
      <div key={cityId} className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-0 group">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-white">{cityName}</span>
            {isHome && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-wider">HOME</span>
            )}
          </div>
          <span className="text-sm text-slate-400">{subtitle}</span>
        </div>
        <div className="flex items-center gap-4">
          {!isHome && (
            <button 
              type="button"
              onClick={() => onRemoveTarget(cityId)}
              className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 cursor-pointer"
              aria-label={`Remove ${cityName}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-3">
            {day ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-300" />}
            <span className="text-3xl font-light tabular-nums tracking-tight text-white">{timeStr}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 md:p-6 shadow-xl mb-8">
      <div className="flex flex-col">
        {renderRow(homeCityId, true)}
        {targetCityIds.map(id => renderRow(id, false))}
      </div>
    </div>
  );
}
