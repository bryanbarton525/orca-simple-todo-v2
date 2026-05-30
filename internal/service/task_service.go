package service

import (
    "context"
    "errors"
    "fmt"
    "sync"
    "time"

    "github.com/example/todo/internal/domain"
)

var (
    ErrTaskNotFound = errors.New("task not found")
    ErrInvalidTitle = errors.New("title cannot be empty")
)

// TaskService manages task storage and lifecycle.
type TaskService struct {
    mu     sync.Mutex
    tasks  map[string]domain.Task
    nextID int
}

// NewTaskService creates an empty service.
func NewTaskService() *TaskService {
    return &TaskService{tasks: make(map[string]domain.Task), nextID: 1}
}

// Create adds a new task after validating the title.
func (s *TaskService) Create(ctx context.Context, title string) (domain.Task, error) {
    if title == "" {
        return domain.Task{}, fmt.Errorf("%w: %s", ErrInvalidTitle, title)
    }
    s.mu.Lock()
    defer s.mu.Unlock()
    id := fmt.Sprintf("%d", s.nextID)
    s.nextID++
    task := domain.Task{ID: id, Title: title, Status: domain.StatusPending, CreatedAt: time.Now()}
    s.tasks[id] = task
    return task, nil
}

// Get retrieves a task by its ID.
func (s *TaskService) Get(ctx context.Context, id string) (domain.Task, error) {
    s.mu.Lock()
    defer s.mu.Unlock()
    t, ok := s.tasks[id]
    if !ok {
        return domain.Task{}, fmt.Errorf("%w: %s", ErrTaskNotFound, id)
    }
    return t, nil
}

// List returns all stored tasks.
func (s *TaskService) List(ctx context.Context) ([]domain.Task, error) {
    s.mu.Lock()
    defer s.mu.Unlock()
    list := make([]domain.Task, 0, len(s.tasks))
    for _, t := range s.tasks {
        list = append(list, t)
    }
    return list, nil
}

// Delete removes a task by ID.
func (s *TaskService) Delete(ctx context.Context, id string) error {
    s.mu.Lock()
    defer s.mu.Unlock()
    if _, ok := s.tasks[id]; !ok {
        return fmt.Errorf("%w: %s", ErrTaskNotFound, id)
    }
    delete(s.tasks, id)
    return nil
}
