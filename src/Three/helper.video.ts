import {
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
  VideoTexture,
} from 'three';
import Development from './defaults.development';
import ChapeHelper from './helper.chape';

export const savedVideoTextures: Array<VideoTexture> = []

const VideoHelper = (): {
  videoElementAsCube: (_id: string, src: string, dimensions: Vector3, position: Vector3) => Mesh;
} => {
  const videoElementAsCube = (_id: string, src: string, dimensions: Vector3, position: Vector3) => {
    const video = createVideoHTMLElement(_id, src)
    const videoTexture = createVideoTexture(video)

    const videoCube = new Mesh(
      new PlaneGeometry(dimensions.x, dimensions.y),
      new MeshBasicMaterial({ map: videoTexture, side: DoubleSide }),
    );

    ChapeHelper().SetPosition(position, videoCube);
    videoCube.scale.set(1, 1, 0);
    videoCube.name = _id
    return videoCube;
  };

  const createVideoHTMLElement = (_id: string, _src: string) => {
    if (!_src.includes('https')) {
      _src = _src.replace('http', 'https');
    }

    let video = document.getElementById(_id) as HTMLVideoElement
    if (!video) {
      video = document.createElement('video');
      document.body.appendChild(video);
      video.id = _id;
      video.src = _src
      video.crossOrigin = 'anonymous';
      video.style.visibility='hidden'
      if (Development().showVideoLogs()) {
        console.log('| Creating new videoElement')
        console.log('| Load video')
      }
      video.load();
    }


    return video as HTMLVideoElement
  }

  const createVideoTexture = (_video: HTMLVideoElement) => {
    let videoTexture: VideoTexture | null = null
    if (savedVideoTextures.length > 0) {
      for (const texture of savedVideoTextures) {
        if (texture.name === _video.id) {
          videoTexture = texture
          if (Development().showVideoLogs()) console.log('| VideoTexture from saved')
        }
      }
    }
    if (videoTexture === null && _video) {
      videoTexture = new VideoTexture(_video);
      videoTexture.minFilter = LinearFilter;
      videoTexture.magFilter = LinearFilter;
      videoTexture.needsUpdate = true;
      videoTexture.name = _video.id
      savedVideoTextures.push(videoTexture)
    }
    return videoTexture
  }


  return {
    videoElementAsCube,
  };
};

export default VideoHelper
