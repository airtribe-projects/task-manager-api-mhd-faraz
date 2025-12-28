const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data storage - starting with initial tasks
let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true
  },
  {
    id: 2,
    title: "Create a new project",
    description: "Create a new project using the Express application generator",
    completed: true
  },
  {
    id: 3,
    title: "Install nodemon",
    description: "Install nodemon as a development dependency",
    completed: true
  }
];

// Counter for generating unique IDs
let nextId = 4;

// Validation middleware for task creation
const validateTask = (req, res, next) => {
  const { title, description } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ 
      error: 'Title is required and must be a non-empty string' 
    });
  }
  
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ 
      error: 'Description is required and must be a non-empty string' 
    });
  }
  
  next();
};

// ===== ROUTES =====

// GET /tasks - Retrieve all tasks
// Optional query parameters: completed (boolean filter)
app.get('/tasks', (req, res) => {
  try {
    const { completed } = req.query;
    
    let filteredTasks = tasks;
    
    // Filter by completion status if provided
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      filteredTasks = tasks.filter(task => task.completed === isCompleted);
    }
    
    res.status(200).json(filteredTasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /tasks/:id - Retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /tasks - Create a new task
app.post('/tasks', validateTask, (req, res) => {
  try {
    const { title, description, completed = false } = req.body;
    
    const newTask = {
      id: nextId++,
      title: title.trim(),
      description: description.trim(),
      completed: Boolean(completed)
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const { title, description, completed } = req.body;
    
    // Validate at least one field is provided
    if (title === undefined && description === undefined && completed === undefined) {
      return res.status(400).json({ 
        error: 'At least one field (title, description, or completed) must be provided' 
      });
    }
    
    // Validate title if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ 
        error: 'Title must be a non-empty string' 
      });
    }
    
    // Validate description if provided
    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
      return res.status(400).json({ 
        error: 'Description must be a non-empty string' 
      });
    }
    
    // Validate completed if provided
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ 
        error: 'Completed must be a boolean' 
      });
    }
    
    // Update the task
    if (title !== undefined) {
      tasks[taskIndex].title = title.trim();
    }
    if (description !== undefined) {
      tasks[taskIndex].description = description.trim();
    }
    if (completed !== undefined) {
      tasks[taskIndex].completed = Boolean(completed);
    }
    
    res.status(200).json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only if not in test mode
if (require.main === module) {
  app.listen(port, (err) => {
    if (err) {
      return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
  });
}

module.exports = app;