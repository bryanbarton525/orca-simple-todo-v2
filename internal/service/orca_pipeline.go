package service

import (
    "context"
    "fmt"
    "sync"
)

// ContentFetcher defines an interface to fetch raw content.
type ContentFetcher interface {
    Fetch(ctx context.Context) (string, error)
}

// RateLimiter defines an interface to enforce rate limits.
type RateLimiter interface {
    Allow(ctx context.Context) error
}

// MarkdownConverter defines an interface to convert markdown.
type MarkdownConverter interface {
    Convert(ctx context.Context, md string) (string, error)
}

// DBPersister defines an interface to persist data.
type DBPersister interface {
    Persist(ctx context.Context, data string) error
}

// OrcaPipeline coordinates the entire processing flow.
type OrcaPipeline struct {
    fetcher    ContentFetcher
    limiter    RateLimiter
    converter  MarkdownConverter
    persister  DBPersister
    mu         sync.Mutex // protects compound operations
}

// PipelineConfig can hold configuration values for the pipeline.
type PipelineConfig struct {
    // Add configuration fields as needed
}

// PipelineResult holds the outcome of a pipeline run.
type PipelineResult struct {
    ID   string
    Data string
}

// PipelineError wraps an error with additional context.
type PipelineError struct {
    Err    error
    Detail string
}

func (e *PipelineError) Error() string {
    if e.Err == nil {
        return e.Detail
    }
    return fmt.Sprintf("%s: %v", e.Detail, e.Err)
}

func (e *PipelineError) Unwrap() error { return e.Err }

// OrcaPipelineService provides a Run method to execute the pipeline.
type OrcaPipelineService struct {
    pipeline *OrcaPipeline
}

// NewOrcaPipelineService creates a new service with the provided pipeline.
func NewOrcaPipelineService(p *OrcaPipeline) *OrcaPipelineService {
    return &OrcaPipelineService{pipeline: p}
}

// Run executes the pipeline flow with context and configuration.
func (s *OrcaPipelineService) Run(ctx context.Context, cfg PipelineConfig) (*PipelineResult, error) {
    // Ensure mutual exclusion for the compound operation.
    s.pipeline.mu.Lock()
    defer s.pipeline.mu.Unlock()

    // Rate limit check.
    if err := s.pipeline.limiter.Allow(ctx); err != nil {
        return nil, fmt.Errorf("rate limit: %w", err)
    }

    // Fetch content.
    raw, err := s.pipeline.fetcher.Fetch(ctx)
    if err != nil {
        return nil, fmt.Errorf("fetch: %w", err)
    }

    // Convert markdown.
    conv, err := s.pipeline.converter.Convert(ctx, raw)
    if err != nil {
        return nil, fmt.Errorf("convert: %w", err)
    }

    // Persist the result.
    if err := s.pipeline.persister.Persist(ctx, conv); err != nil {
        return nil, fmt.Errorf("persist: %w", err)
    }

    // Build result.
    res := &PipelineResult{ID: "pipeline-1", Data: conv}
    return res, nil
}
