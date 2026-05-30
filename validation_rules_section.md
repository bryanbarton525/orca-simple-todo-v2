# Implementation Validation Rules

The following rules govern how a project is validated before a run in the homelab node toolchain. They apply to every workflow that builds a single‑page app or a Go service.

## Checklist

| Item | Requirement |
|------|-------------|
| **Strict JSON manifests** | `package.json` must be pure JSON – no comments, no trailing commas, exactly one root object.  Errors such as *"Unexpected token '/'"* will abort `npm install`.
| **Go module integrity** | `go.mod` must contain the exact module path used by imports.  A mismatch (`module github.com/foo/bar` vs `import "github.com/foo/baz"`) causes `go build` to fail.
| **Test isolation** | Implementation (`*.go`) and test (`*_test.go`) files must live in separate files with the same package name.  Tests should use `httptest.NewServer`, fresh `http.ServeMux`, and `defer ts.Close()`.
| **MCP configuration** | Refer to the MCP configuration section above for correct server setup.  An incorrectly configured MCP will surface *"git checkout: exit status 128"*.

## False Positives in Go

The following table lists idiomatic patterns that are often mistaken as errors by naive linting tools.

| Pattern | Why it is valid |
|---------|-----------------|
| `append(dst, src...)` | Built‑in slice spread is part of the language spec.
| `var _ Iface = (*T)(nil)` | Compile‑time interface satisfaction check.
| `fmt.Errorf("msg: %w", err)` | Standard error‑wrapping verb.
| `//go:embed` | Supported since Go 1.16.
| `named return in defer` | Idiomatic error capture.
| `errors.Is/As` on wrapped chains | Correct unwrapping API.

Any deviation from these rules will cause the corresponding validation step to fail, so strictly follow the checklist before committing.
