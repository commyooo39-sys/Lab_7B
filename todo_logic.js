const taskForm = document.getElementById('task-form')
const Title = document.getElementById('task-title')
const Priority = document.getElementById('prioLity')
const listTask = document.getElementById('list-task')
const initialTasks = [
    { id: 1, title: 'A', completed: false, priority: '' },
    { id: 2, title: 'B', completed: false, priority: '' },
    { id: 3, title: 'C', completed: false, priority: '' }
];

let tasks = typeof localStorage !== 'undefined' && localStorage.getItem('tasks') !== null
    ? JSON.parse(localStorage.getItem('tasks'))
    : initialTasks;

const saveTasks = () => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
};

function displayError(message) {
    console.error(message);
}

const addTask = (Title, Priority) => {

    if (typeof Title.value !== 'string') {
        return displayError('Title must be a string.');
    }

    const trimmedTitle = Title.value.trim();
    if (trimmedTitle.length === 0 || trimmedTitle.length > 100) {
        return displayError('Title must be between 1 and 100 characters.');
    }

    const newTask = {
        id: tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1,
        title: trimmedTitle,
        completed: false,
        priority: Priority.value
    };

    tasks.push(newTask);
    console.log(`Added task: ${JSON.stringify(newTask)}`);
    saveTasks();
    console.log(`Current tasks: ${JSON.stringify(tasks)}`);
};

const toggleTask = (id) => {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTask(tasks)
    console.log(`เปลี่ยนสถานะ Completed: ${tasks.find(task => task.id === id)?.title} เรียบร้อย`);
    console.log(tasks.find(task => task.id === id));
};

const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTask(tasks)
    console.log(`Deleted task with ID: ${id}`);
    console.log(`Current tasks: ${JSON.stringify(tasks)}`);
}

const renderTask = (tasks) => {
    listTask.innerHTML = ''
    tasks.forEach((todos) => {
        const li = document.createElement('li')
        const details = document.createElement('div')
        details.className = 'task-details'

        const fields = [
            ['ID :', todos.id],
            ['Title :', todos.title],
            ['Status :', todos.completed ? 'Completed' : 'Pending'],
            ['Priorlity :', todos.priority || 'Not set']
        ]

        fields.forEach(([property, value]) => {
            const field = document.createElement('div')
            field.className = 'task-field'

            const propertyLabel = document.createElement('span')
            propertyLabel.className = 'task-property'
            propertyLabel.textContent = property

            const propertyValue = document.createElement('span')
            propertyValue.className = 'task-value'
            propertyValue.textContent = value
            if (property === 'Status :' && todos.completed) {
                propertyValue.classList.add('is-completed')
            }
            if (property === 'Priorlity :' ) {
                if (todos.priority ===  'high')
                    propertyValue.classList.add('high')
                if (todos.priority ===  'medium')
                    propertyValue.classList.add('medium')
                if (todos.priority ===  'low')
                    propertyValue.classList.add('low')
                
            }

            field.appendChild(propertyLabel)
            field.appendChild(propertyValue)
            details.appendChild(field)
        })

        const actions = document.createElement('div')
        actions.className = 'task-actions'
        const toggleBtn = document.createElement('button')
        toggleBtn.textContent = todos.completed ? 'Mark pending' : 'Complete'
        toggleBtn.addEventListener('click', () => {
            toggleTask(todos.id)

        })
        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = '❌'
        deleteBtn.addEventListener('click', () => {
            deleteTask(todos.id)
        })
        actions.appendChild(toggleBtn)
        actions.appendChild(deleteBtn)
        li.appendChild(details)
        li.appendChild(actions)
        listTask.appendChild(li)
    });

}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addTask(Title, Priority)
    renderTask(tasks)



})

renderTask(tasks)