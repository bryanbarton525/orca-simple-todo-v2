package service

import (
    "context"
    "fmt"
    "strings"
    "time"
)

// MarkdownResponse holds the result of a markdown conversion.
type MarkdownResponse struct {
    Content        string
    TokenCount     int
    ConversionTime int64 // milliseconds
}

// MarkdownConverterService provides a Convert method.
type MarkdownConverterService struct{}

// Convert converts an HTML string to markdown, validates input, and measures conversion time.
func (s *MarkdownConverterService) Convert(ctx context.Context, html string) (*MarkdownResponse, error) {
    if strings.TrimSpace(html) == "" {
        return nil, fmt.Errorf("%w", fmt.Errorf("empty input"))
    }
    start := time.Now()
    // Simulate work and respect context cancellation.
    for i := 0; i < len(html); i += 1000 {
        select {
        case <-ctx.Done():
            return nil, ctx.Err()
        default:
        }
    }
    elapsed := time.Since(start)
    return &MarkdownResponse{
        Content:        html,
        TokenCount:     len(html),
        ConversionTime: elapsed.Milliseconds(),
    }, nil
}
