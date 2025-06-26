import { Message } from "./chat.ts";
import { OPENROUTER_API_KEY, OPENROUTER_API_V1_CHAT_COMPLETIONS_URL, OPENROUTER_API_V1_MODELS_URL } from "./constants.ts";

export interface FetchCompletionArgs {
  messages: Message[];
  model: string;
}

export async function fetchCompletion({ messages, model }: FetchCompletionArgs) {
  try {
    console.log('fetching chat completion...');
    const response = await fetch(OPENROUTER_API_V1_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
      	Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      	'HTTP-Referer': 'robcmills.net', // Optional. Site URL for rankings on openrouter.ai.
      	'X-Title': 'openchat', // Optional. Site title for rankings on openrouter.ai.
      	'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      	model,
      	messages,
      }),
    });
    console.log('parsing response...');
    const json = await response.json();
    console.log('parsed response');
    return json;
  } catch (error) {
    console.error(error);
  }
}


export async function getModels() {
  try {
    console.log('fetching models...');
    const response = await fetch(OPENROUTER_API_V1_MODELS_URL);
    console.log('models fetched');
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function writeModels() {
  try {
    const models = await getModels();
    // const file = await Deno.open('models.json', { write: true, create: true });
    // await Deno.writeTextFile(file, JSON.stringify(models, null, 2));
    await Deno.writeTextFile('models.json', JSON.stringify(models, null, 2));
    console.log('wrote models.json');
  } catch (error) {
    console.error(error);
  }
}
