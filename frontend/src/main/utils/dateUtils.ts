import dayjs from 'dayjs';

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return dayjs(dateStr).format('DD/MM/YYYY');
}

export function getToday(): { day: string; month: string; year: string; display: string } {
  const today = dayjs();
  return {
    day: today.format('DD'),
    month: today.format('MM'),
    year: today.format('YYYY'),
    display: today.format('DD/MM/YYYY')
  };
}

export function getTomorrow(): { day: string; month: string; year: string } {
  const tomorrow = dayjs().add(1, 'day');
  return {
    day: tomorrow.format('DD'),
    month: tomorrow.format('MM'),
    year: tomorrow.format('YYYY')
  };
}

export function parseDate(day: string, month: string, year: string): string | null {
  if (!day && !month && !year) return null;
  if (!year || !month || !day) return null;
  return dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
}
