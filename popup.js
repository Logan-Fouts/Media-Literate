chrome.storage.local.get(['analysisResult', 'analysisError'], function (result) {
    if (result.analysisResult) {
        document.getElementById('result').textContent = result.analysisResult;
    } else if (result.analysisError) {
        document.getElementById('result').textContent = 'Error: ' + result.analysisError;
    }
});

function checkKey() {
    chrome.storage.local.get(['googleAPIKey'], function (result) {
        if (!result.googleAPIKey) {
            getAPIKey();
        } else {
            setupContainer();
        }
    });
}

function setupContainer() {
    const scanButton = document.createElement('button');
    scanButton.textContent = 'Get Breakdown';
    scanButton.onclick = function () {
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="loading-container">
                    <div class="spinner"></div>
                    <p>Analyzing article...</p>
                </div>
            `;
        }

        // Disable button while loading
        scanButton.disabled = true;
        scanButton.textContent = 'Analyzing...';

        chrome.runtime.sendMessage({
            action: 'getBreakDown',
        }, response => {
            if (chrome.runtime.lastError) {
                console.error('Error:', chrome.runtime.lastError);
                resultDiv.innerHTML = 'Error: ' + chrome.runtime.lastError.message;
                scanButton.disabled = false;
                scanButton.textContent = 'Try Again';
                return;
            }
            
            if (response.success) {
                const resultDiv = document.getElementById('result');
                if (resultDiv) {
                    const htmlContent = convertMarkdownToHtml(response.data);
                    resultDiv.innerHTML = htmlContent;
                    document.querySelectorAll('button').forEach(button => button.remove());
                }
            } else {
                console.error('Analysis failed:', response.error);
                resultDiv.innerHTML = 'Error: ' + response.error;
                scanButton.disabled = false;
                scanButton.textContent = 'Try Again';
            }
        });
    };
    document.body.appendChild(scanButton);
}

function getAPIKey() {
    const heading = document.createElement('h2');
    heading.textContent = 'Please Fill In Your API Key';

    const url = document.createElement('a');
    url.href = 'https://aistudio.google.com/apikey';
    url.textContent = 'Google AI Studio';
    url.target = '_blank';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'API Key Here';
    input.id = 'apiKeyInput';

    const container = document.createElement('div');
    container.appendChild(heading);
    container.appendChild(url);
    container.appendChild(input);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save API Key';
    saveButton.onclick = function () {
        const apiKey = input.value.trim();
        if (apiKey) {
            chrome.storage.local.set({ googleAPIKey: apiKey }, function () {
                alert('API Key saved!');
                // container.remove(); TODO: Setup extension so it will now see the new api key!
            });
        } else {
            alert('Please enter a valid API key');
        }
    };

    container.appendChild(saveButton);
    document.body.appendChild(container);
}
checkKey();

function convertMarkdownToHtml(markdown) {
    if (!markdown) return '';

    const rules = [
        // Headers
        [/^# (.*$)/gm, '<h1>$1</h1>'],
        [/^## (.*$)/gm, '<h2>$1</h2>'],
        [/^### (.*$)/gm, '<h3>$1</h3>'],

        // Bold
        [/\*\*(.*?)\*\*/g, '<strong>$1</strong>'],

        // Italic
        [/\*(.*?)\*/g, '<em>$1</em>'],

        // Code blocks
        [/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>'],

        // Inline code
        [/`([^`]+)`/g, '<code>$1</code>'],

        // Links
        [/$$([^$$]+)\]$$([^$$]+)\)/g, '<a href="$2" target="_blank">$1</a>'],

        // Lists (changed to use bullets for both)
        [/^\* (.+)/gm, '<ul><li>$1</li></ul>'],
        [/^\d\. (.+)/gm, '<ul><li>$1</li></ul>'], // Changed from ol to ul

        // Paragraphs
        [/^(?!<[a-z])(.*$)/gm, '<p>$1</p>']
    ];

    let html = markdown;
    rules.forEach(([rule, template]) => {
        html = html.replace(rule, template);
    });

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    // Convert line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
}