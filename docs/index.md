# Welcome to CodeCraft CLI documentation

This documentation provides a comprehensive guide to installing, using, and developing CodeCraft CLI. This tool lets you interact with Gemini models through a command-line interface.

## Overview

CodeCraft CLI brings the capabilities of Gemini models to your terminal in an interactive Read-Eval-Print Loop (REPL) environment. CodeCraft CLI consists of a client-side application (`packages/cli`) that communicates with a local server (`packages/core`), which in turn manages requests to the Gemini API and its AI models. CodeCraft CLI also contains a variety of tools for tasks such as performing file system operations, running shells, and web fetching, which are managed by `packages/core`.

## Navigating the documentation

This documentation is organized into the following sections:

- **[Execution and Deployment](https://codecraft-team.netlify.app/docs/deployment):** Information for running CodeCraft CLI.
- **[Architecture Overview](https://codecraft-team.netlify.app/docs/architecture):** Understand the high-level design of CodeCraft CLI, including its components and how they interact.
- **CLI Usage:** Documentation for `packages/cli`.
  - **[CLI Introduction](https://codecraft-team.netlify.app/docs/cli):** Overview of the command-line interface.
  - **[Commands](https://codecraft-team.netlify.app/docs/cli/commands):** Description of available CLI commands.
  - **[Configuration](https://codecraft-team.netlify.app/docs/cli/configuration):** Information on configuring the CLI.
  - **[Checkpointing](https://codecraft-team.netlify.app/docs/checkpointing):** Documentation for the checkpointing feature.
  - **[Extensions](https://codecraft-team.netlify.app/docs/extension):** How to extend the CLI with new functionality.
  - **[Telemetry](https://codecraft-team.netlify.app/docs/telemetry):** Overview of telemetry in the CLI.
- **Core Details:** Documentation for `packages/core`.
  - **[Core Introduction](https://codecraft-team.netlify.app/docs/core):** Overview of the core component.
  - **[Tools API](https://codecraft-team.netlify.app/docs/core/tools-api):** Information on how the core manages and exposes tools.
- **Tools:**
  - **[Tools Overview](https://codecraft-team.netlify.app/docs/tools):** Overview of the available tools.
  - **[File System Tools](https://codecraft-team.netlify.app/docs/tools/file-system):** Documentation for the `read_file` and `write_file` tools.
  - **[Multi-File Read Tool](https://codecraft-team.netlify.app/docs/tools/multi-file):** Documentation for the `read_many_files` tool.
  - **[Shell Tool](https://codecraft-team.netlify.app/docs/tools/shell):** Documentation for the `run_shell_command` tool.
  - **[Web Fetch Tool](https://codecraft-team.netlify.app/docs/tools/web-fetch):** Documentation for the `web_fetch` tool.
  - **[Web Search Tool](https://codecraft-team.netlify.app/docs/tools/web-search):** Documentation for the `google_web_search` tool.
  - **[Memory Tool](https://codecraft-team.netlify.app/docs/tools/memory):** Documentation for the `save_memory` tool.
- **[Contributing & Development Guide](../CONTRIBUTING.md):** Information for contributors and developers, including setup, building, testing, and coding conventions.
- **[Troubleshooting Guide](https://codecraft-team.netlify.app/docs/troubleshooting):** Find solutions to common problems and FAQs.
- **[Terms of Service and Privacy Notice](https://codecraft-team.netlify.app/docs/tos-privacy):** Information on the terms of service and privacy notices applicable to your use of CodeCraft CLI.

We hope this documentation helps you make the most of the CodeCraft CLI!

---

## 👨‍💻 About CodeCraft CLI

**CodeCraft CLI** is developed and maintained by **Rahul**, a passionate software developer focused on creating innovative AI-powered development tools.

🌐 **Developer Portfolio:** [https://im-rahul.netlify.app/#](https://im-rahul.netlify.app/#)

*Built with ❤️ by [Rahul](https://im-rahul.netlify.app/#) | Powered by Google Gemini AI*
