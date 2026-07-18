export function toEmbedUrl(url: string): string {
  if (!url) return url;

  const trimmed = url.trim();

  const youtubeWatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
  );
  if (youtubeWatch) {
    return `https://www.youtube.com/embed/${youtubeWatch[1]}`;
  }

  const youtuBe = trimmed.match(
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/
  );
  if (youtuBe) {
    return `https://www.youtube.com/embed/${youtuBe[1]}`;
  }

  const vimeo = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/
  );
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }

  const youtubeEmbed = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
  );
  if (youtubeEmbed) {
    return `https://www.youtube.com/embed/${youtubeEmbed[1]}`;
  }

  const vimeoEmbed = trimmed.match(
    /(?:https?:\/\/)?player\.vimeo\.com\/video\/(\d+)/
  );
  if (vimeoEmbed) {
    return `https://player.vimeo.com/video/${vimeoEmbed[1]}`;
  }

  return trimmed;
}
