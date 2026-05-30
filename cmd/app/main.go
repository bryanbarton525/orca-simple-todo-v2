package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"
)

func main() {
    port := getPort()
    srv := &http.Server{
        Addr:    fmt.Sprintf(":%s", port),
        Handler: http.FileServer(http.Dir("./static")),
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s", err)
        }
    }()
    log.Printf("Server started on port %s", port)

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("Shutting down server...")

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatalf("server forced to shutdown: %v", err)
    }
    log.Println("Server exiting")
}

func getPort() string {
    p := os.Getenv("PORT")
    if p == "" {
        p = "8080"
    }
    return p
}
