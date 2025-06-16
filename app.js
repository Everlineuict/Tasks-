document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');
    
    // Sample tasks data
    let tasks = [
        {
            id: 1,
            title: 'Complete UI design project',
            description: 'Finish the task manager app UI design and send for review',
            dueDate: '2023-06-20',
            priority: 'high',
            project: 'work',
            completed: false
        },
        {
            id: 2,
            title: 'Buy groceries',
            description: 'Milk, eggs, bread, fruits, and vegetables',
            dueDate: '2023-06-18',
            priority: 'medium',
            project: 'personal',
            completed: false
        },
        {
            id: 3,
            title: 'Morning jog',
            description: '30 minutes around the park',
            dueDate: '2023-06-17',
            priority: 'low',
            project: 'health',
            completed: true
        }
    ];
    
    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
            
            const dueDate = new Date(task.dueDate);
            const formattedDate = dueDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            taskCard.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-actions">
                        <button class="btn-icon edit-task" data-id="${task.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-task" data-id="${task.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="task-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    <span><i class="fas fa-project-diagram"></i> ${task.project.charAt(0).toUpperCase() + task.project.slice(1)}</span>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-footer">
                    <span class="task-tag">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
                    <label class="task-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                        ${task.completed ? 'Completed' : 'Mark Complete'}
                    </label>
                </div>
            `;
            
            taskList.appendChild(taskCard);
        });
        
        // Add event listeners to dynamically created elements
        document.querySelectorAll('.edit-task').forEach(btn => {
            btn.addEventListener('click', handleEditTask);
        });
        
        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', handleDeleteTask);
        });
        
        document.querySelectorAll('.task-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', handleTaskCompletion);
        });
    }
    
    // Handle task completion toggle
    function handleTaskCompletion(e) {
        const taskId = parseInt(e.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = e.target.checked;
            renderTasks();
        }
    }
    
    // Handle task deletion
    function handleDeleteTask(e) {
        const taskId = parseInt(e.target.closest('button').dataset.id);
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
    }
    
    // Handle task editing
    function handleEditTask(e) {
        const taskId = parseInt(e.target.closest('button').dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            // Fill the form with task data
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description;
            document.getElementById('task-due-date').value = task.dueDate;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-project').value = task.project;
            
            // Change the form to edit mode
            taskForm.dataset.mode = 'edit';
            taskForm.dataset.id = taskId;
            
            // Update the modal title
            document.querySelector('#task-modal h2').textContent = 'Edit Task';
            
            // Show the modal
            taskModal.style.display = 'flex';
        }
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const dueDate = document.getElementById('task-due-date').value;
        const priority = document.getElementById('task-priority').value;
        const project = document.getElementById('task-project').value;
        
        if (!title) {
            alert('Task title is required');
            return;
        }
        
        if (taskForm.dataset.mode === 'edit') {
            // Update existing task
            const taskId = parseInt(taskForm.dataset.id);
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title,
                    description,
                    dueDate,
                    priority,
                    project
                };
            }
        } else {
            // Add new task
            const newTask = {
                id: Date.now(), // Simple ID generation
                title,
                description,
                dueDate,
                priority,
                project,
                completed: false
            };
            
            tasks.unshift(newTask);
        }
        
        // Reset form and close modal
        taskForm.reset();
        taskModal.style.display = 'none';
        delete taskForm.dataset.mode;
        delete taskForm.dataset.id;
        
        // Re-render tasks
        renderTasks();
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', () => {
        document.querySelector('#task-modal h2').textContent = 'Add New Task';
        taskModal.style.display = 'flex';
    });
    
    closeBtn.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            taskModal.style.display = 'none';
        }
    });
    
    taskForm.addEventListener('submit', handleFormSubmit);
    
    // Filter tasks (example - would need more implementation)
    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', function() {
            document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            // Here you would implement actual filtering logic
        });
    });
    
    // Initial render
    renderTasks();
});
