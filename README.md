# CodeCraft CLI

[![CodeCraft CLI CI](https://github.com/im-rahulr/gemini-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/im-rahulr/gemini-cli/actions/workflows/ci.yml)

![CodeCraft CLI Screenshot](./docs/assets/gemini-screenshot.png)

**CodeCraft CLI** is a powerful command-line AI workflow tool that connects to your development tools, understands your code, and accelerates your workflows. Built on Google's Gemini AI technology, CodeCraft provides an intelligent coding assistant right in your terminal.

## ✨ Features

With CodeCraft CLI you can:

- 🔍 **Query and edit large codebases** in and beyond CodeCraft's 1M token context window
- 🎨 **Generate new applications** from PDFs, sketches, or descriptions using CodeCraft's multimodal capabilities
- ⚡ **Automate operational tasks** like querying pull requests, handling complex rebases, and code reviews
- 🔧 **Extend functionality** with tools and MCP servers, including [media generation capabilities](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
- 🌐 **Ground your queries** with the [Google Search](https://ai.google.dev/gemini-api/docs/grounding) tool built into CodeCraft
- 💡 **Interactive coding assistance** with real-time suggestions and code generation

## 🚀 Installation

### Prerequisites

- [Node.js version 18](https://nodejs.org/en/download) or higher
- A Google account for authentication

### Quick Install

Install CodeCraft CLI globally using npm:

```bash
npm install -g codecraft-cli
```

### Verify Installation

Check that CodeCraft CLI is installed correctly:

```bash
codecraft --version
```

## 🛠️ Setup & Configuration

### 1. First Run

Launch CodeCraft CLI:

```bash
codecraft
```

### 2. Authentication Setup

When you first run CodeCraft, you'll be prompted to authenticate:

1. **Choose authentication method:** Sign in with your personal Google account
2. **Browser authentication:** CodeCraft will open your browser for Google OAuth
3. **Grant permissions:** Allow CodeCraft to access CodeCraft API on your behalf

This grants you:
- ✅ Up to **60 model requests per minute**
- ✅ **1,000 model requests per day** using Gemini
- ✅ Access to all Gemini models and capabilities

### 3. Theme Selection

Choose your preferred color theme for the best terminal experience.

### 4. Advanced Authentication (Optional)

For advanced use cases or higher limits, you can use an API key:

1. Generate a key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Set it as an environment variable:

```bash
export GEMINI_API_KEY="YOUR_API_KEY"
```

For other authentication methods, including Google Workspace accounts, see our [authentication guide](https://codecraft-team.netlify.app/docs/cli/authentication).

## 📖 Usage Examples

### Basic Usage

Start CodeCraft in any directory:

```bash
cd your-project/
codecraft
```

### Example Commands

**Generate a new application:**
```bash
codecraft
> Create a React todo app with TypeScript and Tailwind CSS
```

**Analyze existing code:**
```bash
codecraft
> Explain the architecture of this codebase and suggest improvements
```

**Code review assistance:**
```bash
codecraft
> Review the changes in my latest commit and suggest optimizations
```

**Debug assistance:**
```bash
codecraft
> Help me debug this error: [paste error message]
```

### Working with Files

Reference specific files in your prompts:

```bash
codecraft
> @src/components/Header.tsx - Refactor this component to use hooks
```

### Project Analysis

Clone and analyze any repository:

```bash
git clone https://github.com/your-username/your-project
cd your-project
codecraft
> Give me a summary of this project's structure and main features
```

## 🎯 Available Commands

CodeCraft CLI includes several built-in commands to enhance your workflow:

- `/help` - Show available commands and shortcuts
- `/docs` - Open full CodeCraft CLI documentation in your browser
- `/quit` - Exit the CLI
- `/memory` - Manage conversation memory
- `/stats` - Check session statistics
- `/editor` - Set external editor preferences
- `/compress` - Compress context by replacing it with a summary

## 📊 Analytics & Privacy

CodeCraft CLI includes an optional analytics system to help improve the product. **All analytics collection is user-controlled and can be disabled.**

### Privacy Controls

```bash
# Disable analytics entirely
ANALYTICS_ENABLED=false

# Disable collection of prompt content
ANALYTICS_COLLECT_PROMPTS=false

# Disable collection of user email
ANALYTICS_COLLECT_EMAIL=false
```

For detailed information about data collection, privacy controls, and compliance, see [Analytics Documentation](docs/analytics.md).

## 🔄 Updating CodeCraft CLI

Keep your CLI up to date with the latest features and improvements:

### Built-in Update Command
```bash
# From within the CLI
/update
```

### Manual Update Methods

**NPM Global Installation:**
```bash
# Check current version
npm list -g @google/gemini-cli

# Update to latest version
npm update -g @google/gemini-cli
```

**Git Repository:**
```bash
# Navigate to CLI directory
cd path/to/gemini-cli

# Pull latest changes
git pull origin main

# Reinstall dependencies and rebuild
npm install && npm run build
```

## 🔧 Troubleshooting

### Common Installation Issues

**Issue: `npm install -g codecraft-cli` fails with permission errors**
```bash
# Solution: Use npx or fix npm permissions
npx codecraft-cli

# Or fix npm permissions (macOS/Linux):
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

**Issue: `codecraft: command not found`**
```bash
# Solution: Check if npm global bin is in PATH
npm config get prefix
# Add the bin directory to your PATH in ~/.bashrc or ~/.zshrc
export PATH="$(npm config get prefix)/bin:$PATH"
```

**Issue: Authentication fails**
```bash
# Solution: Clear authentication cache and retry
rm -rf ~/.codecraft/
codecraft
```

**Issue: Node.js version compatibility**
```bash
# Check Node.js version (requires 18+)
node --version

# Update Node.js if needed
# Visit: https://nodejs.org/en/download
```

### Getting Help

- 📚 **Documentation:** [https://codecraft-team.netlify.app/docs](https://codecraft-team.netlify.app/docs)
- 🐛 **Report Issues:** [GitHub Issues](https://github.com/im-rahulr/gemini-cli/issues)
- 💬 **Community Support:** Check our documentation for community resources

## 👨‍💻 Developed By

**CodeCraft CLI** is developed and maintained by **Rahul**.

🌐 **Developer Portfolio:** [https://im-rahul.netlify.app/#](https://im-rahul.netlify.app/#)

### About the Developer

Rahul is a passionate software developer focused on creating innovative AI-powered development tools. CodeCraft CLI represents his vision of making AI assistance accessible and powerful for developers worldwide.

---

*Built with ❤️ by [Rahul](https://im-rahul.netlify.app/#) | Powered by Google Gemini AI*

## Examples

Once the CLI is running, you can start interacting with CodeCraft from your shell.

You can start a project from a new directory:

```sh
cd new-project/
codecraft
> Write me a CodeCraft Discord bot that answers questions using a FAQ.md file I will provide
```

Or work with an existing project:

```sh
git clone https://github.com/im-rahulr/gemini-cli
cd gemini-cli
codecraft
> Give me a summary of all of the changes that went in yesterday
```

### Next Steps

- 📚 **[Complete Documentation](https://codecraft-team.netlify.app/docs)** - Full guide to CodeCraft CLI
- 🛠️ **[Available Commands](https://codecraft-team.netlify.app/docs/cli/commands)** - All CLI commands and shortcuts
- 🔧 **[Troubleshooting Guide](https://codecraft-team.netlify.app/docs/troubleshooting)** - Common issues and solutions
- 🏗️ **[Architecture Overview](https://codecraft-team.netlify.app/docs/architecture)** - How CodeCraft CLI works
- 🤝 **[Contributing Guide](./CONTRIBUTING.md)** - Help improve CodeCraft CLI

## 🎯 Popular Use Cases

### 🔍 Explore a New Codebase

Start by navigating to any repository and running CodeCraft:

```bash
cd your-project/
codecraft
> Describe the main pieces of this system's architecture and how they interact
```

```bash
codecraft
> What security mechanisms are in place in this application?
```

### 💻 Work with Your Existing Code

```bash
codecraft
> Implement a first draft for GitHub issue #123 with proper error handling
```

```bash
codecraft
> Help me migrate this codebase to the latest version of Java. Start with a migration plan
```

### ⚡ Automate Your Workflows

Use MCP servers to integrate your local system tools with your enterprise collaboration suite:

```bash
codecraft
> Create a slide deck showing the git history from the last 7 days, grouped by feature and team member
```

```bash
codecraft
> Build a full-screen web app for a wall display to show our most interacted-with GitHub issues
```

### 🔧 System Integration

```bash
codecraft
> Convert all images in this directory to PNG and rename them using dates from EXIF data
```

```bash
codecraft
> Organize my PDF invoices by month of expenditure and create a summary report
```

## 📄 Terms of Service and Privacy Notice

For details on the terms of service and privacy notice applicable to your use of CodeCraft CLI, see the [Terms of Service and Privacy Notice](https://codecraft-team.netlify.app/docs/tos-privacy).
