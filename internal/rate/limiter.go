package rate

import (
    "context"
    "sync"
    "time"
)

// Bucket holds the state of the token bucket.
type Bucket struct {
    Tokens     int64
    LastRefill int64
    mutex      sync.Mutex
}

// RateLimiter implements a token bucket rate limiter.
// rate specifies tokens per millisecond, burst specifies the maximum bucket size.
type RateLimiter struct {
    rate  int64
    burst int64
}

// NewRateLimiter creates a new RateLimiter. ratePerSecond is the tokens added per second.
func NewRateLimiter(ratePerSecond int64, burst int64) *RateLimiter {
    return &RateLimiter{
        rate:  ratePerSecond / 1000,
        burst: burst,
    }
}

// RateLimitError is a sentinel error that can be returned to callers.
// It carries a message, the bucket state, and a recommended retry-after duration.
type RateLimitError struct {
    Message    string
    Bucket     *Bucket
    RetryAfter time.Duration
}

func (e *RateLimitError) Error() string {
    return e.Message
}

// Allow attempts to consume a token from the bucket. It returns true if a token was
// successfully consumed, or false if the context was cancelled before a token could be
// obtained. The method guarantees safe concurrent access via a mutex and does not
// mix atomic operations with mutexes.
func (rl *RateLimiter) Allow(ctx context.Context, b *Bucket) bool {
    for {
        now := time.Now().UnixMilli()
        b.mutex.Lock()
        elapsed := now - b.LastRefill
        if elapsed > 0 {
            tokensToAdd := elapsed * rl.rate
            if tokensToAdd > 0 {
                b.Tokens += tokensToAdd
                if b.Tokens > rl.burst {
                    b.Tokens = rl.burst
                }
                b.LastRefill = now
            }
        }
        if b.Tokens > 0 {
            b.Tokens--
            b.mutex.Unlock()
            return true
        }
        b.mutex.Unlock()

        select {
        case <-ctx.Done():
            return false
        default:
        }
        time.Sleep(time.Millisecond)
    }
}
