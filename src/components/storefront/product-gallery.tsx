'use client';

import React, { useState } from 'react';

interface ProductGalleryProps {
  images: Array<{
    url: string;
    altText?: string;
    isMain?: boolean;
  }>;
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const allImages = images.length > 0
    ? images
    : [{ url: '/assets/placeholder-product.svg', altText: title, isMain: true }];

  const initialMain = allImages.find((img) => img.isMain) || allImages[0]!;
  const [selectedImage, setSelectedImage] = useState(initialMain.url);

  return (
    <div className="space-y-4">
      {/* Main Image View */}
      <div className="relative aspect-square w-full rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center p-4">
        <img
          src={selectedImage}
          alt={title}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(img.url)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border transition-all ${
                selectedImage === img.url
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-neutral-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.altText || title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
