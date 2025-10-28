// Vercel版: サーバー経由でAPIを呼び出す
async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // ユーザーのメッセージを表示
    addMessage(message, 'user');
    input.value = '';
    
    // ローディング表示
    const loadingId = addLoadingMessage();
    
    try {
        // 自分のサーバー(Vercel)にリクエストを送信
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        // ローディングを削除
        removeLoadingMessage(loadingId);
        
        if (!response.ok) {
            throw new Error(`APIエラー: ${response.status}`);
        }
        
        const data = await response.json();
        
        // ボットの返答を表示
        addMessage(data.answer, 'bot');
        
    } catch (error) {
        console.error('エラー:', error);
        removeLoadingMessage(loadingId);
        addMessage('エラーが発生しました。もう一度お試しください。', 'bot');
    }
}

// メッセージを画面に追加する関数
function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // 最新メッセージまでスクロール
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ローディング表示を追加
function addLoadingMessage() {
    const messagesContainer = document.getElementById('chatMessages');
    const loadingId = 'loading-' + Date.now();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.id = loadingId;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<span class="loading"></span><span class="loading"></span><span class="loading"></span>';
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return loadingId;
}

// ローディング表示を削除
function removeLoadingMessage(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

// Enterキーで送信できるようにする
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('userInput');
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
