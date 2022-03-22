import {
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
  VideoTexture,
} from 'three';
import { Ref } from 'vue-demi';
import ChapeHelper from './helper.chape';
import BaseChapes from './shapes.base';

const VideoHelper = (): {
  videoElementAsCube: (_id:string, src: string, dimensions: Vector3, position: Vector3) => Mesh;
  playVideo: (_videoId: string) => void
} => {
  const videoElementAsCube = (_id: string, src: string, dimensions: Vector3, position: Vector3) => {
    const video = document.createElement('video');
    document.body.appendChild(video);
    video.id = _id;
    video.src = src.replace('http', 'https');    
    video.crossOrigin = 'anonymous';
    video.load();

    const videoTexture = new VideoTexture(video);
    videoTexture.minFilter = LinearFilter;
    videoTexture.magFilter = LinearFilter;
    videoTexture.needsUpdate = true;
    console.log(videoTexture);
    //@ts-ignore
    const videoCube = new Mesh(
      new PlaneGeometry(dimensions.x, dimensions.y),
      new MeshBasicMaterial({ map: videoTexture, side: DoubleSide }),
    );
    
    ChapeHelper().SetPosition(position, videoCube);
    videoCube.scale.set(1, 1, 0);
    videoCube.name = _id
    return videoCube;
  };

  const playVideo = (_videoId: string) => {
    const videoElement = document.getElementById(_videoId);
    if (videoElement) {
      console.log('found videoElement', videoElement)
      const video = videoElement as HTMLVideoElement

      video.onloadedmetadata = () => {
        video.play();
        console.log('vid range', video.played);
        console.log('vid duration', video.duration);
        //  if(!isNaN(vid.duration) &&  < vid.duration)
      };
      video.ontimeupdate = ((value) => {
        console.log('Video currenttime', video.currentTime)
        if (video.currentTime === video.duration) {
          console.log('video ended')
          video.pause()
        }
      })
    } else {
      console.log('videoElement not found', videoElement)
    }
  }

  return {
    videoElementAsCube,
    playVideo
  };
};

export default VideoHelper;
