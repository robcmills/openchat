import { OPENROUTER_API_KEY, OPENROUTER_API_V1_CHAT_COMPLETIONS_URL } from "./constants.ts";

async function stream() {
  const prompt = Deno.readTextFileSync('prompt.md');

  const response = await fetch(OPENROUTER_API_V1_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'robcmills.net', // Optional. Site URL for rankings on openrouter.ai.
      'X-Title': 'openchat', // Optional. Site title for rankings on openrouter.ai.
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Append new chunk to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines from buffer
      while (true) {
      	const lineEnd = buffer.indexOf('\n');
      	if (lineEnd === -1) break;

      	const line = buffer.slice(0, lineEnd).trim();
      	buffer = buffer.slice(lineEnd + 1);

      	if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0].delta.content;
            if (content) {
              console.log({ content });
            }
          } catch (e) {
            // Ignore invalid JSON
            console.error('Failed to parse data', e);
          }
      	}
      }
    }
  } finally {
    reader.cancel();
  }
}

stream();
