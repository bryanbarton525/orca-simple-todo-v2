package service

import (
    "context"
    "testing"

    "github.com/example/todo/internal/domain"
)

func TestTaskService(t *testing.T) {
    ctx := context.Background()
    svc := NewTaskService()

    t.Run("Create", func(t *testing.T) {
        task, err := svc.Create(ctx, "Test task")
        if err != nil {
            t.Fatalf("unexpected error: %v", err)
        }
        if task.Title != "Test task" {
            t.Errorf("expected title %q, got %q", "Test task", task.Title)
        }
        if task.Status != domain.StatusPending {
            t.Errorf("expected status pending, got %q", task.Status)
        }
    })

    t.Run("Create empty title", func(t *testing.T) {
        _, err := svc.Create(ctx, "")
        if err == nil {
            t.Fatalf("expected error for empty title")
        }
    })

    t.Run("Get", func(t *testing.T) {
        task, _ := svc.Create(ctx, "Get task")
        got, err := svc.Get(ctx, task.ID)
        if err != nil {
            t.Fatalf("unexpected error: %v", err)
        }
        if got.ID != task.ID {
            t.Errorf("expected ID %q, got %q", task.ID, got.ID)
        }
    })

    t.Run("Get not found", func(t *testing.T) {
        _, err := svc.Get(ctx, "999")
        if err == nil {
            t.Fatalf("expected error for missing task")
        }
    })

    t.Run("List", func(t *testing.T) {
        svc.Create(ctx, "List task 1")
        svc.Create(ctx, "List task 2")
        list, err := svc.List(ctx)
        if err != nil {
            t.Fatalf("unexpected error: %v", err)
        }
        if len(list) < 2 {
            t.Errorf("expected at least 2 tasks, got %d", len(list))
        }
    })

    t.Run("Delete", func(t *testing.T) {
        task, _ := svc.Create(ctx, "Delete task")
        if err := svc.Delete(ctx, task.ID); err != nil {
            t.Fatalf("unexpected error deleting: %v", err)
        }
        if _, err := svc.Get(ctx, task.ID); err == nil {
            t.Fatalf("expected error after delete")
        }
    })
}
