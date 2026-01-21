import { format, intervalToDuration, formatDistanceToNow } from 'date-fns'; // npm i date-fns

// For Advanced Access: format call time (today/weekly), screen time
export const formatDuration = (seconds: number): string => {
  const duration = intervalToDuration({ seconds });
  if (duration.hours && duration.minutes) {
    return `${duration.hours}h ${duration.minutes}m`;
  } else if (duration.minutes) {
    return `${duration.minutes}m ${duration.seconds}s`;
  }
  return `${seconds}s`;
};

// Weekly total: e.g. "3h 45m this week"
export const formatWeeklyTime = (todaySeconds: number, weeklySeconds: number): string => {
  const today = formatDuration(todaySeconds);
  const weekly = formatDuration(weeklySeconds);
  return `${today} today / ${weekly} weekly`;
};

// Timestamp to readable: "2 min ago"
export const formatTimeAgo = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

// Screen time formatter: HH:MM:SS
export const formatScreenTime = (totalMs: number): string => {
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Call end timestamp
export const formatCallTime = (startTime: number, endTime?: number): string => {
  const duration = endTime ? endTime - startTime : Date.now() - startTime;
  return formatDuration(Math.floor(duration / 1000));
};