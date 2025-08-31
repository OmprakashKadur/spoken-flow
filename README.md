# 🎓 Spoken Flow - English Learning App

A comprehensive Next.js 14 application for English language learning, featuring structured content, progress tracking, and audio recording capabilities.

## ✨ Features

- **📚 Multiple Learning Categories**: Words, Sentences, Phrases, Public Speaking, Interviews, and Office conversations
- **💾 Progress Tracking**: LocalStorage-based progress saving and marked items system
- **🎤 Audio Recording**: Built-in recorder with preview, download, and discard functionality
- **📱 Responsive Design**: Mobile-first design with TailwindCSS
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📖 Auto-scrolling**: Adjustable speed and font size for long content
- **🔄 Pagination**: Navigate through multiple JSON files seamlessly

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spoken-flow
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
spoken-flow/
├── public/
│   └── data/                    # JSON content files
│       ├── words/               # Vocabulary files
│       ├── sentences/           # Sentence files with translations
│       ├── phrases/             # Idioms and phrases
│       ├── public-speaking/     # Speech content
│       ├── interviews/          # Interview dialogues
│       └── office/              # Workplace conversations
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── categories/          # Category pages
│   │   ├── marked/              # Marked items page
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable components
│   │   ├── CategoryCard.tsx     # Category display card
│   │   ├── DarkModeToggle.tsx   # Theme switcher
│   │   ├── MarkButton.tsx       # Mark/unmark items
│   │   ├── MarkedView.tsx       # Marked items display
│   │   ├── Paginator.tsx        # Page navigation
│   │   ├── Recorder.tsx         # Audio recording
│   │   └── SentenceScroller.tsx # Auto-scrolling text
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts             # App interfaces
│   └── utils/                   # Utility functions
│       ├── data.ts              # Data loading utilities
│       └── storage.ts           # LocalStorage operations
└── package.json                 # Dependencies and scripts
```

## 📊 Data Structure

### Words
```json
[
  { "id": 1, "word": "Confidence", "meaning": "belief in yourself" }
]
```

### Sentences
```json
[
  { "id": 1, "en": "Hello, how are you?", "kn": "ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?" }
]
```

### Speeches
```json
{
  "id": 1,
  "title": "Speech Title",
  "content": ["Line 1", "Line 2", "Line 3"]
}
```

### Conversations
```json
{
  "id": 1,
  "title": "Conversation Title",
  "dialogue": [
    { "speaker": "Person A", "en": "Hello" },
    { "speaker": "Person B", "en": "Hi there!" }
  ]
}
```

## 🎯 Usage

### Learning Flow
1. **Landing Page**: Choose a learning category
2. **Category Page**: Browse content with pagination
3. **Mark Items**: Click the mark button to save for later
4. **Practice**: Use the recorder for speeches and conversations
5. **Review**: Access marked items from the dedicated page

### Features
- **Mark System**: Toggle items as marked/unmarked
- **Progress Saving**: Automatically saves last visited page
- **Audio Recording**: Record, preview, and download audio
- **Auto-scroll**: Adjustable speed for long content
- **Responsive**: Works on all device sizes

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS v4
- **Language**: TypeScript
- **Storage**: LocalStorage (client-side)
- **Audio**: MediaRecorder API
- **Icons**: SVG icons and emojis

## 📱 Responsive Design

- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly controls
- Optimized for all device types

## 🌙 Dark Mode

- System preference detection
- Manual toggle option
- Persistent theme selection
- Smooth transitions

## 🔧 Customization

### Adding New Content
1. Create JSON files in the appropriate category folder
2. Follow the established data structure
3. Files are automatically detected and paginated

### Styling
- Modify TailwindCSS classes in components
- Update color schemes in the CSS variables
- Customize animations and transitions

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
No environment variables required - the app runs entirely client-side.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using Next.js and TailwindCSS**
