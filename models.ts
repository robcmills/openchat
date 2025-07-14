import { OPENROUTER_API_V1_MODELS_URL } from "./constants.ts";

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

await writeModels();
