// src/utils/timeUtils.ts
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { enIN } from 'date-fns/locale';

export const formatChatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'hh:mm a', { locale: enIN });
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM dd', { locale: enIN });
  }
};

export const formatCallDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatDateFull = (timestamp: string): string => {
  return format(new Date(timestamp), 'MMM dd, yyyy h:mm a', { locale: enIN });
};

export const timeAgo = (timestamp: string): string => {
  return formatDistanceToNow(new Date(timestamp), { 
    addSuffix: true, 
    locale: enIN 
  });
};

export const isRecentMessage = (timestamp: string): boolean => {
  const now = new Date().getTime();
  const messageTime = new Date(timestamp).getTime();
  return (now - messageTime) < 5 * 60 * 1000; // 5 minutes
};

export const getTimeStatus = (timestamp: string): 'today' | 'yesterday' | 'older' => {
  const date = new Date(timestamp);
  if (isToday(date)) return 'today';
  if (isYesterday(date)) return 'yesterday';
  return 'older';
};