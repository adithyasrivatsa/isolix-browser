# Prism Browser

A minimal, productivity-focused desktop browser built with Electron. Prism provides clean, isolated browser panels with persistent sessions—perfect for managing multiple accounts and eliminating context switching.

![Prism Browser](https://img.shields.io/badge/Electron-28.2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🎯 Distraction-Free**: No traditional browser clutter—just your content
- **🔐 Session Isolation**: Each panel maintains independent cookies and storage
- **💾 Full Persistence**: All panels, workspaces, and login sessions survive restarts
- **🗂️ Workspace Management**: Organize panels into workspaces for different contexts
- **⚡ Real Browser Engine**: Powered by Chromium for full web compatibility
- **🎨 Clean UI**: Minimal interface with hover-to-expand panels

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev
```

### Building for Production

#### Windows Installer

```bash
# Rebuild native modules for Electron
npm run rebuild

# Build the Windows installer (NSIS)
npm run electron:build:win

# The installer will be in:
# release/Prism-Setup-1.0.0.exe
```

#### Other Platforms

```bash
# Linux (tar.gz + AppImage)
npm run electron:build:linux

# All platforms
npm run electron:build:all
```

#### Native Module Considerations

Prism uses `better-sqlite3`, a native Node.js module that must be compiled for Electron. The `postinstall` script automatically handles this when you run `npm install`. If you experience issues:

```bash
# Manually rebuild native modules
npm run rebuild

# Clean rebuild
npm install --force
npm run rebuild
```

#### What Gets Built

- **Installer**: NSIS installer with Start Menu shortcuts and desktop shortcut
- **Portable**: Unpacked version in `release/win-unpacked/` for testing
- **Icon**: Custom Prism icon throughout the application
- **Size**: Approximately 80-100 MB installed


## 📖 Usage

### Adding a Site
1. Click the **"Add Site"** button in the header
2. Enter a name (e.g., "ChatGPT")
3. Enter the URL (e.g., `https://chat.openai.com`)
4. Click **"Launch Panel"**

### Managing Workspaces
- **Create**: Click the "+" icon in the sidebar
- **Switch**: Click any workspace name in the sidebar
- **Rename**: Double-click a workspace name
- **Delete**: Click the trash icon next to a workspace

### Panel Features
- **Navigate**: Use back/forward/reload buttons when panel is active
- **Edit**: Click title or URL to edit when panel is hovered
- **Remove**: Click the X button that appears on hover
- **Expand**: Hover over a panel to expand it (configurable delay)

## 🏗️ Architecture

```
prism-browser/
├── electron/
│   ├── main.js      # Main process (window & database management)
│   └── preload.js   # IPC bridge for secure communication
├── components/
│   ├── Panel.tsx    # Individual browser panel with webview
│   └── Sidebar.tsx  # Workspace management sidebar
├── App.tsx          # Main application logic
├── types.ts         # TypeScript type definitions
└── index.html       # Application entry point
```

### Key Technologies
- **Electron**: Desktop application framework
- **React**: UI library
- **TypeScript**: Type-safe development
- **better-sqlite3**: Local database for persistence
- **Vite**: Fast development build tool
- **TailwindCSS**: Utility-first styling

## 🔧 Development

### Scripts

```bash
npm run dev           # Run Vite dev server only
npm run electron:dev  # Run full Electron app with hot reload
npm run build         # Build renderer for production
npm run electron:build # Build complete application
npm run start         # Start built Electron app
```

### Database Schema

**Workspaces**
- id, name, is_active, created_at

**Panels**
- id, workspace_id, title, url, color, partition_id, position

**Settings**
- key, value

Database location: `%APPDATA%/prism-browser/prism.db` (Windows)

## 🎯 Use Cases

- **Multi-Account Management**: Run multiple Gmail/Slack/etc. accounts simultaneously
- **AI Workflow**: Compare responses from ChatGPT, Claude, Gemini side-by-side
- **Development**: Monitor production, staging, and local environments
- **Research**: Keep references open without tab overload
- **Focus Sessions**: Curated workspace for deep work

## 🐛 Troubleshooting

### Build Issues

#### Native module rebuild fails
```bash
# Install windows-build-tools (run as Administrator)
npm install --global windows-build-tools

# Or install Visual Studio Build Tools manually
# Then rebuild
npm run rebuild
```

#### "better-sqlite3.node not found" error
- Ensure the `asarUnpack` configuration includes `better-sqlite3`
- Run `npm run rebuild` before building
- Check that `node_modules/better-sqlite3` exists

#### Installer doesn't create properly
- Verify the `build/icon.png` file exists
- Check that all dependencies are installed: `npm install`
- Look for errors in `release/builder-debug.yml`

### Runtime Issues

#### Panels not loading?
- Check that URLs include `https://` prefix
- Verify internet connection
- Try reloading the panel with the reload button

#### Sessions not persisting?
- Check database file exists in app data directory
- Verify panels use `persist:` partition prefix
- Don't manually delete workspace folders

#### Webview not rendering?
- Ensure `webviewTag: true` is set in main process
- Check Electron version compatibility
- Verify no CSP blocks in loaded pages

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

Built with inspiration from productivity-focused browsers and workspace managers. Special thanks to the Electron and React communities.

---

**Made with ❤️ for focused, distraction-free browsing**
