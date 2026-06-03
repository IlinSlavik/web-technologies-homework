const API_BASE = 'https://jsonplaceholder.typicode.com';

/**
 * Универсальный асинхронный запрос с обработкой ошибок (только async/await)
 * @param {string} url - полный endpoint
 @returns {Promise<any>} - распарсенный JSON или выброс ошибки
    */
async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} — запрос к ${url} не удался`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        throw new Error(`Ошибка сети или парсинга: ${err.message} (URL: ${url})`);
    }
}

async function fetchAllPosts() {
    const url = `${API_BASE}/posts`;
    return await fetchJson(url);
}

async function fetchPostById(postId) {
    const url = `${API_BASE}/posts/${postId}`;
    return await fetchJson(url);
}

async function fetchCommentsByPostId(postId) {
    const url = `${API_BASE}/posts/${postId}/comments`;
    return await fetchJson(url);
}

const appContainer = document.getElementById('app');

function renderErrorPage(errorMessage) {
    appContainer.innerHTML = `
        <div class="error-banner">
            ⚠️ Не удалось загрузить данные: ${escapeHtml(errorMessage)}
        </div>
        <button class="nav-link" onclick="navigateToHome()">⟳ Попробовать снова / На главную</button>
    `;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

async function renderPostsList() {
    appContainer.innerHTML = `<div class="loading">📡 Загрузка постов... ⏳</div>`;
    try {
        const posts = await fetchAllPosts();
        if (!posts || !posts.length) throw new Error('Посты не найдены');
        // строим HTML
        let postsHtml = `
            <div class="nav-bar">
                <span style="font-weight:500;">🍕 JSONPlaceholder</span>
                <span style="margin-left:auto; font-size:0.85rem;">✅ async/await + комментарии</span>
            </div>
            <h1>📋 Все посты (${posts.length})</h1>
            <div class="posts-grid">
        `;
        for (const post of posts) {
            postsHtml += `
                <div class="post-card">
                    <div class="post-title">${escapeHtml(post.title)}</div>
                    <div class="post-body">${escapeHtml(post.body)}</div>
                    <div class="post-meta">📌 post #${post.id} · userId: ${post.userId}</div>
                    <a class="detail-link" href="#" onclick="navigateToPost(${post.id}); return false;">🔍 Подробнее & комментарии →</a>
                </div>
            `;
        }
        postsHtml += `</div><footer>Источник: jsonplaceholder.typicode.com | Детальная страница с комментариями</footer>`;
        appContainer.innerHTML = postsHtml;
    } catch (error) {
        console.error('Ошибка при загрузке постов:', error);
        renderErrorPage(error.message);
    }
}

async function renderPostDetail(postId) {
    // Показываем загрузку
    appContainer.innerHTML = `<div class="loading">📖 Загружаем пост #${postId} и комментарии...</div>`;
    try {
        const [post, comments] = await Promise.all([
            fetchPostById(postId),
            fetchCommentsByPostId(postId)
        ]);

        if (!post || !post.id) throw new Error(`Пост с ID ${postId} не найден`);

        let commentsHtml = '';
        if (comments && comments.length > 0) {
            commentsHtml = `<div class="comments-section">
                <div class="comments-title">💬 Комментарии (${comments.length})</div>`;
            for (const comment of comments) {
                commentsHtml += `
                    <div class="comment">
                        <div class="comment-email">✉️ ${escapeHtml(comment.email)}</div>
                        <div class="comment-name">📝 ${escapeHtml(comment.name)}</div>
                        <div class="comment-body">${escapeHtml(comment.body)}</div>
                    </div>
                `;
            }
            commentsHtml += `</div>`;
        } else {
            commentsHtml = `<div class="error-banner" style="background:#f0f4fa;">💬 Комментариев к этому посту нет.</div>`;
        }

        const detailHtml = `
            <button class="back-btn" onclick="navigateToHome()">← Назад ко всем постам</button>
            <div class="detail-card">
                <div style="color:#2c6e9e; font-weight:500;">Пост #${post.id} · Автор: user ${post.userId}</div>
                <div class="post-full-title">${escapeHtml(post.title)}</div>
                <div class="post-full-body">${escapeHtml(post.body)}</div>
                <hr />
                ${commentsHtml}
            </div>
            <footer style="margin-top:1rem;">✨ Детальная страница с загрузкой комментариев</footer>
        `;
        appContainer.innerHTML = detailHtml;
    } catch (error) {
        console.error(`Детальная страница postId=${postId} ошибка:`, error);
        renderErrorPage(`Не удалось загрузить пост #${postId} или комментарии: ${error.message}`);
    }
}

function router() {
    const params = new URLSearchParams(window.location.search);
    const postIdParam = params.get('id');
    if (postIdParam) {
        const postId = Number(postIdParam);
        if (!isNaN(postId) && postId > 0) {
            renderPostDetail(postId);
        } else {
            // некорректный id — показываем список с ошибкой внизу
            renderPostsList().then(() => {
                const banner = document.createElement('div');
                banner.className = 'error-banner';
                banner.style.marginTop = '1rem';
                banner.innerText = `⚠️ Некорректный параметр id=${postIdParam}. Показан список постов.`;
                appContainer.prepend(banner);
            }).catch(e=>renderErrorPage(e.message));
        }
    } else {
        renderPostsList();
    }
}

window.navigateToPost = function(postId) {
    const newUrl = `${window.location.pathname}?id=${postId}`;
    window.history.pushState({}, '', newUrl);
    router();
};

window.navigateToHome = function() {
    const newUrl = window.location.pathname;
    window.history.pushState({}, '', newUrl);
    router();
};

window.addEventListener('popstate', () => {
    router();
});

router();