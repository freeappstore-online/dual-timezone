import React, { useState } from 'react';
import type { Meeting } from '../types';
import { getCityName } from '../data/timezones';

interface Props {
  homeCityId: string;
  targetCityIds: string[];
  onAdd: (m: Meeting) => void;
}

export function MeetingForm({ homeCityId, targetCityIds, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [timeStr, setTimeStr] = useState('09:00');
  const [targetCityId, setTargetCityId] = useState(homeCityId);
  const [note, setNote] = useState('');

  const validTargetOptions = [homeCityId, ...targetCityIds];
  const currentTarget = validTargetOptions.includes(targetCityId) ? targetCityId : homeCityId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !timeStr) return;

    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 11);

    onAdd({
      id,
      title: title.trim(),
      timeStr,
      targetCityId: currentTarget,
      note: note.trim(),
      completed: false,
    });

    setTitle('');
    setNote('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 mb-8 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Meeting Title</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., UI/UX Sync" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-slate-900"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Time (Home)</label>
            <input 
              type="time" 
              value={timeStr}
              onChange={e => setTimeStr(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-slate-900"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Target Destination</label>
            <select
              value={currentTarget}
              onChange={e => setTargetCityId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-slate-900"
            >
              <option value={homeCityId}>{getCityName(homeCityId)} (Home)</option>
              {targetCityIds.map(id => (
                <option key={id} value={id}>{getCityName(id)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Note (Optional)</label>
            <input 
              type="text" 
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g., Review wireframe draft" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-slate-900"
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors cursor-pointer">
            + Add Meeting
          </button>
        </div>
      </form>
    </div>
  );
}
