document.addEventListener('DOMContentLoaded', loadTasks);

const form = document.getElementById('formulário_de_preenchimento');
const taskTable = document.getElementById('tabela_de_tarefas').getElementsByTagName('tbody')[0];
const message = document.getElementById('message');
const taskCount = document.getElementById('contagem_de_tarefas');

form.addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();
    
    const task = document.getElementById('tarefa').value;
    const dueDate = document.getElementById('data_de_conclusao').value;

    const taskObj = {
        id: Date.now(),
        task: task,
        dueDate: dueDate
    };

    let tasks = getTasksFromStorage();
    tasks.push(taskObj);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTasks();
    showTemporaryMessage('Tarefa adicionada com sucesso!');
    form.reset();
}

function displayTasks() {
    const tasks = getTasksFromStorage();
    taskTable.innerHTML = '';
    
    tasks.forEach(task => {
        const row = taskTable.insertRow();
        row.setAttribute('data-id', task.id);
        
        const taskCell = row.insertCell(0);
        taskCell.textContent = task.task;
        
        const dateCell = row.insertCell(1);
        dateCell.textContent = task.dueDate;

        const actionCell = row.insertCell(2);
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => editTask(task.id));
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        deleteButton.classList.add('hidden');
        
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.addEventListener('mouseenter', () => deleteButton.classList.remove('hidden'));
        row.addEventListener('mouseleave', () => deleteButton.classList.add('hidden'));
    });

    taskCount.textContent = tasks.length;
}

function getTasksFromStorage() {
    let tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
    displayTasks();
}

function editTask(id) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(task => task.id === id);

    document.getElementById('tarefa').value = task.task;
    document.getElementById('data_de_conclusao').value = task.dueDate;

    deleteTask(id);
}

function deleteTask(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function showTemporaryMessage(msg) {
    message.textContent = msg;
    message.classList.remove('hidden');
    setTimeout(() => {
        message.classList.add('hidden');
    }, 3000);
}
