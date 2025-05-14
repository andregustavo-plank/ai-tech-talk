/**
 * Date utility functions for common date operations
 */

/**
 * Formats a date to a string using specified format
 * @param date The date to format
 * @param format The format string (e.g., 'YYYY-MM-DD')
 */
export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Adds specified number of days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Returns the difference between two dates in days
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Returns start of the day for a given date
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Returns end of the day for a given date
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Checks if a date is within a range
 */
export const isWithinRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

/**
 * Returns the age given a birth date
 */
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Gets relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date The date to compare
 * @returns Relative time string
 */
export const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const absoluteDiff = Math.abs(diffInSeconds);

  if (absoluteDiff < 60) {
    return diffInSeconds > 0 ? 'in a few seconds' : 'a few seconds ago';
  } else if (absoluteDiff < 3600) {
    const minutes = Math.floor(absoluteDiff / 60);
    return diffInSeconds > 0 ? `in ${minutes} minutes` : `${minutes} minutes ago`;
  } else if (absoluteDiff < 86400) {
    const hours = Math.floor(absoluteDiff / 3600);
    return diffInSeconds > 0 ? `in ${hours} hours` : `${hours} hours ago`;
  } else {
    const days = Math.floor(absoluteDiff / 86400);
    return diffInSeconds > 0 ? `in ${days} days` : `${days} days ago`;
  }
}; 