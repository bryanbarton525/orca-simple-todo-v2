package store

import (
	"context"
	"database/sql"
	"testing"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

func TestSQLiteTaskRepo(t *testing.T) {
    db, err := sql.Open("sqlite3", ":memory:")
    if err != nil {
        t.Fatalf("open db: %v", err)
    }
    defer db.Close()

    _, err = db.Exec(`CREATE TABLE tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL,
        created_at INTEGER NOT NULL
    )`)
    if err != nil {
        t.Fatalf("create table: %v", err)
    }

    repo := NewSQLiteTaskRepo(db)
    ctx := context.Background()

    t.Run("Create and Get", func(t *testing.T) {
        t.Helper()
        task := &Task{
            ID:        "1",
            Title:     "Test task",
            Completed: false,
            CreatedAt: time.Now().UTC(),
        }
        if err := repo.Create(ctx, task); err != nil {
            t.Fatalf("create: %v", err)
        }
        got, err := repo.Get(ctx, "1")
        if err != nil {
            t.Fatalf("get: %v", err)
        }
        if got.ID != task.ID || got.Title != task.Title || got.Completed != task.Completed {
            t.Fatalf("got %+v, want %+v", got, task)
        }
    })

    t.Run("List", func(t *testing.T) {
        t.Helper()
        tasks, err := repo.List(ctx)
        if err != nil {
            t.Fatalf("list: %v", err)
        }
        if len(tasks) != 1 {
            t.Fatalf("expected 1 task, got %d", len(tasks))
        }
    })

    t.Run("Delete", func(t *testing.T) {
        t.Helper()
        if err := repo.Delete(ctx, "1"); err != nil {
            t.Fatalf("delete: %v", err)
        }
        if _, err := repo.Get(ctx, "1"); err == nil {
            t.Fatalf("expected error for missing task")
        }
    })

    t.Run("GetNonExistent", func(t *testing.T) {
        t.Helper()
        if _, err := repo.Get(ctx, "nonexistent"); err == nil {
            t.Fatalf("expected error for nonexistent id")
        }
    })
}