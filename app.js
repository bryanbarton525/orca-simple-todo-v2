const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const addForm = document.getElementById('add-form');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function render() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        if (todo.done) li.classList.add('completed');
        const toggle = document.createElement('button');
        toggle.textContent = todo.done ? 'Undo' : 'Done';
        toggle.onclick = () => {
            todo.done = !todo.done;
            save();
            render();
        };
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.onclick = () => {
            todos.splice(index, 1);
            save();
            render();
        };
        li.appendChild(toggle);
        li.appendChild(del);
        todoList.appendChild(li);
    });
}

function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    save();
    todoInput.value = '';
    render();
});

render();