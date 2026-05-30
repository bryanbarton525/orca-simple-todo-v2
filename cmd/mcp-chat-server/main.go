package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "math"
    "net/http"
    "sort"
    "strings"
    "sync"
    "time"

    "github.com/gorilla/mux"
)

type Item struct {
    ID    string `json:"id"`
    Title string `json:"title"`
    Body  string `json:"body"`
}

type Server struct {
    mu      sync.RWMutex
    items   []Item
    vectors []vector
    ctx     context.Context
    cancel  context.CancelFunc
}

type vector []float64

func NewServer() *Server {
    ctx, cancel := context.WithCancel(context.Background())
    return &Server{
        items:   []Item{},
        vectors: []vector{},
        ctx:     ctx,
        cancel:  cancel,
    }
}

func (s *Server) AddItem(it Item) {
    s.mu.Lock()
    defer s.mu.Unlock()
    s.items = append(s.items, it)
    s.vectors = append(s.vectors, embed(it))
}

func embed(it Item) vector {
    words := strings.Fields(it.Title + " " + it.Body)
    v := make(vector, 10)
    for i, w := range words {
        if i >= len(v) {
            break
        }
        v[i] = float64(len(w))
    }
    return v
}

func (s *Server) Search(query string) []Item {
    s.mu.RLock()
    defer s.mu.RUnlock()
    if query == "" {
        return nil
    }
    qVec := embed(Item{Title: query})
    type scored struct{ item Item; score float64 }
    var scores []scored
    for i, v := range s.vectors {
        score := cosine(qVec, v)
        scores = append(scores, scored{item: s.items[i], score: score})
    }
    sort.Slice(scores, func(i, j int) bool { return scores[i].score > scores[j].score })
    var result []Item
    for _, sc := range scores[:min(5, len(scores))] {
        result = append(result, sc.item)
    }
    return result
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}

func cosine(a, b vector) float64 {
    var dot, la, lb float64
    for i := 0; i < len(a) && i < len(b); i++ {
        dot += a[i] * b[i]
        la += a[i] * a[i]
        lb += b[i] * b[i]
    }
    if la == 0 || lb == 0 {
        return 0
    }
    return dot / (math.Sqrt(la) * math.Sqrt(lb))
}

func (s *Server) Stream(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")
    flusher, ok := w.(http.Flusher)
    if !ok {
        http.Error(w, "streaming unsupported", http.StatusInternalServerError)
        return
    }
    ticker := time.NewTicker(1 * time.Second)
    defer ticker.Stop()
    for {
        select {
        case <-s.ctx.Done():
            return
        case <-ticker.C:
            msg := fmt.Sprintf("data: %s\n\n", time.Now().Format(time.RFC3339))
            _, _ = w.Write([]byte(msg))
            flusher.Flush()
        }
    }
}

func main() {
    srv := NewServer()
    srv.AddItem(Item{ID: "1", Title: "Hello World", Body: "This is a test item."})
    srv.AddItem(Item{ID: "2", Title: "Go RAG", Body: "Implement retrieval augmented generation."})
    r := mux.NewRouter()
    r.HandleFunc("/search", func(w http.ResponseWriter, r *http.Request) {
        q := r.URL.Query().Get("q")
        results := srv.Search(q)
        w.Header().Set("Content-Type", "application/json")
        _ = json.NewEncoder(w).Encode(results)
    }).Methods(http.MethodGet)
    r.HandleFunc("/stream", srv.Stream).Methods(http.MethodGet)
    addr := ":8080"
    log.Printf("Starting server on %s", addr)
    if err := http.ListenAndServe(addr, r); err != nil {
        log.Fatal(err)
    }
}