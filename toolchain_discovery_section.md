Toolchain Discovery

When starting a new project, the orchestration engine first queries the available toolchains defined in the workspace configuration. For Go projects, the engine looks for a `go.mod` file at the root and parses the `module` directive to confirm the import path. It then checks for common layout profiles – the default Go (service/app) layout with `cmd/`, `internal/`, `pkg/`, etc. – and verifies that the directory structure matches the expected profile before any build steps are invoked.

For Node projects, the engine expects a strict JSON `package.json` at the workspace root. It validates that the file contains the required fields (`name`, `version`, `scripts`, etc.) and that the `scripts` section includes at least a `dev` command. It also detects the presence of a `pnpm-workspace.yaml` if the project uses a workspace setup, otherwise it proceeds with a single‑package layout.

The discovery phase also gathers environment variables, resolves peer dependencies, and selects the appropriate runtime (Node.js 20 or Go 1.22). Once discovery succeeds, the engine registers the tools and proceeds to the next step in the workflow.

Example snippets

```go
// go.mod
module github.com/go-orca/go-orca

go 1.22
```

```json
// package.json
{
  "name": "rss-todoapp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

By ensuring that the foundational files match the expected layouts, the engine can reliably invoke the correct build, test, and deployment pipelines for both Go and Node stacks.