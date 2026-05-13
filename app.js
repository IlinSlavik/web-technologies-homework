// API endpoints
const API_BASE = 'https://jsonplaceholder.typicode.com';

// Функция для обработки ответа от API
async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Асинхронный запрос для получения всех постов
async function fetchPosts() {
    try {
        console.log('Загрузка постов с API...');
        const response = await fetch(`${API_BASE}/posts`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Посты загружены:', data.length);
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке постов:', error);
        throw new Error(`Не удалось загрузить список постов: ${error.message}`);
    }
}

// Асинхронный запрос для получения одного поста по ID
async function fetchPostById(postId) {
    try {
        const response = await fetch(`${API_BASE}/posts/${postId}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Ошибка при загрузке поста ${postId}:`, error);
        throw new Error(`Не удалось загрузить пост с ID ${postId}: ${error.message}`);
    }
}

// Асинхронный запрос для получения комментариев к посту
async function fetchCommentsByPostId(postId) {
    try {
        const response = await fetch(`${API_BASE}/posts/${postId}/comments`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Ошибка при загрузке комментариев к посту ${postId}:`, error);
        throw new Error(`Не удалось загрузить комментарии к посту ${postId}: ${error.message}`);
    }
}

// Функция для рендеринга списка постов
function renderPostList(posts, container) {
    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="error">Нет доступных постов</div>';
        return;
    }

    const postsHtml = `
        <h1>Список постов</h1>
        <p>Всего постов: ${posts.length}</p>
        <div class="post-list">
            ${posts.map(post => `
                <div class="post-item" onclick="navigateToPost(${post.id})">
                    <div class="post-title">${escapeHtml(post.title)}</div>
                    <div class="post-body">${escapeHtml(post.body)}</div>
                </div>
            `).join('')}
        </div>
    `;
    container.innerHTML = postsHtml;
}

// Функция для рендеринга детальной страницы поста с комментариями
async function renderPostDetail(postId, container) {
    container.innerHTML = '<div class="loading">Загрузка поста и комментариев...</div>';
    
    try {
        // Загружаем пост и комментарии параллельно
        const [post, comments] = await Promise.all([
            fetchPostById(postId),
            fetchCommentsByPostId(postId)
        ]);

        const postHtml = `
            <button class="back-link" onclick="loadPostsList(event)">← Назад к списку постов</button>
            <div class="post-detail">
                <h1>${escapeHtml(post.title)}</h1>
                <p>${escapeHtml(post.body)}</p>
                <hr>
                <h2>Комментарии (${comments.length})</h2>
                <div class="comments-list">
                    ${comments.map(comment => `
                        <div class="comment-item">
                            <div class="comment-name">${escapeHtml(comment.name)}</div>
                            <div class="comment-email">${escapeHtml(comment.email)}</div>
                            <div class="comment-body">${escapeHtml(comment.body)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML = postHtml;
        
        // Обновляем hash в URL без перезагрузки страницы (работает с file://)
        window.location.hash = `post-${postId}`;
    } catch (error) {
        container.innerHTML = `
            <button class="back-link" onclick="loadPostsList(event)">← Назад к списку постов</button>
            <div class="error">
                <strong>Ошибка загрузки:</strong> ${escapeHtml(error.message)}
            </div>
        `;
    }
}

// Функция для загрузки и отображения списка постов
async function loadPostsList(event) {
    if (event && event.preventDefault) event.preventDefault();
    
    const container = document.getElementById('app');
    container.innerHTML = '<div class="loading">Загрузка списка постов...</div>';
    
    try {
        const posts = await fetchPosts();
        renderPostList(posts, container);
        
        // Очищаем hash в URL
        window.location.hash = '';
    } catch (error) {
        console.error('Ошибка в loadPostsList:', error);
        container.innerHTML = `
            <div class="error">
                <strong>Ошибка загрузки постов:</strong> ${escapeHtml(error.message)}
                <br><br>
                <button class="retry-button" onclick="loadPostsList()">Повторить попытку</button>
            </div>
        `;
    }
}

// Функция для навигации к посту
function navigateToPost(postId) {
    renderPostDetail(postId, document.getElementById('app'));
}

// Вспомогательная функция для экранирования HTML (защита от XSS)
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Обработчик изменения hash в URL
function handleRouteChange() {
    const hash = window.location.hash.slice(1); // убираем #
    
    if (hash && hash.startsWith('post-')) {
        const postId = parseInt(hash.split('-')[1]);
        if (!isNaN(postId)) {
            renderPostDetail(postId, document.getElementById('app'));
        } else {
            loadPostsList();
        }
    } else {
        loadPostsList();
    }
}

// Инициализация приложения
function init() {
    console.log('Приложение запущено');
    
    // Проверяем доступность API
    fetch(`${API_BASE}/posts/1`)
        .then(() => console.log('API доступен'))
        .catch(err => console.error('API недоступен:', err));
    
    handleRouteChange();
    
    // Обработчик событий для изменения hash (кнопки назад/вперед)
    window.addEventListener('hashchange', handleRouteChange);
}

// Делаем функции глобальными для доступа из onclick
window.navigateToPost = navigateToPost;
window.loadPostsList = loadPostsList;

// Запуск приложения после полной загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}