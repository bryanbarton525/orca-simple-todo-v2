package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Task represents a todo item.
type Task struct {
    ID        string
    Title     string
    Completed bool
    CreatedAt time.Time
}

// TaskRepository defines the interface for task persistence.
type TaskRepository interface {
    Create(ctx context.Context, task *Task) error
    Get(ctx context.Context, id string) (*Task, error)
    List(ctx context.Context) ([]Task, error)
    Delete(ctx context.Context, id string) error
}

// sqliteTaskRepo implements TaskRepository with SQLite.
type sqliteTaskRepo struct {
    db *sql.DB
}

// NewSQLiteTaskRepo returns a TaskRepository backed by the given sql.DB.
func NewSQLiteTaskRepo(db *sql.DB) TaskRepository {
    return &sqliteTaskRepo{db: db}
}

func (r *sqliteTaskRepo) Create(ctx context.Context, task *Task) error {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil {
        return fmt.Errorf("begin transaction: %w", err)
    }
    defer tx.Rollback()

    _, err = tx.ExecContext(ctx, `INSERT INTO tasks (id, title, completed, created_at) VALUES (?, ?, ?, ?)`,
        task.ID, task.Title, task.Completed, task.CreatedAt.Unix())
    if err != nil {
        return fmt.Errorf("insert task: %w", err)
    }
    return tx.Commit()
}

func (r *sqliteTaskRepo) Get(ctx context.Context, id string) (*Task, error) {
    row := r.db.QueryRowContext(ctx, `SELECT id, title, completed, created_at FROM tasks WHERE id = ?`, id)
    var t Task
    var created int64
    err := row.Scan(&t.ID, &t.Title, &t.Completed, &created)
    if err != nil {
        if err == sql.ErrNoRows {
            return nil, fmt.Errorf("task %s not found: %w", id, err)
        }
        return nil, fmt.Errorf("query task: %w", err)
    }
    t.CreatedAt = time.Unix(created, 0)
    return &t, nil
}

func (r *sqliteTaskRepo) List(ctx context.Context) ([]Task, error) {
    rows, err := r.db.QueryContext(ctx, `SELECT id, title, completed, created_at FROM tasks`)
    if err != nil {
        return nil, fmt.Errorf("query tasks: %w", err)
    }
    defer rows.Close()

    var tasks []Task
    for rows.Next() {
        var t Task
        var created int64
        if err := rows.Scan(&t.ID, &t.Title, &t.Completed, &created); err != nil {
            return nil, fmt.Errorf("scan row: %w", err)
        }
        t.CreatedAt = time.Unix(created, 0)
        tasks = append(tasks, t)
    }
    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("rows error: %w", err)
    }
    return tasks, nil
}

func (r *sqliteTaskRepo) Delete(ctx context.Context, id string) error {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil {
        return fmt.Errorf("begin transaction: %w", err)
    }
    defer tx.Rollback()

    res, err := tx.ExecContext(ctx, `DELETE FROM tasks WHERE id = ?`, id)
    if err != nil {
        return fmt.Errorf("delete task: %w", err)
    }
    rows, err := res.RowsAffected()
    if err != nil {
        return fmt.Errorf("rows affected: %w", err)
    }
    if rows == 0 {
        return fmt.Errorf("task %s not found", id)
    }
    return tx.Commit()
}