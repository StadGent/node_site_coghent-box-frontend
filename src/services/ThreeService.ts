import { ThreeDefaults } from '@/Three/defaults.three';
import {
  Camera,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  sRGBEncoding,
  Vector3,
  MathUtils,
} from 'three';
import { Ref } from 'vue';
import TaggingService from './TaggingService';

type State = {
  width: number;
  height: number;
  camera: Camera;
  scene: Scene;
  renderer: any;
  groups: Array<Group>;
  sceneDimensions: Vector3;
};

export const initState: State = {
  width: 0,
  height: 0,
  camera: new Camera(),
  scene: new Scene(),
  renderer: null,
  groups: [],
  sceneDimensions: new Vector3(0, 0, 0),
};

export default class ThreeService {
  state: State;
  element: Ref;
  defaultvalues: ThreeDefaults;
  taggingService: TaggingService;

  constructor(_element: Ref, _defaultvalues: ThreeDefaults, _taggingService: TaggingService) {
    this.state = initState;
    this.element = _element;
    this.defaultvalues = _defaultvalues;
    this.taggingService = _taggingService;
    this.SetViewPort(_defaultvalues.viewport, window.innerHeight);
    this.InitializeRenderer();
    this.InitializeCamera();
  }

  private calculateDimensionsOfScene() {
    const vFOV = MathUtils.degToRad(this.defaultvalues.camera.fov);
    const height = 2 * Math.tan(vFOV / 2) * this.defaultvalues.camera.distance; //
    const width = height * (this.state.width / this.state.height);
    this.state.sceneDimensions = new Vector3(width, height, 0);
  }

  SetViewPort(width: number, height: number) {
    this.state.width = width;
    this.state.height = height;
    this.calculateDimensionsOfScene();
  }
  InitializeRenderer() {
    this.state.renderer = new WebGLRenderer({
      antialias: this.defaultvalues.renderer.antialias,
    });
    this.state.renderer.gammaFactor = this.defaultvalues.renderer.gammaFactor;
    this.state.renderer.outputEncoding = sRGBEncoding;
    this.state.renderer.setPixelRatio(window.devicePixelRatio);
    this.state.renderer.setSize(this.state.width, this.state.height);
    this.element.value.appendChild(this.state.renderer.domElement);
  }

  InitializeCamera() {
    this.state.camera = new PerspectiveCamera(
      this.defaultvalues.camera.fov,
      this.state.width / this.state.height,
      this.defaultvalues.camera.near,
      this.defaultvalues.camera.far,
    );
    this.state.camera.position.z = this.defaultvalues.camera.distance;
  }

  AddToScene(item: any, name: string, context?: string) {
    this.taggingService.tag(name, item, context);
    this.state.scene.add(item);
  }

  AddGroupsToScene(groups: Array<Group>) {
    groups.map((group) => {
      this.state.scene.add(group);
      this.state.scene.updateMatrixWorld(true);
    });
  }

  RemoveGroupsFromScene(groups: Array<Group>) {
    if (groups) {
      groups.forEach((group) => this.state.scene.remove(group));
    }
  }

  ClearScene() {
    while (this.state.scene.children.length > 0) {
      this.state.scene.remove(this.state.scene.children[0]);
    }
  }

  Animate() {
    requestAnimationFrame(() => {
      this.Animate();
    });
    this.state.renderer.render(this.state.scene, this.state.camera);
  }
}
