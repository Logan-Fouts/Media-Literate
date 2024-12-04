chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getBreakDown') {
        callApi()
            .then(result => {
                sendResponse({ success: true, data: result });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }
});

async function callApi() {
    try {
        const [pageText, apiKey] = await Promise.all([
            new Promise((resolve) => {
                chrome.storage.local.get(['pageText'], (result) => {
                    resolve(result.pageText);
                });
            }),
            new Promise((resolve) => {
                chrome.storage.local.get(['googleAPIKey'], (result) => {
                    resolve(result.googleAPIKey);
                });
            })
        ]);

        if (!pageText || !apiKey) {
            throw new Error('Missing required data (pageText or API key)');
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const instructions = `Please try to be extremely brief, first present a sentence summarizes the quality of the article then go on to do the more detailed breakdown. Please provide a Media Literacy Breakdown of the following article focusing on potential lies disinformation or biases.
                            1. Examine the article's language, tone, and framing. Look for any bias, emotionally-charged words, or attempts to sway the reader's opinion.
                            2. Identify the key facts, data, and direct quotes. Assess whether they provide a balanced perspective or if certain viewpoints are emphasized.
                            3. Consider the overall narrative and any potential omissions of relevant information or alternative viewpoints.
                            4. Evaluate the credibility and diversity of the sources cited.
                            5. Reflect on how the article's design and structure might influence the reader's understanding.
                            Provide a concise summary of your analysis, highlighting areas where the article demonstrates balanced reporting as well as any potential biases or limitations in its coverage.`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: instructions + pageText
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}