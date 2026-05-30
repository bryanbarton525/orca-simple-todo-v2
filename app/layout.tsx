import './globals.css';

export const metadata = {
  title: 'Todo App',
  description: 'A minimal todo app',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}