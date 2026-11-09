import { z } from 'zod';

export const VideoPlayerSchema = z.object({
  title: z.string().optional().default('داستان آفرینش زیلاو'),
  videoUrl: z.string().default('/assets/videos/brand-story.mp4'),
  posterUrl: z.string().default('/assets/videos/brand-poster.jpg'),
  aspectRatio: z.enum(['16:9', '4:3', '21:9']).default('16:9'),
  autoPlay: z.boolean().default(false),
  loop: z.boolean().default(false),
  controls: z.boolean().default(true),
});

export type VideoPlayerProps = z.infer<typeof VideoPlayerSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: VideoPlayerProps = VideoPlayerSchema.parse({});
