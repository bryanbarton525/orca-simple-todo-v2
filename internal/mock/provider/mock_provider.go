package provider

import (
    \"context\"
)

// MockModelProviderInfo holds information about a mock model provider.
type MockModelProviderInfo struct {
    ProviderName string
    ModelName    string
    Capabilities []string
    Status       string
}

// OllamaModelInfo is an alias to MockModelProviderInfo for compatibility.
type OllamaModelInfo = MockModelProviderInfo

// MockModelProvider is a simple in-memory model provider.
type MockModelProvider struct {
    models []OllamaModelInfo
}

// NewMockModelProvider creates a new provider with the given models.
func NewMockModelProvider(models []OllamaModelInfo) *MockModelProvider {
    return &MockModelProvider{models: models}
}

// Methods returns the configured list of models or an error if the context is cancelled.
func (p *MockModelProvider) Methods(ctx context.Context) ([]OllamaModelInfo, error) {
    select {
    case <-ctx.Done():
        return nil, ctx.Err()
    default:
    }

    // Return a copy to preserve immutability.
    out := make([]OllamaModelInfo, len(p.models))
    copy(out, p.models)
    return out, nil
}
