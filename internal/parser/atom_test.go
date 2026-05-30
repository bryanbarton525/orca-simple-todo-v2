package parser

import (
    "bytes"
    "context"
    "testing"
)

func TestParseAtom(t *testing.T) {
    ctx := context.Background()
    xml := `
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Example Atom</title>
  <link href="http://example.com"/>
  <subtitle>Example feed</subtitle>
  <entry>
    <title>First Entry</title>
    <link href="http://example.com/1"/>
    <updated>2006-01-02T15:04:05Z</updated>
    <summary>Entry 1 summary</summary>
  </entry>
</feed>`
    feed, err := ParseAtom(ctx, bytes.NewBufferString(xml))
    if err != nil {
        t.Fatalf("ParseAtom error: %v", err)
    }
    if feed.Title != "Example Atom" {
        t.Errorf("expected title, got %s", feed.Title)
    }
    if len(feed.Items) != 1 {
        t.Fatalf("expected 1 item, got %d", len(feed.Items))
    }
    item := feed.Items[0]
    if item.Title != "First Entry" {
        t.Errorf("item title mismatch")
    }
}
