import type { BlockDefinition } from '../common/product-block-props';
import { VideoPlayerSchema, DEFAULT_PROPS, SCHEMA_VERSION, type VideoPlayerProps } from './schema';
import { VIDEO_PLAYER_FIELDS } from './editor';
import { VideoPlayerRender } from './render';

export const VideoPlayerBlock: BlockDefinition<VideoPlayerProps> = {
  type: 'video-player',
  name: 'پلیر ویدیو',
  description: 'پخش‌کننده ویدیو میزبانی‌شده با پوستر، نسبت‌های متنوع تصویر و کنترل کامل',
  schemaVersion: SCHEMA_VERSION,
  schema: VideoPlayerSchema,
  defaults: DEFAULT_PROPS,
  editorFields: VIDEO_PLAYER_FIELDS,
  Render: VideoPlayerRender,
};
