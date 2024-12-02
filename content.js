const pageText = document.body.innerText;

chrome.runtime.sendMessage({ action: "extractText", text: pageText });