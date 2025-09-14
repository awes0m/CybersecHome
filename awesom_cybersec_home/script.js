
class HomepageApp {
    constructor() {
        // Initialize data from localStorage or set defaults
        this.favorites = this.loadData('favorites', []);
        this.notes = this.loadData('notes', []);
        this.todos = this.loadData('todos', []);
        this.bookmarks = this.loadData('bookmarks', []);
        this.customFeeds = this.loadData('customFeeds', []);
        this.theme = localStorage.getItem('theme') || 'light';
        this.wallpaper = localStorage.getItem('wallpaper') || '';
        this.currentPage = 'homePage';

        // RSS Feed Configuration
        this.feedSources = [
            { name: 'Krebs on Security', rssUrl: 'https://krebsonsecurity.com/feed/', icon: 'https://krebsonsecurity.com/favicon.ico' },
            { name: 'Hacker News', rssUrl: 'https://news.ycombinator.com/rss', icon: 'https://news.ycombinator.com/favicon.ico' },
            { name: 'CISA Advisories', rssUrl: 'https://www.cisa.gov/cybersecurity-advisories/cybersecurity-advisories.xml', icon: 'https://www.cisa.gov/sites/default/files/favicon.ico' }
        ];

        this.init();
    }

    // --- CORE INITIALIZATION ---
    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.navigateTo(window.location.hash.substring(1) || 'home');

        // Initial renders
        this.renderAll();
        this.applyWallpaper();
    }

    renderAll() {
        this.renderFavorites();
        this.renderNotes();
        this.renderTodos();
        this.renderBookmarks();
        this.loadFeeds();
    }

    loadData(key, defaultValue) {
        try {
            return JSON.parse(localStorage.getItem(key)) || defaultValue;
        } catch (e) {
            console.error(`Error loading ${key} from localStorage`, e);
            return defaultValue;
        }
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    setupTheme() {
        document.body.setAttribute('data-theme', this.theme);
        document.querySelector('#themeToggle i').className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // --- EVENT LISTENERS ---
    setupEventListeners() {
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('changeWallpaperBtn').addEventListener('click', () => this.openModal('wallpaperModal'));

        // Navigation
        document.getElementById('mainNav').addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                this.navigateTo(e.target.dataset.page.replace('Page', ''));
            }
        });

        // Modals
        this.setupModalEventListeners('favoriteModal', 'addFavoriteBtn', 'favoriteForm', this.addFavorite.bind(this));
        this.setupModalEventListeners('noteModal', 'addNoteBtn', 'noteForm', this.addNote.bind(this));
        this.setupModalEventListeners('todoModal', 'addTodoBtn', 'todoForm', this.addTodo.bind(this));
        this.setupModalEventListeners('folderModal', 'addFolderBtn', 'folderForm', this.handleFolderSubmit.bind(this));
        this.setupModalEventListeners('bookmarkModal', null, 'bookmarkForm', this.handleBookmarkSubmit.bind(this));

        // Feeds
        document.getElementById('refreshFeedsBtnHome').addEventListener('click', () => this.loadFeeds());
        document.getElementById('refreshFeedsBtnPage').addEventListener('click', () => this.loadFeeds());
        document.getElementById('addFeedBtn').addEventListener('click', () => this.openModal('feedModal'));

        // Feed modal save
        document.getElementById('feedForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomFeed();
        });

        // Feed preview & validation (debounced)
        const feedUrlInput = document.getElementById('feedUrlInput');
        const feedNameInput = document.getElementById('feedNameInput');
        const feedPreviewArea = document.getElementById('feedPreviewArea');
        const feedPreviewTitle = document.getElementById('feedPreviewTitle');
        const feedPreviewItems = document.getElementById('feedPreviewItems');
        const feedPreviewError = document.getElementById('feedPreviewError');
        const saveFeedBtn = document.getElementById('saveFeedBtn');

        let feedDebounceTimer = null;
        feedUrlInput.addEventListener('input', () => {
            feedPreviewArea.style.display = 'none';
            feedPreviewError.style.display = 'none';
            saveFeedBtn.disabled = true;
            if (feedDebounceTimer) clearTimeout(feedDebounceTimer);
            feedDebounceTimer = setTimeout(async () => {
                const url = feedUrlInput.value.trim();
                if (!url) return;
                feedPreviewTitle.textContent = 'Checking...';
                feedPreviewItems.textContent = '';
                feedPreviewArea.style.display = 'block';
                try {
                    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
                    const resp = await fetch(proxyUrl);
                    const data = await resp.json();
                    if (!resp.ok || data.status !== 'ok') throw new Error(data.message || 'Invalid feed');
                    feedPreviewTitle.textContent = (data.feed && data.feed.title) ? data.feed.title : (feedNameInput.value || 'Untitled');
                    feedPreviewItems.innerHTML = data.items.slice(0, 3).map(it => `<div>• ${it.title}</div>`).join('');
                    saveFeedBtn.disabled = false;
                } catch (err) {
                    feedPreviewArea.style.display = 'none';
                    feedPreviewError.style.display = 'block';
                    feedPreviewError.textContent = 'Could not load preview for this RSS URL.' + (err.message ? ' ' + err.message : '');
                    saveFeedBtn.disabled = true;
                }
            }, 600);
        });

        // Wallpaper modal
        document.getElementById('wallpaperForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const url = document.getElementById('wallpaperUrlInput').value.trim();
            if (url) this.setWallpaper(url);
            this.closeModal('wallpaperModal');
        });
        document.getElementById('clearWallpaperBtn').addEventListener('click', () => { this.clearWallpaper(); this.closeModal('wallpaperModal'); });

        // Wallpaper preview & validation
        const wallpaperUrlInput = document.getElementById('wallpaperUrlInput');
        const wallpaperPreviewArea = document.getElementById('wallpaperPreviewArea');
        const wallpaperPreviewImg = document.getElementById('wallpaperPreviewImg');
        const wallpaperPreviewMsg = document.getElementById('wallpaperPreviewMsg');
        const setWallpaperBtn = document.getElementById('setWallpaperBtn');

        let wallpaperTimer = null;
        wallpaperUrlInput.addEventListener('input', () => {
            wallpaperPreviewArea.style.display = 'none';
            wallpaperPreviewMsg.textContent = '';
            setWallpaperBtn.disabled = true;
            if (wallpaperTimer) clearTimeout(wallpaperTimer);
            wallpaperTimer = setTimeout(() => {
                const url = wallpaperUrlInput.value.trim();
                if (!url) return;
                wallpaperPreviewImg.src = url;
                wallpaperPreviewArea.style.display = 'block';
                wallpaperPreviewMsg.textContent = 'Loading preview...';
                setWallpaperBtn.disabled = true;
            }, 250);
        });

        wallpaperPreviewImg.addEventListener('load', () => {
            wallpaperPreviewMsg.textContent = 'Image looks good. Click Set to apply.';
            setWallpaperBtn.disabled = false;
        });
        wallpaperPreviewImg.addEventListener('error', () => {
            wallpaperPreviewMsg.textContent = 'Failed to load image. Check the URL or try another image.';
            setWallpaperBtn.disabled = true;
        });

        // Bookmarks Import
        const uploadArea = document.getElementById('bookmarksUpload');
        const fileInput = document.getElementById('bookmarksInput');
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => e.target.files.length && this.handleBookmarksFile(e.target.files[0]));
    }

    // --- NAVIGATION & PAGE HANDLING ---
    navigateTo(pageName) {
        const pageId = `${pageName}Page`;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        const targetPage = document.getElementById(pageId);
        const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);

        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            window.location.hash = pageName;
        }
        if (targetLink) targetLink.classList.add('active');
    }

    // --- THEME ---
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.setupTheme();
    }

    // --- MODALS ---
    setupModalEventListeners(modalId, openBtnId, formId, submitHandler) {
        const modal = document.getElementById(modalId);
        if (openBtnId) document.getElementById(openBtnId).addEventListener('click', () => this.openModal(modalId));
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modalId));
        modal.addEventListener('click', e => (e.target === modal) && this.closeModal(modalId));
        if (formId) document.getElementById(formId).addEventListener('submit', (e) => {
            e.preventDefault();
            submitHandler(e);
        });
    }

    openModal(modalId) { document.getElementById(modalId).classList.add('active'); }
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        const form = modal.querySelector('form');
        if (form) form.reset();
    }

    // --- FAVORITES ---
    addFavorite() {
        const newFavorite = {
            id: Date.now(),
            label: document.getElementById('favoriteLabel').value,
            url: document.getElementById('favoriteUrl').value,
            icon: document.getElementById('favoriteIcon').value || 'fas fa-globe'
        };
        this.favorites.push(newFavorite);
        this.saveData('favorites', this.favorites);
        this.renderFavorites();
        this.closeModal('favoriteModal');
    }
    removeFavorite(id) {
        this.favorites = this.favorites.filter(fav => fav.id !== id);
        this.saveData('favorites', this.favorites);
        this.renderFavorites();
    }
    renderFavorites() {
        const grid = document.getElementById('favoritesGrid');
        grid.innerHTML = this.favorites.map(fav => `
                    <div class="favorite-item">
                        <button class="favorite-delete" onclick="app.removeFavorite(${fav.id})"><i class="fas fa-times"></i></button>
                        <a href="${fav.url}" target="_blank" rel="noopener noreferrer" style="display: contents;">
                            <div class="favorite-icon"><i class="${fav.icon}"></i></div>
                            <div class="favorite-label">${fav.label}</div>
                        </a>
                    </div>
                `).join('') || `<p class="empty-state" style="grid-column: 1 / -1;">No favorites yet. Add one!</p>`;
    }

    // --- NOTES ---
    addNote() {
        const note = {
            id: Date.now(),
            title: document.getElementById('noteTitle').value,
            content: document.getElementById('noteContent').value,
        };
        this.notes.unshift(note);
        this.saveData('notes', this.notes);
        this.renderNotes();
        this.closeModal('noteModal');
    }
    removeNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.saveData('notes', this.notes);
        this.renderNotes();
    }

    // Basic escaping to avoid injecting HTML via note/task text
    escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    renderNotes() {
        const list = document.getElementById('notesList');
        if (!this.notes || this.notes.length === 0) {
            list.innerHTML = `<p class="empty-state">No notes yet.</p>`;
            return;
        }
        list.innerHTML = this.notes.map(n => `
                <div class="note-item">
                    <div class="note-header">
                        <div class="note-title">${this.escapeHtml(n.title)}</div>
                        <button class="btn-icon" title="Delete" onclick="app.removeNote(${n.id})"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="note-content">${this.escapeHtml(n.content).replace(/\n/g, '<br>')}</div>
                </div>
            `).join('');
    }

    // --- TODOS ---
    addTodo() {
        const text = document.getElementById('todoText').value.trim();
        const dueDate = document.getElementById('todoDueDate').value;
        if (!text) return;
        const todo = { id: Date.now(), text, dueDate: dueDate || '', completed: false };
        this.todos.unshift(todo);
        this.saveData('todos', this.todos);
        this.renderTodos();
        this.closeModal('todoModal');
    }
    removeTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveData('todos', this.todos);
        this.renderTodos();
    }
    toggleTodo(id) {
        const t = this.todos.find(t => t.id === id);
        if (t) {
            t.completed = !t.completed;
            this.saveData('todos', this.todos);
            this.renderTodos();
        }
    }
    renderTodos() {
        const list = document.getElementById('todosList');
        if (!this.todos || this.todos.length === 0) {
            list.innerHTML = `<p class="empty-state">No tasks yet.</p>`;
            return;
        }
        list.innerHTML = this.todos.map(t => {
            const due = t.dueDate ? new Date(t.dueDate) : null;
            const dueDisplay = due ? due.toLocaleDateString() : '';
            return `
                <div class="todo-item ${t.completed ? 'completed' : ''}">
                    <div class="todo-left">
                        <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="app.toggleTodo(${t.id})" />
                        <span class="todo-text">${this.escapeHtml(t.text)}</span>
                    </div>
                    <div class="todo-right">
                        ${dueDisplay ? `<span class=\"todo-due\">${dueDisplay}</span>` : ''}
                        <button class="btn-icon" title="Delete" onclick="app.removeTodo(${t.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
        }).join('');
    }

    // --- BOOKMARKS ---
    handleBookmarksFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.bookmarks = this.parseBookmarksHTML(e.target.result);
                this.saveData('bookmarks', this.bookmarks);
                this.renderBookmarks();
            } catch (error) {
                console.error('Error parsing bookmarks file:', error);
                alert('Error parsing bookmarks file.');
            }
        };
        reader.readAsText(file);
    }

    parseBookmarksHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const result = [];

        const parseNode = (node) => {
            let folder = {
                id: 'folder_' + Date.now() + Math.random(),
                name: 'Unnamed',
                bookmarks: []
            };

            let child = node.firstElementChild;
            while (child) {
                if (child.tagName === 'H3') {
                    folder.name = child.textContent.trim();
                } else if (child.tagName === 'DL') {
                    let subChild = child.firstElementChild;
                    while (subChild) {
                        if (subChild.tagName === 'DT') {
                            const a = subChild.querySelector('a');
                            const h3 = subChild.querySelector('h3');
                            if (a) {
                                folder.bookmarks.push({
                                    id: 'bm_' + Date.now() + Math.random(),
                                    title: a.textContent.trim(),
                                    url: a.getAttribute('href'),
                                    favicon: this.getFaviconUrl(a.getAttribute('href'))
                                });
                            } else if (h3) {
                                const subFolderDL = subChild.querySelector('dl');
                                if (subFolderDL) {
                                    result.push(parseNode(subChild));
                                }
                            }
                        }
                        subChild = subChild.nextElementSibling;
                    }
                }
                child = child.nextElementSibling;
            }
            return folder;
        };

        const rootDL = doc.querySelector('body > dl');
        if (rootDL) {
            let child = rootDL.firstElementChild;
            while (child) {
                if (child.tagName === 'DT') {
                    result.push(parseNode(child));
                }
                child = child.nextElementSibling;
            }
        }
        return result.filter(f => f.bookmarks.length > 0 || f.name !== 'Unnamed');
    }

    getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        } catch { return ''; }
    }

    renderBookmarks() {
        const container = document.getElementById('bookmarksContainer');
        if (this.bookmarks.length === 0) {
            container.innerHTML = `<div class="empty-state">No bookmarks found. Create a folder or import your 'bookmarks.html' file.</div>`;
            return;
        }
        container.innerHTML = this.bookmarks.map(folder => `
                    <div class="bookmark-folder" data-folder-id="${folder.id}">
                        <div class="bookmark-folder-header">
                            <span class="bookmark-folder-name"><i class="fas fa-folder"></i> ${folder.name}</span>
                            <div>
                                <button class="btn-icon" onclick="app.openBookmarkModal(null, '${folder.id}')"><i class="fas fa-plus"></i></button>
                                <button class="btn-icon" onclick="app.openFolderModal('${folder.id}')"><i class="fas fa-pen"></i></button>
                                <button class="btn-icon" onclick="app.deleteFolder('${folder.id}')"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                        <div class="bookmark-list">
                            ${folder.bookmarks.map(bm => `
                                <div class="bookmark-item" data-bookmark-id="${bm.id}">
                                    <a href="${bm.url}" target="_blank" rel="noopener noreferrer" class="bookmark-item-link">
                                        <img src="${bm.favicon}" alt="" class="bookmark-favicon" onerror="this.style.display='none'">
                                        <span class="bookmark-title">${bm.title}</span>
                                    </a>
                                    <div>
                                        <button class="btn-icon" onclick="app.openBookmarkModal('${bm.id}', '${folder.id}')"><i class="fas fa-pen"></i></button>
                                        <button class="btn-icon" onclick="app.deleteBookmark('${bm.id}', '${folder.id}')"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            `).join('')}
                             ${folder.bookmarks.length === 0 ? '<p style="color: var(--text-secondary);">This folder is empty.</p>' : ''}
                        </div>
                    </div>
                `).join('');
    }

    handleFolderSubmit() {
        const id = document.getElementById('folderIdInput').value;
        const name = document.getElementById('folderNameInput').value;
        if (id) { // Edit
            const folder = this.bookmarks.find(f => f.id === id);
            if (folder) folder.name = name;
        } else { // Add
            this.bookmarks.unshift({ id: 'folder_' + Date.now(), name, bookmarks: [] });
        }
        this.saveData('bookmarks', this.bookmarks);
        this.renderBookmarks();
        this.closeModal('folderModal');
    }

    openFolderModal(id = null) {
        const form = document.getElementById('folderForm');
        const title = document.getElementById('folderModalTitle');
        if (id) {
            const folder = this.bookmarks.find(f => f.id === id);
            title.textContent = 'Edit Folder';
            form.folderIdInput.value = id;
            form.folderNameInput.value = folder.name;
        } else {
            title.textContent = 'New Folder';
            form.reset();
        }
        this.openModal('folderModal');
    }

    deleteFolder(id) {
        if (confirm('Are you sure you want to delete this folder and all its bookmarks?')) {
            this.bookmarks = this.bookmarks.filter(f => f.id !== id);
            this.saveData('bookmarks', this.bookmarks);
            this.renderBookmarks();
        }
    }

    handleBookmarkSubmit() {
        const bmId = document.getElementById('bookmarkIdInput').value;
        const folderId = document.getElementById('bookmarkFolderIdInput').value;
        const title = document.getElementById('bookmarkTitleInput').value;
        const url = document.getElementById('bookmarkUrlInput').value;

        const folder = this.bookmarks.find(f => f.id === folderId);
        if (!folder) return;

        if (bmId) { // Edit
            const bookmark = folder.bookmarks.find(b => b.id === bmId);
            if (bookmark) {
                bookmark.title = title;
                bookmark.url = url;
                bookmark.favicon = this.getFaviconUrl(url);
            }
        } else { // Add
            folder.bookmarks.push({ id: 'bm_' + Date.now(), title, url, favicon: this.getFaviconUrl(url) });
        }
        this.saveData('bookmarks', this.bookmarks);
        this.renderBookmarks();
        this.closeModal('bookmarkModal');
    }

    openBookmarkModal(bookmarkId = null, folderId) {
        const form = document.getElementById('bookmarkForm');
        const title = document.getElementById('bookmarkModalTitle');
        form.reset();
        form.bookmarkFolderIdInput.value = folderId;

        if (bookmarkId) {
            const folder = this.bookmarks.find(f => f.id === folderId);
            const bookmark = folder?.bookmarks.find(b => b.id === bookmarkId);
            if (bookmark) {
                title.textContent = 'Edit Bookmark';
                form.bookmarkIdInput.value = bookmarkId;
                form.bookmarkTitleInput.value = bookmark.title;
                form.bookmarkUrlInput.value = bookmark.url;
            }
        } else {
            title.textContent = 'New Bookmark';
        }
        this.openModal('bookmarkModal');
    }

    deleteBookmark(bookmarkId, folderId) {
        const folder = this.bookmarks.find(f => f.id === folderId);
        if (folder) {
            folder.bookmarks = folder.bookmarks.filter(b => b.id !== bookmarkId);
            this.saveData('bookmarks', this.bookmarks);
            this.renderBookmarks();
        }
    }


    // --- RSS FEEDS ---
    async loadFeeds() {
        const homeGrid = document.getElementById('feedGridHome');
        const pageGrid = document.getElementById('feedGridPage');
        const loadingHTML = `<div class="loading" style="grid-column: 1 / -1;"><div class="spinner"></div>Loading feeds...</div>`;
        homeGrid.innerHTML = loadingHTML;
        pageGrid.innerHTML = loadingHTML;

        // Merge built-in feedSources with customFeeds (custom first)
        const combined = [...this.customFeeds.map(f => ({ name: f.name, rssUrl: f.rssUrl, icon: f.icon, id: f.id, custom: true })), ...this.feedSources.map(f => ({ ...f, custom: false }))];

        const allFeedsHtml = await Promise.all(combined.map(source => this.fetchAndRenderFeed(source)));

        // Additionally, render a small management panel for custom feeds on the page grid
        const customListHtml = this.renderCustomFeedsList();

        homeGrid.innerHTML = allFeedsHtml.join('');
        pageGrid.innerHTML = customListHtml + allFeedsHtml.join('');
    }

    async fetchAndRenderFeed(source) {
        try {
            // Use a CORS proxy for client-side RSS fetching
            const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.rssUrl)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (data.status !== 'ok') throw new Error(`API Error: ${data.message}`);

            const items = data.items.slice(0, 5);
            return `
                        <div class="feed-source">
                            <div class="feed-source-header">
                                <img src="${source.icon || ''}" alt="" class="feed-source-icon" onerror="this.style.display='none'">
                                <div class="feed-source-title"><a href="${data.feed.link || '#'}" target="_blank" rel="noopener noreferrer">${data.feed.title || source.name}</a></div>
                                ${source.custom ? `<button class="btn-small btn" style="margin-left:8px;" onclick="app.removeCustomFeed('${source.id}')"><i class='fas fa-trash'></i></button>` : ''}
                            </div>
                            ${items.map(item => `
                                <div class="feed-item">
                                    <div class="feed-item-title"><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></div>
                                    <div class="feed-item-meta">${new Date(item.pubDate).toLocaleDateString()}</div>
                                </div>
                            `).join('')}
                        </div>
                    `;
        } catch (error) {
            console.error(`Failed to load feed from ${source.name}:`, error);
            return `<div class="feed-source"><div class="feed-source-header">${source.name}</div><p>Could not load feed.</p></div>`;
        }
    }

    renderCustomFeedsList() {
        if (!this.customFeeds || this.customFeeds.length === 0) return '';
        return `
                    <div style="grid-column:1/-1; margin-bottom:1rem;">
                        <div class="feed-source">
                            <div class="feed-source-header"><div class="feed-source-title">Custom Feeds</div></div>
                            <div style="padding:1rem; display:flex;flex-direction:column;gap:0.5rem;">
                                ${this.customFeeds.map(f => `
                                    <div style="display:flex;justify-content:space-between;align-items:center;">
                                        <div style="display:flex;align-items:center;gap:0.5rem;"><img src="${f.icon || ''}" style="width:20px;height:20px;object-fit:cover;border-radius:3px;" onerror="this.style.display='none'">${f.name}</div>
                                        <div><button class="btn-small btn" onclick="app.removeCustomFeed('${f.id}')"><i class='fas fa-trash'></i></button></div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
    }

    saveCustomFeed() {
        const name = document.getElementById('feedNameInput').value.trim();
        const rssUrl = document.getElementById('feedUrlInput').value.trim();
        const icon = document.getElementById('feedIconInput').value.trim();
        if (!name || !rssUrl) return;
        this.customFeeds.push({ id: 'cf_' + Date.now(), name, rssUrl, icon });
        this.saveData('customFeeds', this.customFeeds);
        this.renderAll();
        this.closeModal('feedModal');
    }

    removeCustomFeed(id) {
        if (!confirm('Remove this feed?')) return;
        this.customFeeds = this.customFeeds.filter(f => f.id !== id);
        this.saveData('customFeeds', this.customFeeds);
        this.renderAll();
    }

    // --- WALLPAPER ---
    applyWallpaper() {
        if (!this.wallpaper) return;
        // create or update overlay
        let overlay = document.querySelector('.wallpaper-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'wallpaper-overlay';
            document.body.prepend(overlay);
        }
        overlay.style.backgroundImage = `url('${this.wallpaper}')`;
        overlay.style.opacity = '1';
        // make body background transparent so wallpaper shows through
        document.body.style.backgroundColor = 'transparent';
    }

    setWallpaper(url) {
        this.wallpaper = url;
        localStorage.setItem('wallpaper', url);
        this.applyWallpaper();
    }

    clearWallpaper() {
        this.wallpaper = '';
        localStorage.removeItem('wallpaper');
        const overlay = document.querySelector('.wallpaper-overlay');
        if (overlay) overlay.style.opacity = '0';
        // restore body background to theme color
        document.body.style.backgroundColor = '';
    }

}

// Initialize the application
const app = new HomepageApp();
