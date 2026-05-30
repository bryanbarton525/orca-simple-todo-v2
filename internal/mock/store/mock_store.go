package mock

import (
    "context"
    "errors"
    "fmt"
    "sync"
)

var (
    ErrTransactionInProgress = errors.New("transaction already in progress")
    ErrNoTransaction         = errors.New("no active transaction")
    ErrDuplicateKey          = errors.New("duplicate key")
)

type InMemoryStorageMap map[string]interface{}

type MockDBStore struct {
    mu       sync.RWMutex
    data     map[string]interface{}
    txMu     sync.Mutex
    txInProg bool
    txCtx    context.Context
    txCancel context.CancelFunc
    txData   map[string]interface{}
}

func NewMockDBStore(initial InMemoryStorageMap) *MockDBStore {
    m := &MockDBStore{data: make(map[string]interface{})}
    for k, v := range initial {
        m.data[k] = v
    }
    return m
}

func (s *MockDBStore) StartTransaction(ctx context.Context) error {
    s.txMu.Lock()
    defer s.txMu.Unlock()
    if s.txInProg {
        return ErrTransactionInProgress
    }
    s.txCtx, s.txCancel = context.WithCancel(ctx)
    s.txData = make(map[string]interface{}, len(s.data))
    for k, v := range s.data {
        s.txData[k] = v
    }
    s.txInProg = true
    return nil
}

func (s *MockDBStore) Commit() error {
    s.txMu.Lock()
    defer s.txMu.Unlock()
    if !s.txInProg {
        return ErrNoTransaction
    }
    s.mu.Lock()
    s.data = s.txData
    s.mu.Unlock()
    s.txCancel()
    s.txInProg = false
    s.txData = nil
    return nil
}

func (s *MockDBStore) Rollback() error {
    s.txMu.Lock()
    defer s.txMu.Unlock()
    if !s.txInProg {
        return ErrNoTransaction
    }
    s.txCancel()
    s.txInProg = false
    s.txData = nil
    return nil
}

func (s *MockDBStore) Get(ctx context.Context, key string) (interface{}, error) {
    if err := ctx.Err(); err != nil {
        return nil, err
    }
    if s.txInProg && s.txData != nil {
        val, ok := s.txData[key]
        if !ok {
            return nil, fmt.Errorf("key not found: %w", errors.New("not found"))
        }
        return val, nil
    }
    s.mu.RLock()
    defer s.mu.RUnlock()
    val, ok := s.data[key]
    if !ok {
        return nil, fmt.Errorf("key not found: %w", errors.New("not found"))
    }
    return val, nil
}

func (s *MockDBStore) Set(ctx context.Context, key string, value interface{}) error {
    if err := ctx.Err(); err != nil {
        return err
    }
    if s.txInProg && s.txData != nil {
        if _, exists := s.txData[key]; exists {
            return fmt.Errorf("%w: %s", ErrDuplicateKey, key)
        }
        s.txData[key] = value
        return nil
    }
    s.mu.Lock()
    defer s.mu.Unlock()
    if _, exists := s.data[key]; exists {
        return fmt.Errorf("%w: %s", ErrDuplicateKey, key)
    }
    s.data[key] = value
    return nil
}

func (s *MockDBStore) Delete(ctx context.Context, key string) error {
    if err := ctx.Err(); err != nil {
        return err
    }
    if s.txInProg && s.txData != nil {
        delete(s.txData, key)
        return nil
    }
    s.mu.Lock()
    defer s.mu.Unlock()
    delete(s.data, key)
    return nil
}
