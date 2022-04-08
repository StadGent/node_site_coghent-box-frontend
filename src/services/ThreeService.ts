import { ThreeDefaults } from '@/Three/defaults.three';
import {
  Camera,
  Scene,
  WebGLRenderer,
  Group,
  sRGBEncoding,
  Vector3,
  MathUtils,
  Color,
  Texture,
  OrthographicCamera,
} from 'three';
import { Ref } from 'vue';
import TaggingService, { Tags } from './TaggingService';
import Development from '@/Three/defaults.development';
import TWEEN from '@tweenjs/tween.js';

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
  cachedTextures: Array<Texture>;

  constructor(
    _element: Ref,
    _defaultvalues: ThreeDefaults,
    _taggingService: TaggingService,
  ) {
    this.state = initState;
    this.element = _element;
    this.defaultvalues = _defaultvalues;
    this.taggingService = _taggingService;
    this.SetViewPort(this.defaultvalues.viewport.width, this.defaultvalues.viewport.height);
    this.InitializeRenderer();
    this.InitializeCamera();
    this.cachedTextures = [];
  }

  private calculateDimensionsOfScene() {
    const vFOV = MathUtils.degToRad(0);
    this.state.sceneDimensions = new Vector3(this.state.width, this.state.height, 6);
  }

  SetViewPort(width: number, height: number) {
    this.state.width = width;
    this.state.height = height;
    document.querySelectorAll<HTMLElement>(
      '.viewport',
    )[0].style.width = `${width.toString()}px`;
    this.calculateDimensionsOfScene();
  }

  InitializeRenderer() {
    this.state.renderer = new WebGLRenderer({
      alpha: true,
      antialias: this.defaultvalues.renderer.antialias,
    });
    this.state.renderer.gammaFactor = this.defaultvalues.renderer.gammaFactor;
    this.state.renderer.outputEncoding = sRGBEncoding;
    this.state.renderer.setPixelRatio(window.devicePixelRatio);
    this.state.renderer.setSize(this.state.width, this.state.height);
    this.state.renderer.setClearColor(0xffffff, 0);
    this.element.value.appendChild(this.state.renderer.domElement);
  }

  InitializeCamera() {
    const aspect = this.state.width / this.state.height;
    this.state.camera = new OrthographicCamera(
      (-aspect * this.state.height) / 2,
      (aspect * this.state.height) / 2,
      this.state.height / 2,
      -this.state.height / 2,
      -0.5,
      3,
    );
  }

  AddToScene(item: any, tag: Tags, context?: string, id?: string) {
    if (Development().sceneLogs() && context) {
      console.log('Add to scene |', context);
    }
    this.taggingService.tag(tag, item, context, id);
    this.state.scene.add(item);
  }

  AddGroupsToScene(groups: Array<Group>, tag: Tags, context?: string, id?: string) {
    if (Development().sceneLogs() && context) {
      console.log('Add group to scene |', context);
    }
    this.taggingService.tag(tag, groups, context, id);
    groups.map((group) => {
      this.state.scene.add(group);
      this.state.scene.updateMatrixWorld(true);
    });
  }

  RemoveFromScene(item: any) {
    if (this.state.scene.remove(item)) this.taggingService.removeTaggedObject(item);
  }

  RemoveGroupsFromScene(groups: Array<Group>) {
    if (groups && groups.length > 0) {
      groups.forEach((group) => this.RemoveFromScene(group));
    }
  }

  ChangeSceneBackgroundColor(color: number) {
    this.state.scene.background = new Color(color);
  }

  ClearScene() {
    this.taggingService.clearTaggedObjects();
    while (this.state.scene.children.length > 0) {
      this.state.scene.remove(this.state.scene.children[0]);
    }
  }

  Animate() {
    requestAnimationFrame(() => {
      this.Animate();
    });
    TWEEN.update();

    this.state.renderer.render(this.state.scene, this.state.camera);
  }
}
