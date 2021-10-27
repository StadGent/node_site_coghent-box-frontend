import usePredefined from '@/Three/usePredefined';
import {
  Camera,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  sRGBEncoding,
} from 'three';
import { Ref } from 'vue';

type State = {
  width: number;
  height: number;
  camera: Camera;
  scene: Scene;
  renderer: any;
  groups: Array<Group>;
};

export const initState: State = {
  width: 0,
  height: 0,
  camera: new Camera(),
  scene: new Scene(),
  renderer: null,
  groups: [],
};

export default class ThreeService {
  state: State;
  element: Ref;
  predefinedHelper = usePredefined();

  constructor(_element: Ref) {
    this.state = initState;
    this.element = _element;
    // this.SetViewPort(window.innerHeight * (48 / 9), window.innerHeight);
    this.SetViewPort(window.innerWidth, 600);
    this.InitializeRenderer();
    this.InitializeCamera();
  }

  SetViewPort(width: number, height: number) {
    this.state.width = width;
    this.state.height = height;
  }
  InitializeRenderer() {
    this.state.renderer = new WebGLRenderer({ antialias: true });
    this.state.renderer.gammaFactor = 2;
    this.state.renderer.outputEncoding = sRGBEncoding;
    this.state.renderer.setPixelRatio(window.devicePixelRatio);
    this.state.renderer.setSize(this.state.width, this.state.height);
    this.element.value.appendChild(this.state.renderer.domElement);
  }

  InitializeCamera() {
    this.state.camera = new PerspectiveCamera(
      60,
      this.state.width / this.state.height,
      1,
      100,
    );
    this.state.camera.position.z = 15;
  }

  AddToScene(item: any) {
    this.state.scene.add(item);
  }

  AddGroupsToScene(groups: Array<Group>) {
    groups.map((group) => {
      this.state.scene.add(group);
      this.state.scene.updateMatrixWorld(true);
    });
  }

  Animate() {
    requestAnimationFrame(() => {
      this.Animate();
    });
    this.state.renderer.render(this.state.scene, this.state.camera);
  }
}
