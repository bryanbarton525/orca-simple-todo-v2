package transport

import (
    "encoding/json"
    "net/http"
    "sync"

    "github.com/go-chi/chi/v5"
    "github.com/google/uuid"
)

// Task represents a simple todo item.
type Task struct {
    ID   string `json:"id"`
    Name string `json:"name"`
    Done bool   `json:"done"`
}

var (
    tasks   = map[string]Task{}
    tasksMu sync.Mutex
)

// CreateTaskHandler handles POST /tasks. It expects a JSON body with a "name" field.
func CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
    var payload struct{ Name string `json:"name"` }
    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    if payload.Name == "" {
        http.Error(w, "name required", http.StatusBadRequest)
        return
    }
    id := uuid.New().String()
    task := Task{ID: id, Name: payload.Name, Done: false}
    tasksMu.Lock()
    tasks[id] = task
    tasksMu.Unlock()

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(task)
}

// GetTaskHandler handles GET /tasks/{id}. It returns the task as JSON or 404.
func GetTaskHandler(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    tasksMu.Lock()
    task, ok := tasks[id]
    tasksMu.Unlock()
    if !ok {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(task)
}

// ListTasksHandler handles GET /tasks. It returns an array of all tasks.
func ListTasksHandler(w http.ResponseWriter, r *http.Request) {
    tasksMu.Lock()
    list := make([]Task, 0, len(tasks))
    for _, t := range tasks {
        list = append(list, t)
    }
    tasksMu.Unlock()
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(list)
}

// DeleteTaskHandler handles DELETE /tasks/{id}. It returns 204 on success or 404 if the task does not exist.
func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    tasksMu.Lock()
    _, ok := tasks[id]
    if ok {
        delete(tasks, id)
    }
    tasksMu.Unlock()
    if !ok {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }
    w.WriteHeader(http.StatusNoContent)
}

// GetTaskHandler handles GET /tasks/{id}.
func GetTaskHandler(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    tasksMu.Lock()
    task, ok := tasks[id]
    tasksMu.Unlock()
    if !ok {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(task)
}

// ListTasksHandler handles GET /tasks.
func ListTasksHandler(w http.ResponseWriter, r *http.Request) {
    tasksMu.Lock()
    list := make([]Task, 0, len(tasks))
    for _, t := range tasks {
        list = append(list, t)
    }
    tasksMu.Unlock()
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(list)
}

// DeleteTaskHandler handles DELETE /tasks/{id}.
func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    tasksMu.Lock()
    _, ok := tasks[id]
    if ok {
        delete(tasks, id)
    }
    tasksMu.Unlock()
    if !ok {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }
    w.WriteHeader(http.StatusNoContent)
}
