package service

import (
    "context"
    "errors"
    "fmt"
    "sync"
)

// ContentModel represents a piece of content to be written.
type ContentModel struct {
    ID       string
    Title    string
    Content  string
    Metadata map[string]string
}

// WriteResult captures the outcome of a write operation.
type WriteResult struct {
    Success bool
    ID      string
    Message string
}

// DuplicateKeyError is returned when attempting to write a duplicate ID.
var DuplicateKeyError = errors.New("duplicate key")

// DBWriterService provides transactional write semantics.
type DBWriterService struct {
    mu   sync.Mutex
    data map[string]*ContentModel
}

// NewDBWriterService creates a new DBWriterService instance.
func NewDBWriterService() *DBWriterService {
    return &DBWriterService{data: make(map[string]*ContentModel)}
}

// Write writes the provided content into the in-memory store. It returns a WriteResult or an error.
func (s *DBWriterService) Write(ctx context.Context, content *ContentModel) (*WriteResult, error) {
    s.mu.Lock()
    defer s.mu.Unlock()

    // Context cancellation check.
    select {
    case <-ctx.Done():
        return nil, fmt.Errorf("write cancelled: %w", ctx.Err())
    default:
    }

    if _, exists := s.data[content.ID]; exists {
        return nil, fmt.Errorf("%w: %s", DuplicateKeyError, content.ID)
    }

    // Simulate transaction by writing after duplicate check.
    s.data[content.ID] = content
    return &WriteResult{Success: true, ID: content.ID, Message: "written"}, nil
}
