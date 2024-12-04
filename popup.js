function checkKey() {
    chrome.storage.local.get(['googleAPIKey'], function(result) {
        console.log(result.googleAPIKey);
        if (!result.googleAPIKey) {
            getAPIKey();
        }
    });
}

function getAPIKey() {
    // Create message for user
    const heading = document.createElement('h2');
    heading.textContent = 'Please Fill In Your API Key';

    // Create link to get API key
    const url = document.createElement('a');
    url.href = 'https://aistudio.google.com/apikey';
    url.textContent = 'Google AI Studio';
    url.target = '_blank';

    // Create input for API key
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'API Key Here';
    input.id = 'apiKeyInput';
    
    // Create a container div for better organization
    const container = document.createElement('div');
    container.appendChild(heading);
    container.appendChild(url);
    container.appendChild(input);

    // Optionally add a button to save/use the API key
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save API Key';
    saveButton.onclick = function () {
        const apiKey = input.value.trim();
        if (apiKey) {
            // Save to Chrome storage instead of localStorage
            chrome.storage.local.set({googleAPIKey: apiKey}, function() {
                alert('API Key saved!');
                // Optional: Remove the input elements after saving
                container.remove();
            });
        } else {
            alert('Please enter a valid API key');
        }
    };

    container.appendChild(saveButton);
    document.body.appendChild(container);
}
checkKey();