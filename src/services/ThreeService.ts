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
  Color,
} from 'three';
import * as d3 from 'd3';
import { Ref } from 'vue';
import TaggingService, { Tags } from './TaggingService';
import ZoomHelper from '@/Three/helper.zoom';

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

  constructor(
    _element: Ref,
    _defaultvalues: ThreeDefaults,
    _taggingService: TaggingService,
  ) {
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
    this.state.camera = new PerspectiveCamera(
      this.defaultvalues.camera.fov,
      this.state.width / this.state.height,
      this.defaultvalues.camera.near,
      this.defaultvalues.camera.far,
    );
    this.state.camera.position.z = this.defaultvalues.camera.distance;
  }

  AddToScene(item: any, tag: Tags, context?: string, name?: string) {
    this.taggingService.tag(tag, item, context, name);
    this.state.scene.add(item);
  }

  AddGroupsToScene(groups: Array<Group>, tag: Tags, context?: string, name?: string) {
    this.taggingService.tag(tag, groups, context, name);
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

  setupZoom() {
    const view = d3.select(this.element.value);
    view.call(ZoomHelper().zoom(this));
    const initial_scale = ZoomHelper().getScaleFromZ(this.defaultvalues.camera.far, this);
    const initial_transform = d3.zoomIdentity
      .translate(this.state.width / 2, this.state.height / 2)
      .scale(initial_scale);
    view.attr('transform', initial_transform.toString);
    this.state.camera.position.set(0, 0, this.defaultvalues.camera.far);
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
    this.state.renderer.render(this.state.scene, this.state.camera);
  }
}
