package parser

import (
    "bytes"
    "context"
    "testing"
)

func TestParseRSS(t *testing.T) {
    ctx := context.Background()
    xml := `
<rss version="2.0">
  <channel>
    <title>Example RSS</title>
    <link>http://example.com</link>
    <description>Example feed</description>
    <item>
      <title>First Item</title>
      <link>http://example.com/1</link>
      <pubDate>Mon, 02 Jan 2006 15:04:05 GMT</pubDate>
      <description>Item 1 description</description>
    </item>
  </channel>
</rss>`
    feed, err := ParseRSS(ctx, bytes.NewBufferString(xml))
    if err != nil {
        t.Fatalf("ParseRSS error: %v", err)
    }
    if feed.Title != "Example RSS" {
        t.Errorf("expected title, got %s", feed.Title)
    }
    if len(feed.Items) != 1 {
        t.Fatalf("expected 1 item, got %d", len(feed.Items))
    }
    item := feed.Items[0]
    if item.Title != "First Item" {
        t.Errorf("item title mismatch")
    }
}
