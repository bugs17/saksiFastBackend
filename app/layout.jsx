import "./globals.css";


export const metadata = {
  title: "Real-time saksi",
  description: "An app for collect real-time data saksi",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html data-theme='retro' className="bg-[#ece3ca]" lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
