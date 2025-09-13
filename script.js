// Register
document.getElementById('register-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username, password}) });
    const data = await res.json();
    alert(data.success ? 'Registered!' : data.msg);
    if(data.success) window.location = 'login.html';
});

// Login
document.getElementById('login-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username, password}) });
    const data = await res.json();
    if(data.success) {
        if(data.admin) window.location = 'admin-dashboard.html';
        else window.location = 'upload.html';
    } else alert('Invalid credentials');
});

// Upload Ad
document.getElementById('upload-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const groupName = document.getElementById('groupName').value;
    const groupLink = document.getElementById('groupLink').value;
    const description = document.getElementById('description').value;
    const res = await fetch('/upload', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({groupName, groupLink, description})});
    const data = await res.json();
    alert(data.success ? 'Ad uploaded!' : 'Failed');
});

// Load Ads
const adsList = document.getElementById('ads-list');
if(adsList){
    fetch('/ads').then(res => res.json()).then(data => {
        data.forEach(ad => {
            const div = document.createElement('div');
            div.innerHTML = `<h3>${ad.groupName}</h3><p>${ad.description}</p><a href="${ad.groupLink}" target="_blank">Join</a>`;
            adsList.appendChild(div);
        });
    });
}

// Admin Stats
const userCount = document.getElementById('userCount');
const postCount = document.getElementById('postCount');
const viewCount = document.getElementById('viewCount');

if(userCount && postCount && viewCount){
    fetch('/admin-stats').then(res=>res.json()).then(data=>{
        userCount.textContent = data.userCount;
        postCount.textContent = data.postCount;
        viewCount.textContent = data.viewCount;
    });
}
