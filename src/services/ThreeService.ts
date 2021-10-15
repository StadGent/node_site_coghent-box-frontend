import usePredefined from '@/Three/usePredefined';
import { Camera, Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { Ref } from 'vue';

type State = {
  width: number;
  height: number;
  camera: Camera;
  scene: Scene;
  renderer: any;
};

export const initState: State = {
  width: 0,
  height: 0,
  camera: new Camera(),
  scene: new Scene(),
  renderer: null,
};

export default class ThreeService {
  state: State;
  element: Ref;
  predefinedHelper = usePredefined();

  constructor(_element: Ref) {
    this.state = initState;
    this.element = _element;
    this.SetViewPort(window.innerHeight * (48 / 9), window.innerHeight);
    this.InitializeRenderer();
    this.InitializeCamera();
  }

  SetViewPort(width: number, height: number) {
    this.state.width = width;
    this.state.height = height;
  }
  InitializeRenderer() {
    this.state.renderer = new WebGLRenderer({ antialias: true });
    this.state.renderer.setPixelRatio(window.devicePixelRatio);
    this.state.renderer.setSize(this.state.width, this.state.height);
    this.element.value.appendChild(this.state.renderer.domElement);
  }

  InitializeCamera() {
    this.state.camera = new PerspectiveCamera(
      60,
      this.state.width / this.state.height,
      1,
      1000,
    );
    this.state.camera.position.z = 10;
  }

  AddToScene(item: any) {
    this.state.scene.add(item);
  }

  Animate() {
    requestAnimationFrame(() => {
      this.Animate();
    });
    this.state.renderer.render(this.state.scene, this.state.camera);
  }
}
