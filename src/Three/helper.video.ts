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
  videoElementAsCube: (src: string, dimensions: Vector3, position: Vector3) => Mesh;
} => {
  const videoElementAsCube = (src: string, dimensions: Vector3, position: Vector3) => {
    const video = document.createElement('video');
    document.body.appendChild(video);
    video.src = src;
    video.id = src;
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
    videoCube.scale.set(0, 0, 0);
    return videoCube;
  };

  return {
    videoElementAsCube,
  };
};

export default VideoHelper;
