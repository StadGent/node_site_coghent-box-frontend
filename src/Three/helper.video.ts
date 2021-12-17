import { Mesh, Vector3 } from 'three';
import { Ref } from 'vue-demi';
import BaseChapes from './shapes.base';

const VideoHelper = (): {
  videoElementAsCube:(video: Ref< HTMLVideoElement>,src: string, dimensions: Vector3) => Mesh;
} => {
  const videoElementAsCube = (video: Ref< HTMLVideoElement>, src: string, dimensions: Vector3) => {
    if (video.value) {
      video.value.src = src;
      video.value.load();
      video.value.crossOrigin = 'anonymous';      
    }
    const videoCube = BaseChapes().DrawVideoCube(
      video.value,
      dimensions,
    );
    return videoCube;
  };

  return {
    videoElementAsCube,
  }
};

export default VideoHelper;