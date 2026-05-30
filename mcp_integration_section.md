# MCP Integration for rss-todoapp

## Overview
In a Go‑Orca workflow, the **MCP** (Model Context Protocol) allows pods to discover and invoke external tools. For this simple todo app, the most useful tools are package managers and linters that run via a local Node.js environment. The configuration lives in `go-orca.yaml` and follows the strict JSON rules defined in `orca://schemas/package.json` – no comments, no trailing commas, and a single root object.

## tools.mcp Configuration
The following snippet shows a minimal `tools.mcp` section that declares two transport mechanisms:

```yaml
tools:
  mcp:
    - name: node
      endpoint: "http://localhost:3000/mcp"
      transport: streamable
    - name: local-node-tools
      command: uvx
      args: ["mcp-server-fetch"]
      transport: command
```

* `streamable`* (the default) is ideal for modern HTTP‑based MCP servers that support bidirectional streaming. It gives low latency and is the most widely supported transport.

* `sse`* (Server‑Sent Events) is useful when the MCP server is legacy or constrained to a one‑way push. It is simpler to implement but cannot send arbitrary binary data.

* `command`* runs a local subprocess (e.g., a Node script). It is perfect for development environments where you want to spin up a lightweight tool without exposing an HTTP endpoint.

## Use Cases
1. **Build & Test** – Use `streamable` to invoke `npm run build` or `npm test` from the pod.
2. **Linting** – The `command` transport can run `eslint` locally via a small wrapper script.
3. **Dependency Scanning** – If an external server provides a REST API for vulnerability scanning, `streamable` can stream results back to the pod.

## Linking to package.json
All commands that touch the Node ecosystem must respect the strict JSON format of `package.json` as outlined in `orca://schemas/package.json`. The file must start with `{`, use double‑quoted keys, and avoid trailing commas. This guarantees that `pnpm install` and `npm run` commands executed via MCP will succeed.

## Summary
By defining both `streamable` and `command` transports, the workflow remains flexible: it can interact with external HTTP services in production while still allowing quick local development via subprocess tools.
