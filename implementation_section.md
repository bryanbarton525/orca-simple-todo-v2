## Implementation section

Go ORCA orchestrates complex software pipelines by assigning persona models (Director, Project Manager, Architect, Pod, QA, Finalizer) to each task. The Director is responsible for routing the request to the right persona set and ensuring that each downstream model has the appropriate capability set (e.g., `tools=yes`). The Project Manager produces the constitution JSON; the Architect drafts the design and task graph; the Pod executes the implementation; QA validates; and the Finalizer assembles the final artifact.

MCP (Model Context Protocol) is the bridge that allows Go ORCA to call external tooling. In `go-orca.yaml` we declare the MCP sources that expose command‑line utilities or HTTP endpoints. A typical configuration looks like this:

```yaml
# go-orca.yaml
name: todo-app
tools:
  mcp:
    - name: fetch
      endpoint: "http://localhost:3000/mcp"
      transport: streamable
    - name: local-tools
      command: uvx
      args: ["mcp-server-fetch"]
      transport: command
```

When a task requires, for example, `fetch` to download a schema, the Pod will resolve that name to the configured MCP source and send a request. This eliminates the need for hard‑coded tool paths in the code and keeps the orchestration declarative.

The Architect produces a task graph JSON that the engine feeds to the Pod. The graph defines nodes, dependencies, and artifact expectations. A minimal snippet for building and testing a Node.js project is:

```json
{
  "nodes": [
    {
      "id": "install_dependencies",
      "type": "task",
      "task": "install_dependencies",
      "inputs": [],
      "outputs": ["pnpm_lock"]
    },
    {
      "id": "run_tests",
      "type": "task",
      "task": "run_tests",
      "inputs": ["pnpm_lock"],
      "outputs": []
    }
  ],
  "dependencies": [
    {"from": "install_dependencies", "to": "run_tests"}
  ]
}
```

Each node references a named pod task (`install_dependencies`, `run_tests`). The engine resolves these names to concrete implementations, executes them in the declared order, and propagates artifact data along the edges.

Implementation validation is performed by the node profile after the Pod finishes. The engine runs `pnpm install` (using the strict JSON `package.json` we corrected), executes the test script, and checks for lint or build failures. If any artifact fails validation, QA generates a blocking issue. The Pod then implements a remediation task (e.g., rewrite `package.json`) and the cycle repeats until the validation succeeds.

In this workflow, the Orchestration layer ensures that each persona’s responsibility is enforced, MCP provides a unified tool interface, the task graph dictates execution order, and validation guarantees that the final product meets the defined acceptance criteria.
