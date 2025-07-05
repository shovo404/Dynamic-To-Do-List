// Task type definition (for documentation)
/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 * @property {Date} createdAt
 */

// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskForm = document.getElementById('add-task-form');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const activeCount = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');
const toast = document.getElementById('toast');
const toastMessage = toast.querySelector('.toast-message');

// State
/** @type {Task[]} */
let tasks = [];

// Load tasks from localStorage
const loadTasks = () => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    try {
      const parsedTasks = JSON.parse(savedTasks);
      // Convert string dates back to Date objects
      tasks = parsedTasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      updateTaskCounts();
      renderTasks();
    } catch (error) {
      console.error('Failed to parse tasks from localStorage', error);
    }
  }
};

// Save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  updateTaskCounts();
};

// Update task counts
const updateTaskCounts = () => {
  const active = tasks.filter(task => !task.completed).length;
  const completed = tasks.filter(task => task.completed).length;
  
  activeCount.textContent = active;
  completedCount.textContent = completed;
};

// Show toast notification
const showToast = (message, isError = false) => {
  toastMessage.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

// Add new task
const addTask = (text) => {
  const newTask = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: new Date()
  };
  
  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  showToast('Task added successfully');
};

// Toggle task completion
const toggleTaskComplete = (id) => {
  tasks = tasks.map(task => {
    if (task.id === id) {
      const updated = { ...task, completed: !task.completed };
      showToast(updated.completed ? 'Task completed! 🎉' : 'Task marked as incomplete');
      return updated;
    }
    return task;
  });
  
  saveTasks();
  renderTasks();
};

// Delete task
const deleteTask = (id) => {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  showToast('Task deleted', true);
};

// Create task item element
const createTaskElement = (task) => {
  const taskItem = document.createElement('div');
  taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
  
  const taskItemLeft = document.createElement('div');
  taskItemLeft.className = 'task-item-left';
  
  const checkbox = document.createElement('div');
  checkbox.className = `checkbox ${task.completed ? 'checked' : ''}`;
  checkbox.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  checkbox.addEventListener('click', () => toggleTaskComplete(task.id));
  
  const taskText = document.createElement('label');
  taskText.className = 'task-text';
  taskText.textContent = task.text;
  taskText.addEventListener('click', () => toggleTaskComplete(task.id));
  
  taskItemLeft.appendChild(checkbox);
  taskItemLeft.appendChild(taskText);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  deleteBtn.addEventListener('click', () => deleteTask(task.id));
  
  taskItem.appendChild(taskItemLeft);
  taskItem.appendChild(deleteBtn);
  
  return taskItem;
};

// Render all tasks
const renderTasks = () => {
  // Clear existing tasks (except empty state)
  const taskElements = taskList.querySelectorAll('.task-item');
  taskElements.forEach(el => el.remove());
  
  // Show/hide empty state
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    
    // Add task elements
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });
  }
};

// Event Listeners
taskInput.addEventListener('input', () => {
  addTaskBtn.disabled = !taskInput.value.trim();
});

addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    addTask(text);
    taskInput.value = '';
    addTaskBtn.disabled = true;
  }
});

// Initialize app
loadTasks();