import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getTimezones } from '../data/timezones';

interface Props {
  placeholder: string;
  onSelect: (tzId: string) => void;
}

export function CityCombobox({ placeholder, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timezones = getTimezones();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = query
    ? timezones.filter(tz => {
        const q = query.toLowerCase();
        return tz.label.toLowerCase().includes(q) || tz.searchTerms.some(term => term.includes(q));
      }).slice(0, 50)
    : timezones.slice(0, 50);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filtered.length > 0 ? (
            filtered.map(tz => (
              <button
                key={tz.id}
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-900 focus:bg-slate-50 focus:outline-none"
                onClick={() => {
                  onSelect(tz.id);
                  setQuery('');
                  setIsOpen(false);
                }}
              >
                {tz.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-slate-500">No cities found</div>
          )}
        </div>
      )}
    </div>
  );
}
