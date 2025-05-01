"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, X, Maximize } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import MediaViewer from "./media-viewer"

export default function ProjectModal({ project, isOpen, onClose }) {
  const [isMobile, setIsMobile] = useState(false)
  const isSmallScreen = useMediaQuery("(max-width: 768px)")
  const [activeTab, setActiveTab] = useState("info")
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [mediaType, setMediaType] = useState("video")
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false)
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0)
  const [viewerMedia, setViewerMedia] = useState([])
  const [allMedia, setAllMedia] = useState([])

  useEffect(() => {
    setIsMobile(isSmallScreen)
  }, [isSmallScreen])

  // Reset state when project changes
  useEffect(() => {
    setCurrentMediaIndex(0)
    setMediaType("video")
  }, [project])

  // Update allMedia and viewerMedia when project changes
  useEffect(() => {
    if (!project || !project.media) {
      setAllMedia([])
      setViewerMedia([])
      return
    }

    const videos = project.media?.videos || []
    const images = project.media?.images || []
    const mediaArray = [...videos, ...images]

    setAllMedia(mediaArray)

    // Prepare media array for the MediaViewer component
    const mediaForViewer = mediaArray.map((media) => ({
      url: media.url || "",
      title: media.title || "",
      type: media.url?.endsWith(".mp4") || media.url?.endsWith(".webm") ? "video" : "image",
    }))

    setViewerMedia(mediaForViewer)
  }, [project])

  // Scroll to current thumbnail when currentMediaIndex changes
  useEffect(() => {
    // Encontre o elemento da miniatura atual
    const currentThumb = document.getElementById(`media-thumb-${currentMediaIndex}`)
    if (currentThumb) {
      // Role para a miniatura atual
      currentThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [currentMediaIndex])

  const goToNextMedia = () => {
    if (currentMediaIndex < allMedia.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1)
      const videos = project?.media?.videos || []
      setMediaType(currentMediaIndex + 1 < videos.length ? "video" : "image")
    }
  }

  const goToPrevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1)
      const videos = project?.media?.videos || []
      setMediaType(currentMediaIndex - 1 < videos.length ? "video" : "image")
    }
  }

  const openMediaViewer = (index) => {
    setMediaViewerIndex(index)
    setIsMediaViewerOpen(true)
  }

  const renderMediaGallery = () => {
    if (!project) return null

    const hasMultipleMedia =
      project.media &&
      ((project.media.videos && project.media.videos.length > 0) ||
        (project.media.images && project.media.images.length > 0))

    if (!hasMultipleMedia) {
      return (
        <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">No media available</p>
          </div>
        </div>
      )
    }

    const videos = project.media?.videos || []
    const currentMedia = allMedia[currentMediaIndex]

    if (!currentMedia) {
      return (
        <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Media not available</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="aspect-video relative bg-muted rounded-md overflow-hidden group">
          {currentMediaIndex < videos.length ? (
            // Video player
            <div className="absolute inset-0">
              <video
                src={currentMedia?.url}
                controls
                className="w-full h-full object-contain"
                poster="/placeholder.svg?height=300&width=500"
              >
                Seu navegador não suporta a tag de vídeo.
              </video>
              {currentMedia?.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                  <p className="text-sm font-medium">{currentMedia.title}</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/70"
                onClick={() => openMediaViewer(currentMediaIndex)}
              >
                <Maximize className="h-4 w-4" />
                <span className="sr-only">View fullscreen</span>
              </Button>
            </div>
          ) : (
            // Image display
            <div className="absolute inset-0">
              <div className="relative w-full h-full cursor-pointer" onClick={() => openMediaViewer(currentMediaIndex)}>
                <Image
                  src={currentMedia?.url || "/placeholder.svg?height=300&width=500"}
                  alt={currentMedia?.title || "Project image"}
                  fill
                  className="object-contain"
                />
              </div>
              {currentMedia?.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                  <p className="text-sm font-medium">{currentMedia.title}</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/70"
                onClick={() => openMediaViewer(currentMediaIndex)}
              >
                <Maximize className="h-4 w-4" />
                <span className="sr-only">View fullscreen</span>
              </Button>
            </div>
          )}
        </div>

        {/* Media navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" size="icon" onClick={goToPrevMedia} disabled={currentMediaIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-center">
            {currentMediaIndex + 1} of {allMedia.length}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMedia}
            disabled={currentMediaIndex === allMedia.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
          {allMedia.map((media, index) => (
            <div
              id={`media-thumb-${index}`}
              key={index}
              className={`flex-shrink-0 w-24 h-16 relative bg-muted rounded-md overflow-hidden cursor-pointer border-2 snap-center ${
                currentMediaIndex === index ? "border-primary" : "border-transparent"
              } hover:opacity-90 transition-opacity`}
              onClick={() => {
                setCurrentMediaIndex(index)
                setMediaType(index < videos.length ? "video" : "image")
              }}
            >
              {index < videos.length ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-6 w-6 text-muted-foreground" />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={media.url || "/placeholder.svg"}
                    alt={media.title || "Thumbnail"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderProjectInfo = () => {
    if (!project) return null

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          {project.projectType && (
            <div className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              {project.projectType}
            </div>
          )}
          {project.company && (
            <div className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              {project.company}
            </div>
          )}
          {project.date && (
            <div className="inline-block px-2 py-1 bg-secondary/30 text-secondary-foreground rounded-md text-sm">
              {project.date}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold">About the Project</h4>
          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{project.description}</p>
        </div>

        <div>
          <h4 className="font-semibold">My Contribution</h4>
          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{project.contribution}</p>
        </div>

        {project.title === "Skydome" && project.levelDesign && (
          <div>
            <h4 className="font-semibold">Level Design in Skydome</h4>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{project.levelDesign}</p>
          </div>
        )}

        {project.title !== "Skydome" && project.learnings && (
          <div>
            <h4 className="font-semibold">What I Learned</h4>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{project.learnings}</p>
          </div>
        )}

        {project.generalContribution && (
          <div>
            <h4 className="font-semibold">General Contribution</h4>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{project.generalContribution}</p>
          </div>
        )}

        <div>
          <h4 className="font-semibold">Technologies Used</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Mobile view
  if (isMobile) {
    return (
      <>
        <Drawer open={isOpen} onOpenChange={onClose} shouldScaleBackground={false}>
          <DrawerContent className="px-4 max-h-[85vh]">
            <DrawerHeader className="text-left">
              <DrawerTitle>{project?.title}</DrawerTitle>
              <DrawerDescription>{project?.role}</DrawerDescription>
              <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DrawerClose>
            </DrawerHeader>

            <div className="pb-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <Tabs defaultValue="media" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sticky top-0 z-10 bg-background">
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="info">Information</TabsTrigger>
                </TabsList>
                <TabsContent value="media" className="mt-4">
                  {renderMediaGallery()}
                </TabsContent>
                <TabsContent value="info" className="mt-4 overflow-y-auto max-h-[60vh]">
                  {renderProjectInfo()}
                </TabsContent>
              </Tabs>
            </div>
          </DrawerContent>
        </Drawer>

        {isMediaViewerOpen && (
          <MediaViewer
            isOpen={isMediaViewerOpen}
            onClose={() => setIsMediaViewerOpen(false)}
            media={viewerMedia}
            initialIndex={mediaViewerIndex}
          />
        )}
      </>
    )
  }

  // Desktop view
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{project?.title}</DialogTitle>
            <DialogDescription>{project?.role}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">{renderMediaGallery()}</div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">{renderProjectInfo()}</div>
          </div>
        </DialogContent>
      </Dialog>

      {isMediaViewerOpen && (
        <MediaViewer
          isOpen={isMediaViewerOpen}
          onClose={() => setIsMediaViewerOpen(false)}
          media={viewerMedia}
          initialIndex={mediaViewerIndex}
        />
      )}
    </>
  )
}
