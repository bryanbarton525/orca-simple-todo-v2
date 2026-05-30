package parser

import (
    "context"
    "encoding/xml"
    "fmt"
    "io"
    "net/http"
    "time"
)

type rss struct {
    XMLName xml.Name `xml:"rss"`
    Channel struct {
        Title       string `xml:"title"`
        Link        string `xml:"link"`
        Description string `xml:"description"`
        Items []struct {
            Title       string `xml:"title"`
            Link        string `xml:"link"`
            PubDate     string `xml:"pubDate"`
            Description string `xml:"description"`
        } `xml:"item"`
    } `xml:"channel"`
}

func ParseRSS(ctx context.Context, r io.Reader) (*Feed, error) {
    var rssFeed rss
    dec := xml.NewDecoder(r)
    if err := dec.Decode(&rssFeed); err != nil {
        return nil, fmt.Errorf("decode rss: %w", err)
    }
    feed := &Feed{
        Title:       rssFeed.Channel.Title,
        Description: rssFeed.Channel.Description,
        Link:        rssFeed.Channel.Link,
    }
    for _, it := range rssFeed.Channel.Items {
        pubDate, err := time.Parse(time.RFC1123Z, it.PubDate)
        if err != nil {
            pubDate = time.Time{}
        }
        feed.Items = append(feed.Items, Item{
            Title:       it.Title,
            Link:        it.Link,
            PubDate:     pubDate.Format(time.RFC3339),
            Description: it.Description,
        })
    }
    return feed, nil
}

func FetchRSS(ctx context.Context, url string) (*Feed, error) {
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    if err != nil {
        return nil, fmt.Errorf("new request: %w", err)
    }
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("http get: %w", err)
    }
    defer resp.Body.Close()
    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("bad status: %s", resp.Status)
    }
    return ParseRSS(ctx, resp.Body)
}