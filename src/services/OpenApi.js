import OpenAI from "openai";

const chromeExtension =
  typeof chrome !== "undefined" && typeof chrome.tabs !== "undefined";

const API_API_TOKEN = process.env.OPEN_API_KEY;

const fieldNames = ["name", "first_name", "middle_name", "last_name"];

const instructions =
  "You will recieve HTML, and you will output the names or ids of the input fields and buttons in JSON format." +
  "This JSON contains my autofill data names: " +
  JSON.stringify(fieldNames) +
  "\n" +
  "The output JSON should be arrays of objects, each object with the following keys: 'field_name', 'id', 'name', 'type'." +
  "field_name is the name of the field that matches my autofill data names." +
  "The HTML fields don't have to match the autofill data names exactly, but they should be of the same type." +
  "For example, if the autofill data name is 'first_name', the field name could be 'first-name' or 'first name'." +
  "If the field type is select, add an options key with an array of options." +
  "You can remove fields not found in the HTML in the response." +
  "Only return the JSON object. If you can't find any fields, return an empty array.";

export default class OpenApi {
  constructor() {
    this.openai = new OpenAI({
      apiKey: API_API_TOKEN,
      dangerouslyAllowBrowser: true,
    });
  }

  async getAssistant() {
    if (chrome) {
      await chrome.storage.sync.remove("assistantId");
      const { assistantId } = await chrome.storage.sync.get("assistantId");
      if (assistantId) {
        return assistantId;
      } else {
        return await this.createAssistant();
      }
    }
  }

  async createAssistant() {
    const assistant = await this.openai.beta.assistants.create({
      name: "Application Autofill HTML Parser Assistant",
      instructions: instructions,
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4o-2024-05-13",
    });

    if (chromeExtension) {
      await chrome.storage.sync.set({ assistantId: assistant.id });
    }

    return assistant.id;
  }

  async parseHtml(html) {
    const thread = await this.openai.beta.threads.create();
    await this.openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "```html" + html + "```",
    });
    let run = await this.openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: await this.getAssistant(),
    });
    if (run.status === "completed") {
      const messages = await this.openai.beta.threads.messages.list(
        run.thread_id
      );
      for (const message of messages.data.reverse()) {
        if (message.role === "assistant") {
          let content = message.content[0].text.value;
          if (content === "no") {
            return;
          }
          content = content.replace(/```json|```/g, "").trim();
          return JSON.parse(content);
        }
      }
    } else {
      console.log(run.status);
    }
  }
}
