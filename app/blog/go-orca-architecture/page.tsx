import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go Orca Architecture",
  description: "An overview of Go Orca architecture.",
};

export default function Page() {
  const markdown = `
# Go Orca Architecture

Go Orca is a workflow orchestration system that ...
`;

  const renderMarkdown = (md: string) => {
    const html = md
      .replace(/^# (.*)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/\n/g, "<br/>" );
    return { __html: html };
  };

  return (
    <main>
      <article dangerouslySetInnerHTML={renderMarkdown(markdown)} />
    </main>
  );
}
