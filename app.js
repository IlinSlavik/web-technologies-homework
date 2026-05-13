const API_URL = 'https://jsonplaceholder.typicode.com';

let currentUser = null;
let currentTodos = [];

async function register(email, password) {
    try {
        const users = JSON.parse(localStorage.getItem('todo_users') || '[]');
        
        if (users.find(u => u.email === email)) {
            throw new Error('Пользователь с таким email уже существует');
        }
        
        const newUser = {
            id: Date.now(),
            email: email,
            password: btoa(password) 
        };
        
        users.push(newUser);
        localStorage.setItem('todo_users', JSON.stringify(users));
        
        localStorage.setItem(`todos_${newUser.id}`, JSON.stringify([]));
        
        currentUser = { id: newUser.id, email: newUser.email };
        localStorage.setItem('todo_currentUser', JSON.stringify(currentUser));
        
        currentTodos = [];
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function login(email, password) {
    try {
        const users = JSON.parse(localStorage.getItem('todo_users') || '[]');
        const user = users.find(u => u.email === email && atob(u.password) === password);
        
        if (!user) {
            throw new Error('Неверный email или пароль');
        }
        
        currentUser = { id: user.id, email: user.email };
        localStorage.setItem('todo_currentUser', JSON.stringify(currentUser));
        
        const savedTodos = localStorage.getItem(`todos_${currentUser.id}`);
        currentTodos = savedTodos ? JSON.parse(savedTodos) : [];
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function logout() {
    currentUser = null;
    currentTodos = [];
    localStorage.removeItem('todo_currentUser');
    render();
}

function checkAuth() {
    const savedUser = localStorage.getItem('todo_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);

        const savedTodos = localStorage.getItem(`todos_${currentUser.id}`);
        currentTodos = savedTodos ? JSON.parse(savedTodos) : [];
        return true;
    }
    return false;
}


async function fetchTodos() {
    try {
        
        const savedTodos = localStorage.getItem(`todos_${currentUser.id}`);
        currentTodos = savedTodos ? JSON.parse(savedTodos) : [];
        return currentTodos;
    } catch (error) {
        console.error('Ошибка при загрузке todos:', error);
        throw error;
    }
}

async function addTodo(title) {
    try {
        const newTodo = {
            id: Date.now(),
            title: title,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        currentTodos.unshift(newTodo);
        localStorage.setItem(`todos_${currentUser.id}`, JSON.stringify(currentTodos));
        
        return newTodo;
    } catch (error) {
        console.error('Ошибка при добавлении todo:', error);
        throw error;
    }
}

async function toggleTodoStatus(todoId, currentStatus) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const todoIndex = currentTodos.findIndex(t => t.id === todoId);
        if (todoIndex !== -1) {
            currentTodos[todoIndex].completed = !currentStatus;
            localStorage.setItem(`todos_${currentUser.id}`, JSON.stringify(currentTodos));
        }
        
        return true;
    } catch (error) {
        console.error('Ошибка при изменении статуса:', error);
        throw error;
    }
}

async function deleteTodo(todoId) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        currentTodos = currentTodos.filter(t => t.id !== todoId);
        localStorage.setItem(`todos_${currentUser.id}`, JSON.stringify(currentTodos));
        
        return true;
    } catch (error) {
        console.error('Ошибка при удалении todo:', error);
        throw error;
    }
}

async function editTodo(todoId, newTitle) {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const todoIndex = currentTodos.findIndex(t => t.id === todoId);
        if (todoIndex !== -1) {
            currentTodos[todoIndex].title = newTitle;
            localStorage.setItem(`todos_${currentUser.id}`, JSON.stringify(currentTodos));
        }
        
        return true;
    } catch (error) {
        console.error('Ошибка при редактировании todo:', error);
        throw error;
    }
}

function renderAuthForm(isLogin = true) {
    const app = document.getElementById('app');
    const errorMessage = sessionStorage.getItem('todo_authError');
    
    app.innerHTML = `
        <div class="auth-container">
            <h2>${isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
            ${errorMessage ? `<div class="error-message">${errorMessage}</div>` : ''}
            <form id="auth-form">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required autocomplete="off">
                </div>
                <div class="form-group">
                    <label>Пароль</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="btn">${isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
            </form>
            <div class="switch-auth">
                ${isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'} 
                <a onclick="window.toggleAuthMode(${!isLogin})">${isLogin ? 'Зарегистрироваться' : 'Войти'}</a>
            </div>
        </div>
    `;
    
    const form = document.getElementById('auth-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        sessionStorage.removeItem('todo_authError');
        
        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            result = await register(email, password);
        }
        
        if (result.success) {
            render();
        } else {
            sessionStorage.setItem('todo_authError', result.error);
            renderAuthForm(isLogin);
        }
    });
}

function renderTodoList() {
    if (currentTodos.length === 0) {
        return '<div class="empty-state">✨ Нет задач. Добавьте первую задачу!</div>';
    }
    
    return currentTodos.map(todo => `
        <div class="todo-item" data-id="${todo.id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="window.handleToggleStatus(${todo.id}, ${todo.completed})"
            >
            <div class="todo-text ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.title)}</div>
            <div class="todo-actions">
                <button class="btn edit-btn" onclick="window.openEditModal(${todo.id}, '${escapeHtml(todo.title)}')">✏️</button>
                <button class="btn delete-btn" onclick="window.handleDeleteTodo(${todo.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function render() {
    if (!checkAuth()) {
        renderAuthForm(true);
        return;
    }
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="todo-app">
            <div class="todo-header">
                <h1>📝 Мои задачи</h1>
                <p>Управляйте своими делами эффективно</p>
            </div>
            <div class="user-info">
                <span class="user-email">${escapeHtml(currentUser.email)}</span>
                <button class="btn logout-btn" onclick="window.logout()">Выйти</button>
            </div>
            <div class="add-todo-form">
                <input type="text" id="todo-title" placeholder="Что нужно сделать?..." onkeypress="window.handleAddTodoKeypress(event)">
                <button class="btn" onclick="window.handleAddTodo()">Добавить</button>
            </div>
            <div id="todo-list-container" class="todo-list">
                ${renderTodoList()}
            </div>
        </div>
    `;
}

window.toggleAuthMode = (isLogin) => {
    renderAuthForm(isLogin);
};

window.handleAddTodo = async () => {
    const input = document.getElementById('todo-title');
    const title = input.value.trim();
    
    if (!title) {
        alert('Введите текст задачи');
        return;
    }
    
    try {
        await addTodo(title);
        input.value = '';
        const container = document.getElementById('todo-list-container');
        if (container) {
            container.innerHTML = renderTodoList();
        }
    } catch (error) {
        alert('Ошибка при добавлении задачи: ' + error.message);
    }
};

window.handleAddTodoKeypress = (event) => {
    if (event.key === 'Enter') {
        window.handleAddTodo();
    }
};

window.handleToggleStatus = async (todoId, currentStatus) => {
    const checkbox = event.target;
    
    try {
        checkbox.disabled = true;
        
        await toggleTodoStatus(todoId, currentStatus);
        
        const container = document.getElementById('todo-list-container');
        if (container) {
            container.innerHTML = renderTodoList();
        }
    } catch (error) {
        alert('Ошибка при изменении статуса: ' + error.message);
        checkbox.disabled = false;
        checkbox.checked = currentStatus;
    }
};

window.handleDeleteTodo = async (todoId) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
        return;
    }
    
    try {
        await deleteTodo(todoId);
        const container = document.getElementById('todo-list-container');
        if (container) {
            container.innerHTML = renderTodoList();
        }
    } catch (error) {
        alert('Ошибка при удалении задачи: ' + error.message);
    }
};

window.openEditModal = (todoId, currentTitle) => {
    const modalHtml = `
        <div class="modal" id="edit-modal">
            <div class="modal-content">
                <h3>Редактировать задачу</h3>
                <div class="form-group">
                    <input type="text" id="edit-title" value="${currentTitle}" autofocus>
                </div>
                <div class="modal-actions">
                    <button class="btn" onclick="window.handleEditTodo(${todoId})">Сохранить</button>
                    <button class="btn btn-secondary" onclick="window.closeModal()">Отмена</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('edit-modal')) {
            window.closeModal();
        }
    });
};

window.handleEditTodo = async (todoId) => {
    const newTitle = document.getElementById('edit-title').value.trim();
    
    if (!newTitle) {
        alert('Введите текст задачи');
        return;
    }
    
    try {
        await editTodo(todoId, newTitle);
        window.closeModal();
        const container = document.getElementById('todo-list-container');
        if (container) {
            container.innerHTML = renderTodoList();
        }
    } catch (error) {
        alert('Ошибка при редактировании: ' + error.message);
    }
};

window.closeModal = () => {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.remove();
    }
};

window.logout = () => {
    logout();
};

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    render();
});