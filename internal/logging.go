package internal

import (
    "context"
    "fmt"
    "time"
)

// PipelineEventLog represents a structured log entry.
type PipelineEventLog struct {
    Timestamp time.Time
    Level     string
    Source    string
    Event     string
}

// Logger defines the minimal logging interface used by the application.
type Logger interface {
    Info(ctx context.Context, msg string, fields map[string]string)
    Warn(ctx context.Context, msg string, fields map[string]string)
    Error(ctx context.Context, err error, msg string, fields map[string]string)
}

// logger is a simple console logger.
type logger struct{}

// NewLogger creates a new Logger instance.
func NewLogger() Logger {
    return &logger{}
}

func (l *logger) log(ctx context.Context, level string, msg string, fields map[string]string) {
    entry := PipelineEventLog{
        Timestamp: time.Now(),
        Level:     level,
        Source:    getCaller(),
        Event:     msg,
    }
    fmt.Printf("%s [%s] %s: %s", entry.Timestamp.Format(time.RFC3339), entry.Level, entry.Source, entry.Event)
    for k, v := range fields {
        fmt.Printf(" %s=%s", k, v)
    }
    fmt.Println()
}

func (l *logger) Info(ctx context.Context, msg string, fields map[string]string) {
    l.log(ctx, "INFO", msg, fields)
}

func (l *logger) Warn(ctx context.Context, msg string, fields map[string]string) {
    l.log(ctx, "WARN", msg, fields)
}

func (l *logger) Error(ctx context.Context, err error, msg string, fields map[string]string) {
    if err != nil {
        fields["error"] = err.Error()
    }
    l.log(ctx, "ERROR", msg, fields)
}

// getCaller returns a placeholder source identifier.
func getCaller() string {
    return "internal/logging.go"
}
