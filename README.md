# Media Literate Chrome Extension

A Chrome extension that helps users analyze web content through the lens of media literacy using AI to examine language, tone, bias, and other key elements.

## Quick Start

1. Clone the repository
2. Get a Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Replace `YOUR_API_KEY_HERE` in `google-ai-client.js`
4. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory

## Features

- Extracts and analyzes webpage content
- Examines:
  - Language and tone
  - Potential bias
  - Facts and sources
  - Narrative structure
- Presents analysis in readable format

## Project Structure

```
media-literate/
├── manifest.json           # Extension config
├── background.js          # Service worker
├── content.js            # Webpage interaction
├── popup.html           # Interface
├── popup.js            # Popup logic
├── google-ai-client.js # API client
├── marked.min.js      # Markdown parser
├── styles.css        # Styling
└── images/
    └── reading.png  # Icon
```

## Usage

1. Navigate to any webpage
2. Click the Media Literate icon
3. View the analysis in the popup

## Dependencies

- Google Generative AI API
- Chrome Extensions API

## Contributing

Feel free to open issues or submit pull requests.

## License

MIT License

---
