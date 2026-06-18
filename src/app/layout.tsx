export const metadata = {
  title: "Swedish CSOP Tax Calculator",
  description: "Estimate Swedish tax on UK CSOP options priced in USD"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
