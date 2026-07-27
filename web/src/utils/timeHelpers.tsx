export function getCurrentOffsetMs(tz: string, date: Date = new Date()): number {
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    return tzDate.getTime() - utcDate.getTime();
  } catch(e) {
    return 0;
  }
}

export function getTimezoneAbbr(tz: string, date: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  } catch (e) {
    return '';
  }
}

export function getCurrentTime(tz: string, date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  } catch(e) {
    return "00:00";
  }
}

export function isDaytime(tz: string, date: Date = new Date()): boolean {
  try {
    const hour = parseInt(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', hour12: false }).format(date), 10);
    return hour >= 6 && hour < 18;
  } catch(e) {
    return true;
  }
}

export function convertTime(timeStr: string, homeTz: string, targetTz: string): { time: string, abbr: string } {
  if (!timeStr) return { time: '', abbr: '' };
  const [h, m] = timeStr.split(':').map(Number);
  
  const fromOffset = getCurrentOffsetMs(homeTz);
  const toOffset = getCurrentOffsetMs(targetTz);
  
  const diffMs = toOffset - fromOffset;
  let newMs = h * 3600000 + m * 60000 + diffMs;
  
  newMs = newMs % 86400000;
  if (newMs < 0) newMs += 86400000;
  
  const newH = Math.floor(newMs / 3600000);
  const newM = Math.floor((newMs % 3600000) / 60000);
  
  const abbr = getTimezoneAbbr(targetTz);
  return {
    time: `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`,
    abbr
  };
}

function getDateParts(tz: string, date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
  let y, m, d;
  for (const p of parts) {
    if (p.type === 'year') y = parseInt(p.value, 10);
    if (p.type === 'month') m = parseInt(p.value, 10);
    if (p.type === 'day') d = parseInt(p.value, 10);
  }
  return { y, m, d };
}

export function getDayRelationAndDiffText(homeTz: string, targetTz: string, date: Date = new Date()): string {
  if (homeTz === targetTz) return 'Same time';

  try {
    const home = getDateParts(homeTz, date);
    const target = getDateParts(targetTz, date);
    
    const hDate = new Date(home.y!, home.m! - 1, home.d!);
    const tDate = new Date(target.y!, target.m! - 1, target.d!);
    
    const diffDaysMs = tDate.getTime() - hDate.getTime();
    const diffDays = Math.round(diffDaysMs / (1000 * 60 * 60 * 24));
    
    let dayStr = 'Today';
    if (diffDays === 1) dayStr = 'Tomorrow';
    else if (diffDays === -1) dayStr = 'Yesterday';
    else if (diffDays > 1) dayStr = `${diffDays} days ahead`;
    else if (diffDays < -1) dayStr = `${Math.abs(diffDays)} days behind`;
    
    const fromOffset = getCurrentOffsetMs(homeTz, date);
    const toOffset = getCurrentOffsetMs(targetTz, date);
    const diffHours = (toOffset - fromOffset) / 3600000;
    
    if (diffHours === 0) return 'Same time';
    
    const absDiff = Math.abs(diffHours);
    const formatDiff = absDiff % 1 === 0 ? absDiff.toString() : absDiff.toFixed(1);
    const direction = diffHours > 0 ? 'ahead' : 'behind';
    
    return `${dayStr}, ${formatDiff} hours ${direction}`;
  } catch (e) {
    return 'Different time';
  }
}
