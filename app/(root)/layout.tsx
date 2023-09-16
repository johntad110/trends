import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"

import '../globals.css'
import TopBar from "@/components/shared/TopBar"
import LeftSideBar from "@/components/shared/LeftSideBar"
import RightSideBar from "@/components/shared/RightSideBar"
import BottomBar from "@/components/shared/BottomBar"

export const metadata = {
    title: 'Trends',
    description: 'Find what is trending on the internet and social medias, including, tiktok, youtube, facebook, twitter, google, Trends and more, condensed using AI.'
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <TopBar />
                    <main className="flex flex-row">
                        <LeftSideBar />
                        
                        <section className="main-container">
                            <div className="w-full max-w-4xl">
                                {children}
                            </div>
                        </section>

                        <RightSideBar />
                    </main>
                    <BottomBar  />
                </body>
            </html>
        </ClerkProvider>
    )
}