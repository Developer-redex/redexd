// ============================================
// REDEX PLATFORM - MAIN JAVASCRIPT
// ============================================

// Toast Notification System
function createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'info', duration = 3000) {
    const container = createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

window.showToast = showToast;

// ============================================

// ============================================
// LANGUAGE TOGGLE
// ============================================

// ============================================
// LANGUAGE TOGGLE & TRANSLATIONS
// ============================================

const translations = {
    ar: {
        title: 'Redex - منصة تعليمية للبرمجة',
        nav_home: 'الرئيسية',
        nav_projects: 'مشاريع المجتمع',
        nav_ask: 'اسأل خبيراً',
        hero_title: 'تعلم البرمجة بطريقة عملية',
        hero_subtitle: 'منصة تعليمية شاملة للمبرمجين مع محرر أكواد تفاعلي ومجتمع نشط لمشاركة المشاريع وبناء سيرتك الذاتية',
        btn_start: 'ابدأ التعلم الآن',
        btn_browse: 'تصفح المشاريع',
        section_projects: 'مشاريع مميزة من المجتمع',
        no_projects: 'لا توجد مشاريع حتى الآن'
    },
    en: {
        title: 'Redex - Programming Learning Platform',
        nav_home: 'Home',
        nav_projects: 'Community Projects',
        nav_ask: 'Ask an Expert',
        hero_title: 'Learn Programming Practically',
        hero_subtitle: 'A comprehensive educational platform for programmers with an interactive code editor and an active community to share projects.',
        btn_start: 'Start Learning',
        btn_browse: 'Browse Projects',
        section_projects: 'Featured Community Projects',
        no_projects: 'No projects yet'
    }
};

function toggleLanguage() {
    const html = document.documentElement;
    const body = document.body;
    const currentLang = html.getAttribute('lang');

    if (currentLang === 'ar') {
        setLanguage('en');
    } else {
        setLanguage('ar');
    }
}

function setLanguage(lang) {
    const html = document.documentElement;
    const body = document.body;

    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    if (lang === 'en') {
        body.classList.add('lang-en');
    } else {
        body.classList.remove('lang-en');
    }

    localStorage.setItem('language', lang);
    updateContent(lang);
}

// Update content based on language
function updateContent(lang) {
    // 1. Update Title
    if (translations[lang].title) {
        document.title = translations[lang].title;
    }

    // 2. Update elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// Check saved language preference on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLanguage(savedLang);

    // Load projects if we are on projects page or home page
    loadProjectsToPage();

    // Check Auth State
    checkAuthState();

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Default is dark if nothing saved, or if user prefers dark
    // Since CSS is dark by default, we only need to add 'light' class if needed
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function checkAuthState() {
    const user = getFromLocalStorage('currentUser');
    const navButtons = document.querySelector('.nav-buttons');

    if (user && navButtons) {
        // User is logged in
        // Keep lang toggle, remove auth buttons, add user greeting and logout
        const langToggle = navButtons.querySelector('.lang-toggle');
        navButtons.innerHTML = '';
        if (langToggle) navButtons.appendChild(langToggle);

        const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`;

        const userDiv = document.createElement('div');
        userDiv.className = 'user-menu';
        userDiv.style.display = 'inline-flex';
        userDiv.style.alignItems = 'center';
        userDiv.style.gap = '12px';
        userDiv.style.marginLeft = '10px';
        userDiv.style.marginRight = '10px';

        // Check current path to determine correct link
        const isPagesDir = window.location.pathname.includes('/pages/');
        const profileLink = isPagesDir ? 'profile.html' : 'pages/profile.html';
        const adminLink = isPagesDir ? 'admin.html' : 'pages/admin.html';

        userDiv.innerHTML = `
            <a href="${profileLink}" title="الملف الشخصي" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit;">
                <img src="${avatarUrl}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary-light);">
                <span style="font-weight: bold;">${user.username}</span>
            </a>
            ${user.username === 'Redex52' && user.password === '069999068' ? `<a href="${adminLink}" class="btn btn-primary btn-sm" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">🛡️ الإدارة</a>` : ''}
            <button onclick="logout()" class="btn btn-secondary btn-sm" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">خروج</button>
        `;

        // RTL adjustment via simple logic or CSS. Since strict RTL is set on HTML, flex direction handles order.
        // But we might want to ensure gaps work correctly.

        navButtons.appendChild(userDiv);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// ============================================
// PROJECT STORAGE LOGIC
// ============================================

async function saveProject(project) {
    try {
        await DataService.addProject(project);
        return true;
    } catch (error) {
        console.error('Error saving project:', error);
        return false;
    }
}

async function loadProjectsToPage() {
    try {
        const allProjects = await DataService.getProjects();
        // Show only approved projects for regular users (filtering could be done on backend eventually)
        const projects = allProjects.filter(p => p.status === 'approved');
        const container = document.getElementById('projects-grid') || document.getElementById('featured-projects-container');

        if (!container) return;

        if (projects.length === 0) {
            // Container usually has "No projects" by default, so just leave it or show specific message
            // If it was cleared before, restore it:
            if (!container.innerHTML.trim()) {
                container.innerHTML = `
                    <div class="card text-center" style="grid-column: 1/-1; padding: 4rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                        <h3>${translations[document.documentElement.lang].no_projects}</h3>
                    </div>`;
            }
            return;
        }

        // Clear "No projects" message
        container.innerHTML = '';

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            // Add minimal sanitization for display
            card.innerHTML = `
                <a href="${projects[0].link ? '#ProjectDetails' : 'javascript:void(0)'}" onclick="viewProjectDetails(${project.id})" style="text-decoration:none; color:inherit; display:block;">
                    <img src="${project.image}" alt="${project.title}" class="project-thumbnail" style="height: 200px; width: 100%; object-fit: cover;">
                    <div class="project-info">
                        <div class="badge mb-sm">${project.category}</div>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-author">
                            <span style="opacity:0.7">بواسطة</span> ${project.author}
                        </p>
                        <p class="card-text mb-md" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${project.description}</p>
                    </div>
                </a>
                <div class="project-stats" style="padding: 0 1rem 1rem;">
                    <button onclick="toggleLike(event, ${project.id})" class="stat" style="border: none; background: none; cursor: pointer; color: inherit; font-size: inherit;">
                        <span id="like-icon-${project.id}">${hasLiked(project.id) ? '❤️' : '🤍'}</span> 
                        <span id="like-count-${project.id}">${project.stats.likes}</span>
                    </button>
                    <span class="stat">💾 ${project.stats.downloads}</span>
                    <span class="stat">👁️ ${project.stats.views}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        showToast('فشل تحميل المشاريع', 'error');
    }
}

// Like System
function hasLiked(projectId) {
    const likes = getFromLocalStorage('user_likes') || [];
    return likes.includes(projectId);
}

window.toggleLike = async function (event, projectId) {
    event.preventDefault();
    event.stopPropagation();

    try {
        const allProjects = await DataService.getProjects();
        const project = allProjects.find(p => p.id === projectId);

        if (!project) return;

        const likes = getFromLocalStorage('user_likes') || [];
        const likeIndex = likes.indexOf(projectId);
        let newLikeCount = project.stats.likes;

        if (likeIndex === -1) {
            // Add like
            likes.push(projectId);
            newLikeCount++;
        } else {
            // Remove like
            likes.splice(likeIndex, 1);
            newLikeCount--;
        }

        // Optimistic UI Update
        const icon = document.getElementById(`like-icon-${projectId}`);
        const count = document.getElementById(`like-count-${projectId}`);
        if (icon) icon.textContent = likeIndex === -1 ? '❤️' : '🤍';
        if (count) count.textContent = newLikeCount;

        // Persist
        saveToLocalStorage('user_likes', likes);

        // Update Project on Server
        await DataService.updateProject(projectId, {
            stats: { ...project.stats, likes: newLikeCount }
        });

    } catch (error) {
        console.error('Error toggling like:', error);
        showToast('حدث خطأ أثناء تسجيل الإعجاب', 'error');
    }
};

// Increment views when project details page is opened
async function incrementViews(projectId) {
    try {
        const projects = await DataService.getProjects();
        const project = projects.find(p => p.id == projectId);
        if (project) {
            await DataService.updateProject(projectId, {
                stats: { ...project.stats, views: project.stats.views + 1 }
            });
        }
    } catch (e) {
        console.error('Error incrementing views:', e);
    }
}

// Increment downloads when download link is clicked
async function incrementDownloads(projectId) {
    try {
        const projects = await DataService.getProjects();
        const project = projects.find(p => p.id == projectId);
        if (project) {
            await DataService.updateProject(projectId, {
                stats: { ...project.stats, downloads: project.stats.downloads + 1 }
            });
        }
    } catch (e) {
        console.error('Error incrementing downloads:', e);
    }
}

function viewProjectDetails(projectId) {
    // If we're in /pages/ directory
    if (window.location.pathname.includes('/pages/')) {
        window.location.href = `project-details.html?id=${projectId}`;
    } else {
        window.location.href = `pages/project-details.html?id=${projectId}`;
    }
}

// ============================================
// ANIMATIONS ON SCROLL
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to cards on scroll
window.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.course-card, .project-card, .card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// ============================================
// FORM VALIDATION UTILITIES
// ============================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, one letter, one number
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

// ============================================
// LOCAL STORAGE UTILITIES
// ============================================

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-error)' : 'var(--color-info)'};
        color: white;
        padding: 16px 24px;
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-tooltip);
        animation: slideIn 0.3s ease-out;
    `;

    // RTL support
    if (document.documentElement.dir === 'rtl') {
        toast.style.right = 'auto';
        toast.style.left = '20px';
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    [dir="rtl"] .toast {
        animation: slideInRTL 0.3s ease-out;
    }
    
    @keyframes slideInRTL {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

console.log('%c مرحباً بك في منصة Redex! ', 'background: #1e3a8a; color: white; font-size: 20px; padding: 10px;');
console.log('%c Welcome to Redex Platform! ', 'background: #3b82f6; color: white; font-size: 16px; padding: 8px;');
console.log('نحن نبحث عن مطورين موهوبين! تواصل معنا على: developers@redex.com');
