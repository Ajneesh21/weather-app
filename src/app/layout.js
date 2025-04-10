export const metadata = {
    title: 'Weather App',
    description: 'Weather application built with Next.js App Router',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    );
}