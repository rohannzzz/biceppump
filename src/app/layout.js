import "./globals.css";

export const metadata = {
  title: "BicepPump",
  description: "Fitness & Muscle Building Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
