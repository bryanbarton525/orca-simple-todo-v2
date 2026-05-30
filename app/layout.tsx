import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Todo App',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}