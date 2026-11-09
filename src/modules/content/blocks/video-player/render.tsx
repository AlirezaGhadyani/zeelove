import type { VideoPlayerProps } from './schema';

const RATIO_CLASSES: Record<string, string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '21:9': 'aspect-[21/9]',
};

export function VideoPlayerRender({ props }: { props: VideoPlayerProps }) {
  const ratioClass = RATIO_CLASSES[props.aspectRatio] || RATIO_CLASSES['16:9'];

  return (
    <div className="w-full">
      {props.title && (
        <h3 className="mb-4 text-lg md:text-xl font-bold text-slate-900">
          {props.title}
        </h3>
      )}

      <div
        className={`relative w-full ${ratioClass} overflow-hidden rounded-2xl bg-slate-950 shadow-md`}
      >
        <video
          src={props.videoUrl}
          poster={props.posterUrl}
          controls={props.controls}
          autoPlay={props.autoPlay}
          loop={props.loop}
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
