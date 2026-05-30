package service

import (
    "context"
    "encoding/xml"
    "fmt"
    "net/http"
    "time"
)

// FeedResponse represents a parsed RSS feed.
// Items contains the individual feed items.
// LastBuildDate is the timestamp of the feed's last build date.
// Status holds the HTTP status code returned by the feed URL.
// The struct is deliberately minimal for the service's needs.
// All time values are represented as time.Time for consistency.
// Example usage: after calling Fetch, inspect Items, LastBuildDate, Status.
// Note: The service does not store the feed; it simply returns the parsed result.

type FeedResponse struct {
    Items        []FeedItem
    LastBuildDate time.Time
    Status       string
}

// FeedItem represents an individual item in an RSS feed.
// Only a subset of the RSS spec is included to keep the example lightweight.
// Title is the headline of the item.
// Link is the URL to the full article.
// PubDate is the publication date.

type FeedItem struct {
    Title   string
    Link    string
    PubDate time.Time
}

// ContentFollowerService provides methods to fetch and parse RSS feeds.
// The service has no state, so it can be reused across requests.
// The Fetch method performs an HTTP GET with context cancellation support,
// validates the response status, parses the RSS XML, and returns the
// structured FeedResponse.
// Errors are wrapped with context information for easier debugging.

type ContentFollowerService struct{}

// Fetch retrieves and parses the RSS feed at the specified URL.
// It accepts a context for cancellation or timeout.
// The method returns a FeedResponse or an error if the request fails
// or the feed is malformed.
func (s *ContentFollowerService) Fetch(ctx context.Context, url string) (*FeedResponse, error) {
    // Create HTTP request with context
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    if err != nil {
        return nil, fmt.Errorf("creating request for %s: %w", url, err)
    }

    // Perform the request
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("fetching %s: %w", url, err)
    }
    defer resp.Body.Close()

    // Check HTTP status
    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("unexpected status %d for %s", resp.StatusCode, url)
    }

    // Define RSS structures for decoding
    type RSS struct {
        XMLName xml.Name `xml:"rss"`
        Channel struct {
            Title         string `xml:"title"`
            Link          string `xml:"link"`
            PubDate       string `xml:"pubDate"`
            LastBuildDate string `xml:"lastBuildDate"`
            Items         []struct {
                Title   string `xml:"title"`
                Link    string `xml:"link"`
                PubDate string `xml:"pubDate"`
            } `xml:"item"`
        } `xml:"channel"`
    }

    var rss RSS
    if err := xml.NewDecoder(resp.Body).Decode(&rss); err != nil {
        return nil, fmt.Errorf("parsing RSS from %s: %w", url, err)
    }

    // Validate essential fields
    if rss.Channel.Title == "" {
        return nil, fmt.Errorf("missing channel title in RSS from %s", url)
    }

    // Parse dates
    lastBuild, err := parseTime(rss.Channel.LastBuildDate)
    if err != nil {
        // Use current time if parsing fails; it's non‑critical
        lastBuild = time.Now()
    }

    feedItems := make([]FeedItem, 0, len(rss.Channel.Items))
    for _, it := range rss.Channel.Items {
        pub, err := parseTime(it.PubDate)
        if err != nil {
            // Skip items with unparsable dates but continue parsing others
            pub = time.Time{}
        }
        feedItems = append(feedItems, FeedItem{Title: it.Title, Link: it.Link, PubDate: pub})
    }

    response := &FeedResponse{
        Items:        feedItems,
        LastBuildDate: lastBuild,
        Status:       resp.Status,
    }

    return response, nil
}

// parseTime attempts to parse common RFC1123 and RFC3339 date strings.
// It falls back to time.Time{} on failure.
func parseTime(value string) (time.Time, error) {
    if value == "" {
        return time.Time{}, nil
    }
    // RFC1123 format
    if t, err := time.Parse(time.RFC1123Z, value); err == nil {
        return t, nil
    }
    if t, err := time.Parse(time.RFC1123, value); err == nil {
        return t, nil
    }
    // RFC3339
    if t, err := time.Parse(time.RFC3339, value); err == nil {
        return t, nil
    }
    return time.Time{}, fmt.Errorf("unparseable time %q", value)
}
