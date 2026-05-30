import { type Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple Todo application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-200 text-center py-4 text-sm">
          © {new Date().getFullYear()} Todo App
        </footer>
      </body>
    </html>
  );
}
