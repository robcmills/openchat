const { fetchCompletion } = await import('./openrouter.ts');

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

function parseChat(chat: string): Message[] {
    const lines = chat.split('\n');
    const messages: Message[] = [];
    
    let currentRole: 'user' | 'assistant' | null = null;
    let currentContent: string[] = [];

    lines.forEach(line => {
        const roleMatch = line.match(/^`role: (user|assistant)`$/);
        if (roleMatch) {
            if (currentRole && currentContent.length > 0) {
                messages.push({
                    role: currentRole,
                    content: currentContent.join(' ').trim()
                });
            }
            currentRole = roleMatch[1] === 'user' ? 'user' : 'assistant';
            currentContent = [];
        } else {
            currentContent.push(line.trim());
        }
    });

    if (currentRole && currentContent.length > 0) {
        messages.push({
            role: currentRole,
            content: currentContent.join(' ').trim()
        });
    }

    return messages;
}

async function chat() {
  const chat = Deno.readTextFileSync('chat.md');
  const messages = parseChat(chat);
  console.log(messages);
  const json = await fetchCompletion({ messages, model: 'openai/gpt-4o' });
  Deno.writeTextFileSync('response.json', JSON.stringify(json, null, 2));
  // Deno.writeTextFileSync('chat.md', obj.choices[0].message.content);
}

chat();
