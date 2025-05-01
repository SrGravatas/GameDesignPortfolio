"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover">
          <source src="/videos/background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 p-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">Andre Vargas</h1>
        <p className="mt-6 text-xl text-white/90 max-w-2xl">
          I craft interactive experiences with purpose and passion — discover my work.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button asChild size="lg" className="bg-primary/90 hover:bg-primary">
            <Link href="/professional-projects">Professional Projects</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-background/20 backdrop-blur-sm hover:bg-background/30 border-white/20 text-white"
          >
            <Link href="/personal-projects">Personal Projects</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="bg-secondary/90 hover:bg-secondary">
            <Link href="/resume">Resume</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
