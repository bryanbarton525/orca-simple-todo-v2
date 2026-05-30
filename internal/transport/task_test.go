package transport

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/go-chi/chi/v5"
)

func TestHandlers(t *testing.T) {
    // Reset in‑memory store
    tasksMu.Lock()
    tasks = map[string]Task{}
    tasksMu.Unlock()

    // Set up chi router
    r := chi.NewRouter()
    r.Post("/tasks", CreateTaskHandler)
    r.Get("/tasks/{id}", GetTaskHandler)
    r.Get("/tasks", ListTasksHandler)
    r.Delete("/tasks/{id}", DeleteTaskHandler)

    // Helper to record a request
    record := func(method, path string, body *bytes.Buffer) *httptest.ResponseRecorder {
        req := httptest.NewRequest(method, path, body)
        rec := httptest.NewRecorder()
        r.ServeHTTP(rec, req)
        return rec
    }

    t.Run("CreateTask success", func(t *testing.T) {
        body := `{"name":"test task"}`
        rec := record(http.MethodPost, "/tasks", bytes.NewBufferString(body))
        if rec.Code != http.StatusCreated {
            t.Fatalf("expected 201 got %d", rec.Code)
        }
        var resp Task
        if err := json.NewDecoder(rec.Body).Decode(&resp); err != nil {
            t.Fatalf("decode error: %v", err)
        }
        if resp.Name != "test task" || resp.ID == "" || resp.Done {
            t.Fatalf("unexpected task: %+v", resp)
        }
    })

    t.Run("GetTask success", func(t *testing.T) {
        // create a task to retrieve
        createBody := `{"name":"foo"}`
        rec := record(http.MethodPost, "/tasks", bytes.NewBufferString(createBody))
        var created Task
        json.NewDecoder(rec.Body).Decode(&created)
        getRec := record(http.MethodGet, "/tasks/"+created.ID, nil)
        if getRec.Code != http.StatusOK {
            t.Fatalf("expected 200 got %d", getRec.Code)
        }
        var got Task
        json.NewDecoder(getRec.Body).Decode(&got)
        if got.ID != created.ID || got.Name != created.Name || got.Done != created.Done {
            t.Fatalf("mismatch: %+v vs %+v", got, created)
        }
    })

    t.Run("ListTasks success", func(t *testing.T) {
        listRec := record(http.MethodGet, "/tasks", nil)
        if listRec.Code != http.StatusOK {
            t.Fatalf("expected 200 got %d", listRec.Code)
        }
        var list []Task
        json.NewDecoder(listRec.Body).Decode(&list)
        if len(list) == 0 {
            t.Fatalf("expected non-empty list")
        }
    })

    t.Run("DeleteTask success", func(t *testing.T) {
        // create a task to delete
        createBody := `{"name":"to delete"}`
        rec := record(http.MethodPost, "/tasks", bytes.NewBufferString(createBody))
        var created Task
        json.NewDecoder(rec.Body).Decode(&created)

        delRec := record(http.MethodDelete, "/tasks/"+created.ID, nil)
        if delRec.Code != http.StatusNoContent {
            t.Fatalf("expected 204 got %d", delRec.Code)
        }
        // confirm deletion
        getRec := record(http.MethodGet, "/tasks/"+created.ID, nil)
        if getRec.Code != http.StatusNotFound {
            t.Fatalf("expected 404 after delete got %d", getRec.Code)
        }
    })
}
