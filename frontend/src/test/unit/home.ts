import { formatDate, getToday, getTomorrow, parseDate } from '../../main/utils/dateUtils';
import dayjs from 'dayjs';

describe('Date Helper Functions', () => {
  describe('formatDate', () => {
    it('should return N/A for null date', () => {
      expect(formatDate(null)).toBe('N/A');
    });

    it('should format date string to DD/MM/YYYY', () => {
      const result = formatDate('2026-03-19T14:49:10.526');
      expect(result).toBe('19/03/2026');
    });
  });

  describe('getToday', () => {
    it('should return today date parts', () => {
      const result = getToday();
      const today = dayjs();
      
      expect(result.day).toBe(today.format('DD'));
      expect(result.month).toBe(today.format('MM'));
      expect(result.year).toBe(today.format('YYYY'));
    });

    it('should return display format DD/MM/YYYY', () => {
      const result = getToday();
      expect(result.display).toBe(dayjs().format('DD/MM/YYYY'));
    });
  });

  describe('getTomorrow', () => {
    it('should return tomorrow date parts', () => {
      const result = getTomorrow();
      const tomorrow = dayjs().add(1, 'day');
      
      expect(result.day).toBe(tomorrow.format('DD'));
      expect(result.month).toBe(tomorrow.format('MM'));
      expect(result.year).toBe(tomorrow.format('YYYY'));
    });
  });

  describe('parseDate', () => {
    it('should return null when all fields are empty', () => {
      expect(parseDate('', '', '')).toBeNull();
    });

    it('should return null when day is missing', () => {
      expect(parseDate('', '03', '2026')).toBeNull();
    });

    it('should return null when month is missing', () => {
      expect(parseDate('19', '', '2026')).toBeNull();
    });

    it('should return null when year is missing', () => {
      expect(parseDate('19', '03', '')).toBeNull();
    });

    it('should parse valid date to ISO string', () => {
      const result = parseDate('19', '03', '2026');
      expect(result).toBe('2026-03-19');
    });
  });
});

describe('Task Status Counts', () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', status: 'Open', dueDate: null, createdDate: '' },
    { id: 2, title: 'Task 2', status: 'Open', dueDate: null, createdDate: '' },
    { id: 3, title: 'Task 3', status: 'In Progress', dueDate: null, createdDate: '' },
    { id: 4, title: 'Task 4', status: 'Completed', dueDate: null, createdDate: '' },
  ];

  it('should count open tasks correctly', () => {
    const openCount = mockTasks.filter(t => t.status === 'Open').length;
    expect(openCount).toBe(2);
  });

  it('should count in progress tasks correctly', () => {
    const inProgressCount = mockTasks.filter(t => t.status === 'In Progress').length;
    expect(inProgressCount).toBe(1);
  });

  it('should count completed tasks correctly', () => {
    const completedCount = mockTasks.filter(t => t.status === 'Completed').length;
    expect(completedCount).toBe(1);
  });

  it('should filter out completed tasks', () => {
    const activeTasks = mockTasks.filter(t => t.status !== 'Completed');
    expect(activeTasks.length).toBe(3);
  });
});

describe('Task Validation', () => {
  const validateTask = (title: string): Record<string, { text: string }> => {
    const errors: Record<string, { text: string }> = {};
    if (!title || title.trim() === '') {
      errors.title = { text: 'Title is required' };
    }
    return errors;
  };

  it('should return error when title is empty', () => {
    const errors = validateTask('');
    expect(errors.title).toBeDefined();
    expect(errors.title.text).toBe('Title is required');
  });

  it('should return error when title is only whitespace', () => {
    const errors = validateTask('   ');
    expect(errors.title).toBeDefined();
  });

  it('should return no errors for valid title', () => {
    const errors = validateTask('Valid Task Title');
    expect(errors.title).toBeUndefined();
  });
});
