// ============================================
// API HANDLER - Bridge between Frontend and Supabase
// ============================================

// 1. SUPABASE CONFIGURATION
// Create a project at https://supabase.com and get these credentials
// from Project Settings > API
const SUPABASE_URL = 'https://knpqlsdokryzefnjhwwm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5MyVTwZCTitdVPnQ8I367A_eS1m4g7M';

let supabase = null;

// Initialize Supabase if script is loaded
if (typeof createClient !== 'undefined') {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase Client Initialized');
} else {
    // Dynamically load Supabase script if not present
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase Client Loaded Dynamically');
    };
    document.head.appendChild(script);
}

// Fallback to localStorage if no keys or offline
function isCloudActive() {
    return supabase && SUPABASE_URL.includes('https') && !SUPABASE_URL.includes('YOUR_PROJECT_ID');
}

// --- Data Service Functions ---

const DataService = {
    // Projects
    getProjects: async () => {
        if (isCloudActive()) {
            const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        }
        return JSON.parse(localStorage.getItem('redex_projects') || '[]');
    },

    addProject: async (project) => {
        if (isCloudActive()) {
            // Remove ID to let DB generate it, or specific handling
            const { id, ...projectData } = project;
            // Map keys if needed (camelCase to snake_case usually, but we kept tables simple or can map here)
            // Our Schema uses snake_case column names automatically if we wish, or we match JS object.
            // Let's assume we map explicitly for safety:
            const p = {
                title: project.title,
                description: project.description,
                category: project.category,
                author: project.author,
                image: project.image,
                download_link: project.downloadLink,
                status: project.status || 'pending',
                stats: project.stats || { likes: 0, views: 0, downloads: 0 }
            };
            const { data, error } = await supabase.from('projects').insert([p]).select();
            if (error) throw error;
            return data[0];
        } else {
            // Local Fallback
            let projects = JSON.parse(localStorage.getItem('redex_projects') || '[]');
            projects.unshift(project);
            localStorage.setItem('redex_projects', JSON.stringify(projects));
            return project;
        }
    },

    updateProject: async (id, updates) => {
        if (isCloudActive()) {
            const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select();
            if (error) throw error;
            return data[0];
        } else {
            let projects = JSON.parse(localStorage.getItem('redex_projects') || '[]');
            const index = projects.findIndex(p => p.id == id);
            if (index !== -1) {
                projects[index] = { ...projects[index], ...updates };
                localStorage.setItem('redex_projects', JSON.stringify(projects));
            }
            return projects[index];
        }
    },

    deleteProject: async (id) => {
        if (isCloudActive()) {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
            return true;
        } else {
            let projects = JSON.parse(localStorage.getItem('redex_projects') || '[]');
            const filtered = projects.filter(p => p.id != id);
            localStorage.setItem('redex_projects', JSON.stringify(filtered));
            return true;
        }
    },

    // Questions
    getQuestions: async () => {
        if (isCloudActive()) {
            const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        }
        return JSON.parse(localStorage.getItem('redex_questions') || '[]');
    },

    addQuestion: async (question) => {
        if (isCloudActive()) {
            const q = {
                title: question.title,
                body: question.body,
                author: question.author,
                avatar: question.avatar,
                replies: []
            };
            const { data, error } = await supabase.from('questions').insert([q]).select();
            if (error) throw error;
            return data[0];
        } else {
            let questions = JSON.parse(localStorage.getItem('redex_questions') || '[]');
            questions.unshift(question);
            localStorage.setItem('redex_questions', JSON.stringify(questions));
            return question;
        }
    },

    replyToQuestion: async (id, reply) => {
        if (isCloudActive()) {
            // Fetch current replies first
            const { data: q } = await supabase.from('questions').select('replies').eq('id', id).single();
            const newReplies = [...(q.replies || []), reply];

            const { data, error } = await supabase.from('questions').update({ replies: newReplies }).eq('id', id).select();
            if (error) throw error;
            return data[0];
        } else {
            let questions = JSON.parse(localStorage.getItem('redex_questions') || '[]');
            const index = questions.findIndex(q => q.id == id);
            if (index !== -1) {
                questions[index].replies.push(reply);
                localStorage.setItem('redex_questions', JSON.stringify(questions));
            }
            return questions[index];
        }
    },

    deleteQuestion: async (id) => {
        if (isCloudActive()) {
            const { error } = await supabase.from('questions').delete().eq('id', id);
            if (error) throw error;
            return true;
        } else {
            let questions = JSON.parse(localStorage.getItem('redex_questions') || '[]');
            const filtered = questions.filter(q => q.id != id);
            localStorage.setItem('redex_questions', JSON.stringify(filtered));
            return true;
        }
    }
};
