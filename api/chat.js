// 会話IDを保存するための簡易的なストレージ（本番環境では適切なDBを使用）
const conversations = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationId } = req.body;
  
  try {
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId || '',  // 会話IDを送信
        user: 'web-user'  // 固定ユーザーID
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    // 会話IDを返す
    res.status(200).json({ 
      answer: data.answer,
      conversationId: data.conversation_id
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
