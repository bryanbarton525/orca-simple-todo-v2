package parser

import (
    "context"
    "encoding/xml"
    "fmt"
    "io"
    "net/http"
    "time"
)

type atom struct {
    XMLName xml.Name `xml:"feed"`
    Title   string   `xml:"title"`
    Link    struct {
        Href string `xml:"href,attr"`
    } `xml:"link"`
    Subtitle string   `xml:"subtitle"`
    Entries []struct {
        Title   string `xml:"title"`
        Link    struct {
            Href string `xml:"href,attr"`
        } `xml:"link"`
        Updated string `xml:"updated"`
        Summary string `xml:"summary"`
    } `xml:"entry"`
}

func ParseAtom(ctx context.Context, r io.Reader) (*Feed, error) {
    var atomFeed atom
    dec := xml.NewDecoder(r)
    if err := dec.Decode(&atomFeed); err != nil {
        return nil, fmt.Errorf("decode atom: %w", err)
    }
    feed := &Feed{
        Title:       atomFeed.Title,
        Description: atomFeed.Subtitle,
        Link:        atomFeed.Link.Href,
    }
    for _, ent := range atomFeed.Entries {
        upd, err := time.Parse(time.RFC3339, ent.Updated)
        if err != nil {
            upd = time.Time{}
        }
        feed.Items = append(feed.Items, Item{
            Title:       ent.Title,
            Link:        ent.Link.Href,
            PubDate:     upd.Format(time.RFC3339),
            Description: ent.Summary,
        })
    }
    return feed, nil
}

func FetchAtom(ctx context.Context, url string) (*Feed, error) {
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
    return ParseAtom(ctx, resp.Body)
}