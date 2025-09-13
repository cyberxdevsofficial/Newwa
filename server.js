const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Anuga123';

// Data files
const USERS_FILE = './data/users.json';
const POSTS_FILE = './data/posts.json';

// Helper functions
const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Routes
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = readJSON(USERS_FILE);
    if(users.find(u => u.username === username)) return res.json({ success: false, msg: 'User exists' });
    users.push({ username, password });
    writeJSON(USERS_FILE, users);
    res.json({ success: true });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readJSON(USERS_FILE);
    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) return res.json({ success: true, admin: true });
    if(users.find(u => u.username === username && u.password === password)) return res.json({ success: true });
    res.json({ success: false });
});

app.post('/upload', (req, res) => {
    const { groupName, groupLink, description } = req.body;
    const posts = readJSON(POSTS_FILE);
    posts.push({ groupName, groupLink, description, views: 0 });
    writeJSON(POSTS_FILE, posts);
    res.json({ success: true });
});

app.get('/ads', (req, res) => {
    const posts = readJSON(POSTS_FILE);
    res.json(posts);
});

app.get('/admin-stats', (req, res) => {
    const users = readJSON(USERS_FILE);
    const posts = readJSON(POSTS_FILE);
    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    res.json({ userCount: users.length, postCount: posts.length, viewCount: totalViews });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
