import { Application } from 'express';
import axios from 'axios';
import { formatDate, getToday, getTomorrow, parseDate } from '../utils/dateUtils';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string | null;
  createdDate: string;
}

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      const response = await axios.get<Task[]>('http://localhost:4000/tasks');
      const tasks = response.data;
      
      const counts = {
        total: tasks.length,
        open: tasks.filter(t => t.status === 'Open').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length
      };
      
      res.render('home', { counts });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', { counts: { total: 0, open: 0, inProgress: 0, completed: 0 } });
    }
  });

  app.get('/tasks', async (req, res) => {
    try {
      const response = await axios.get<Task[]>('http://localhost:4000/tasks');
      const tasks = response.data
        .filter(task => task.status !== 'Completed' && task.status !== 'Cancelled')
        .sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        })
        .map(task => ({
          ...task,
          createdDate: formatDate(task.createdDate),
          dueDate: formatDate(task.dueDate)
        }));
      res.render('tasks', { tasks });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('tasks', { tasks: [] });
    }
  });

  app.post('/tasks/:id/delete', async (req, res) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${req.params.id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    res.redirect('/tasks');
  });

  app.get('/tasks/:id/edit', async (req, res) => {
    try {
      const response = await axios.get<Task>(`http://localhost:4000/tasks/${req.params.id}`);
      const task = response.data;
      let dueDateDay = '', dueDateMonth = '', dueDateYear = '';
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        dueDateDay = dueDate.getDate().toString().padStart(2, '0');
        dueDateMonth = pad(dueDate.getMonth() + 1);
        dueDateYear = dueDate.getFullYear().toString();
      }
      const today = getToday();
      res.render('edit', { task, errors: {}, dueDateDay, dueDateMonth, dueDateYear, todayDisplay: today.display });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.redirect('/tasks');
    }
  });

  app.post('/tasks/:id/edit', async (req, res) => {
    const { title, description, status, 'dueDate-day': day, 'dueDate-month': month, 'dueDate-year': year } = req.body;
    const errors: Record<string, { text: string }> = {};

    if (!title || title.trim() === '') {
      errors.title = { text: 'Title is required' };
    }

    if (!day || !month || !year) {
      errors.dueDate = { text: 'Due date is required' };
    }

    if (Object.keys(errors).length > 0) {
      const today = getToday();
      res.render('edit', {
        task: { ...req.body, id: req.params.id },
        errors,
        dueDateDay: day,
        dueDateMonth: month,
        dueDateYear: year,
        todayDisplay: today.display
      });
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/tasks/${req.params.id}`,
        { title, description, status, dueDate: parseDate(day, month, year) }
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
    res.redirect('/tasks');
  });

  app.get('/tasks/new', (req, res) => {
    const tomorrow = getTomorrow();
    const today = getToday();
    res.render('create', { task: {}, errors: {}, dueDateDay: tomorrow.day, dueDateMonth: tomorrow.month, dueDateYear: tomorrow.year, todayDisplay: today.display });
  });

  app.post('/tasks/new', async (req, res) => {
    const { title, description, status, 'dueDate-day': day, 'dueDate-month': month, 'dueDate-year': year } = req.body;
    const errors: Record<string, { text: string }> = {};

    if (!title || title.trim() === '') {
      errors.title = { text: 'Title is required' };
    }

    if (!day || !month || !year) {
      errors.dueDate = { text: 'Due date is required' };
    }

    if (Object.keys(errors).length > 0) {
      const today = getToday();
      res.render('create', {
        task: { title, description, status },
        errors,
        dueDateDay: day,
        dueDateMonth: month,
        dueDateYear: year,
        todayDisplay: today.display
      });
      return;
    }

    try {
      await axios.post(
        'http://localhost:4000/tasks',
        { title, description, status, dueDate: parseDate(day, month, year) }
      );
    } catch (error) {
      console.error('Error creating task:', error);
    }
    res.redirect('/tasks');
  });
}

function pad(num: number): string {
  return num.toString().padStart(2, '0');
}
