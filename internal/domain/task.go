package domain

import "time"

// TaskStatus represents the lifecycle state of a task.
type TaskStatus string

const (
    StatusPending  TaskStatus = "pending"
    StatusComplete TaskStatus = "complete"
)

// Task holds minimal data for a todo item.
type Task struct {
    ID        string
    Title     string
    Status    TaskStatus
    CreatedAt time.Time
}
