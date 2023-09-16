import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"

import '../globals.css'

export const metadata = {
    title: 'Trends',
    description: 'Find what is trending on the internet and social medias, including, tiktok, youtube, facebook, twitter, google, Trends and more, condensed using AI.'
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}