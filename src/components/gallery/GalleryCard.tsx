import { GalleryItems } from '@/services/gallery';
import { Camera } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const GalleryCard = ({ item, onClick }: { item: GalleryItems; onClick: () => void }) => {
  return (
    <button
          onClick={onClick}
          className="group relative overflow-hidden rounded-2xl text-left shadow-(--shadow-soft) transition-transform hover:-translate-y-1"
        >
          <div className="relative flex aspect-4/3 items-end overflow-hidden bg-secondary">
            {item.image ? (
              <Image
                fill
                src={item.image}
                alt={item.caption || "Gallery Image"}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <Camera className="h-8 w-8 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <Camera className="absolute right-4 top-4 h-5 w-5 text-white/70 drop-shadow" />
            <span className="relative z-10 p-5 text-sm font-semibold text-white drop-shadow">
              {item.caption}
            </span>
          </div>
          <div className="flex items-center justify-between bg-card px-5 py-3 text-xs text-muted-foreground border-t border-border">
            <span className="font-semibold text-primary">{item.category}</span>
            <span>{item.year}</span>
          </div>
        </button>
  )
}

export default GalleryCard