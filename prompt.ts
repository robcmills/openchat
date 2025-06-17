const { fetchCompletion } = await import('./openrouter.ts');

async function main() {
  const prompt = Deno.readTextFileSync('prompt.md');
  const json = await fetchCompletion({
    messages: [{ role: 'user', content: prompt }],
    model: 'anthropic/claude-sonnet-4',
  });
  console.log('writing response.json');
  Deno.writeTextFileSync('response.json', JSON.stringify(json, null, 2));
  console.log('writing response.md');
  Deno.writeTextFileSync('response.md', json.choices[0].message.content);
}

main();
