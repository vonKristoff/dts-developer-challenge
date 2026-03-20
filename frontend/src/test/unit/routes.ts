import { app } from '../../main/app';
import request from 'supertest';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Home page', () => {
  describe('on GET /', () => {
    it('should return 200 with dashboard', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Task 1', status: 'Open', dueDate: null, createdDate: '' },
          { id: 2, title: 'Task 2', status: 'Completed', dueDate: null, createdDate: '' }
        ]
      });

      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Task Dashboard');
    });

    it('should show task counts', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Task 1', status: 'Open', dueDate: null, createdDate: '' },
          { id: 2, title: 'Task 2', status: 'In Progress', dueDate: null, createdDate: '' }
        ]
      });

      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Total');
      expect(res.text).toContain('Open');
      expect(res.text).toContain('In Progress');
    });

    it('should render create button', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Create new task');
    });
  });
});

describe('Tasks page', () => {
  describe('on GET /tasks', () => {
    it('should return 200 with tasks list', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          { id: 1, title: 'Test Task', status: 'Open', dueDate: '2026-03-20', createdDate: '2026-03-19' }
        ]
      });

      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.text).toContain('All Tasks');
    });

    it('should show no tasks message when empty', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
    });
  });
});

describe('Create task page', () => {
  describe('on GET /tasks/new', () => {
    it('should return 200 with create form', async () => {
      const res = await request(app).get('/tasks/new');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Create New Task');
    });
  });

  describe('on POST /tasks/new', () => {
    it('should redirect after successful creation', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });

      const res = await request(app)
        .post('/tasks/new')
        .send({ title: 'New Task', 'dueDate-day': '20', 'dueDate-month': '03', 'dueDate-year': '2026', status: 'Open' });
      
      expect(res.status).toBe(302);
    });

    it('should show error when title is missing', async () => {
      const res = await request(app)
        .post('/tasks/new')
        .send({ title: '', 'dueDate-day': '20', 'dueDate-month': '03', 'dueDate-year': '2026', status: 'Open' });
      
      expect(res.status).toBe(200);
      expect(res.text).toContain('Title is required');
    });

    it('should show error when due date is missing', async () => {
      const res = await request(app)
        .post('/tasks/new')
        .send({ title: 'Test Task', 'dueDate-day': '', 'dueDate-month': '', 'dueDate-year': '', status: 'Open' });
      
      expect(res.status).toBe(200);
      expect(res.text).toContain('Due date is required');
    });
  });
});

describe('Edit task page', () => {
  describe('on GET /tasks/:id/edit', () => {
    it('should return 200 with edit form', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { id: 1, title: 'Test Task', status: 'Open', dueDate: '2026-03-20', createdDate: '2026-03-19' }
      });

      const res = await request(app).get('/tasks/1/edit');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Edit Task');
    });
  });

  describe('on POST /tasks/:id/edit', () => {
    it('should redirect after successful update', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { id: 1 } });
      mockedAxios.put.mockResolvedValueOnce({ data: { id: 1 } });

      const res = await request(app)
        .post('/tasks/1/edit')
        .send({ title: 'Updated Task', 'dueDate-day': '20', 'dueDate-month': '03', 'dueDate-year': '2026', status: 'Open' });
      
      expect(res.status).toBe(302);
    });

    it('should show error when title is missing', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { id: 1 } });

      const res = await request(app)
        .post('/tasks/1/edit')
        .send({ title: '', 'dueDate-day': '20', 'dueDate-month': '03', 'dueDate-year': '2026', status: 'Open' });
      
      expect(res.status).toBe(200);
      expect(res.text).toContain('Title is required');
    });
  });
});

describe('Delete task', () => {
  describe('on POST /tasks/:id/delete', () => {
    it('should redirect after deletion', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ status: 204 });

      const res = await request(app).post('/tasks/1/delete');
      expect(res.status).toBe(302);
    });
  });
});
