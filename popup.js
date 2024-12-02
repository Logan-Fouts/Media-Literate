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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayResult") {
        const textOutputElement = document.getElementById('textOutput');
        if (textOutputElement) {
            const htmlContent = convertMarkdownToHtml(request.text);
            textOutputElement.innerHTML = htmlContent;
        }
    }
});