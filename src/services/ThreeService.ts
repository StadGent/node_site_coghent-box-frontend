import usePredefined from '@/composables/usePredefined';
import * as Three from 'three';

type State = {
  width: number;
  height: number;
  camera: Three.Camera;
  controls: null;
  scene: Three.Scene;
  renderer: any;
  axisLines: [];
  pyramids: [];
};

export const initState: State = {
  width: 0,
  height: 0,
  camera: new Three.Camera(),
  controls: null,
  scene: new Three.Scene(),
  renderer: null,
  axisLines: [],
  pyramids: [],
};

export default class ThreeService {
  state: State;
  element: any;
  predefinedHelper = usePredefined();

  constructor(_element: any) {
    this.state = initState;
    this.element = _element;
    this.SetViewPort(window.innerHeight * (48 / 9), window.innerHeight);
    this.InitializeRenderer();
    this.InitializeCamera();
  }

  SetViewPort(width: number, height: number) {
    console.log(`Viewport set to w: ${width} h: ${height}`);
    this.state.width = width;
    this.state.height = height;
  }
  InitializeRenderer() {
    console.log('Init Renderer');
    this.state.renderer = new Three.WebGLRenderer({ antialias: true });
    this.state.renderer.setPixelRatio(window.devicePixelRatio);
    this.state.renderer.setSize(this.state.width, this.state.height);
    this.element.appendChild(this.state.renderer.domElement);
  }

  InitializeCamera() {
    console.log('Init Camera');
    this.state.camera = new Three.PerspectiveCamera(
      60,
      this.state.width / this.state.height,
      1,
      1000,
    );
    // this.state.camera = new Three.OrthographicCamera(10, 10, 10, 10, 1, 1000);
    this.state.camera.position.z = 1;
  }

  AddToScene(item: any) {
    console.log('Add to scene');
    this.state.scene.add(item);
  }

  Animate() {
    requestAnimationFrame(() => {
      this.Animate();
    });
    this.state.renderer.render(this.state.scene, this.state.camera);
  }
}
