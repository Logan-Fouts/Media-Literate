import config from './config.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    const prompt = request.text;
    if (prompt) {
      callApi(prompt).then(responseText => {
        chrome.runtime.sendMessage({ action: "displayResult", text: responseText });
      });
    }
  }
});

async function callApi(prompt) {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(config.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const instructions = `Please try to be extremely brief, first present a sentence summarizes the quality of the article then go on to do the more detailed breakdown. Please provide a Media Literacy Breakdown of the following article focusing on potential lies disinformation or biases.

1. Examine the article's language, tone, and framing. Look for any bias, emotionally-charged words, or attempts to sway the reader's opinion.

2. Identify the key facts, data, and direct quotes. Assess whether they provide a balanced perspective or if certain viewpoints are emphasized.

3. Consider the overall narrative and any potential omissions of relevant information or alternative viewpoints.

4. Evaluate the credibility and diversity of the sources cited.

5. Reflect on how the article's design and structure might influence the reader's understanding.

Provide a concise summary of your analysis, highlighting areas where the article demonstrates balanced reporting as well as any potential biases or limitations in its coverage.`;

    const result = await model.generateContent(instructions + prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    return "Error processing the text.";
  }
}