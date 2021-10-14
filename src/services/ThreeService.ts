import useThreeChapes from '@/composables/Chapes';
import * as Three from 'three';
import { Scene } from 'three';

type State = {
  width: number;
  height: number;
  camera: any;
  controls: null;
  scene: Scene;
  renderer: any;
  axisLines: [];
  pyramids: [];
};

export const initState: State = {
  width: 0,
  height: 0,
  camera: undefined,
  controls: null,
  scene: new Scene(),
  renderer: null,
  axisLines: [],
  pyramids: [],
};

export default class ThreeService {
  state: State;
  _element: HTMLElement;
  chapeHelper = useThreeChapes();

  constructor(element: HTMLElement) {
    this.state = initState;
    this._element = element;
    this.SetViewPort(window.innerWidth, 600);
    this.InitializeRenderer();
    this.InitializeCamera();
    this.AddToScene();
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
    this._element.appendChild(this.state.renderer.domElement);
  }

  InitializeCamera() {
    console.log('Init Camera');
    this.state.camera = new Three.PerspectiveCamera(
      60,
      this.state.width / this.state.height,
      1,
      1000,
    );
    this.state.camera.position.z = 10;
  }

  AddToScene() {
    console.log('Add circle scene');
    const circle = this.chapeHelper.Circle(2, 0x02a77f);
    this.state.scene.add(circle);
  }

  Animate() {
    requestAnimationFrame(() => {
      this.Animate();
    });
    this.state.renderer.render(this.state.scene, this.state.camera);
  }
}
