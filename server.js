const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for base64 images

// Helper to read DB
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        return { projects: [], questions: [], users: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Helper to write DB
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Ensure DB exists with initial data
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        projects: [
            {
                id: 1,
                title: "لعبة الذاكرة",
                description: "لعبة تدريب ذاكرة بسيطة باستخدام JavaScript. ساعدتني كثيراً في فهم المصفوفات.",
                image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Memory+Game",
                category: "🎮 ألعاب",
                author: "Ahmed",
                status: "approved",
                date: new Date().toISOString(),
                stats: { likes: 5, views: 120, downloads: 10 },
                downloadLink: "https://github.com/example/memory-game"
            },
            {
                id: 2,
                title: "تطبيق مهامي",
                description: "تطبيق لتنظيم المهام اليومية مع إمكانية الحفظ المحلي.",
                image: "https://via.placeholder.com/400x300/10b981/ffffff?text=Todo+App",
                category: "📱 تطبيقات",
                author: "Sarah",
                status: "approved",
                date: new Date().toISOString(),
                stats: { likes: 12, views: 200, downloads: 45 },
                downloadLink: "https://github.com/example/todo-app"
            }
        ],
        questions: [],
        users: []
    };
    writeDB(initialData);
    console.log('Database initialized with seed data.');
}

// --- API Routes ---

// Projects
app.get('/api/projects', (req, res) => {
    const db = readDB();
    res.json(db.projects);
});

app.post('/api/projects', (req, res) => {
    const db = readDB();
    const newProject = req.body;
    // Basic validation could go here
    db.projects.push(newProject);
    writeDB(db);
    res.status(201).json(newProject);
});

app.post('/api/projects/:id/update', (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const updates = req.body;
    const index = db.projects.findIndex(p => p.id == id);

    if (index !== -1) {
        db.projects[index] = { ...db.projects[index], ...updates };
        writeDB(db);
        res.json(db.projects[index]);
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
});

app.delete('/api/projects/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const filtered = db.projects.filter(p => p.id != id);
    if (filtered.length !== db.projects.length) {
        db.projects = filtered;
        writeDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
});

// Questions
app.get('/api/questions', (req, res) => {
    const db = readDB();
    res.json(db.questions);
});

app.post('/api/questions', (req, res) => {
    const db = readDB();
    const newQuestion = req.body;
    db.questions.unshift(newQuestion);
    writeDB(db);
    res.status(201).json(newQuestion);
});

app.post('/api/questions/:id/reply', (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const reply = req.body;
    const index = db.questions.findIndex(q => q.id == id);

    if (index !== -1) {
        db.questions[index].replies.push(reply);
        writeDB(db);
        res.json(db.questions[index]);
    } else {
        res.status(404).json({ error: 'Question not found' });
    }
});

app.delete('/api/questions/:id', (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const filtered = db.questions.filter(q => q.id != id);
    if (filtered.length !== db.questions.length) {
        db.questions = filtered;
        writeDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Question not found' });
    }
});

// Users (Simulated Auth)
app.get('/api/users', (req, res) => {
    const db = readDB();
    res.json(db.users);
});

app.post('/api/users', (req, res) => {
    const db = readDB();
    const newUser = req.body;
    // Check if user exists
    if (db.users.find(u => u.username === newUser.username)) {
        return res.status(400).json({ error: 'اسم المستخدم موجود بالفعل' });
    }
    db.users.push(newUser);
    writeDB(db);
    res.status(201).json(newUser);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});
