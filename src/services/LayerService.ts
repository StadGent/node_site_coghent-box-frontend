import Colors from '@/Three/defaults.color';
import Layers from '@/Three/defaults.layers'
import { threeDefaultsWall } from '@/Three/defaults.three';
import schemaCube, { CubeSchema } from '@/Three/schema.cube';
import { Group } from '@tweenjs/tween.js';
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { Tags } from './TaggingService';
import ThreeService from './ThreeService';

class LayerService {
  public layers = {
    assets: 0,
    assetShade: 0.1,
    assetDisplay: 0.2,
    spotlight: 0.3,
    spotlightBackground: 0.4,
    front: 0.5,
  }

  private layerCube: null | Mesh<BoxGeometry, MeshBasicMaterial> = null
  private layerCubes: Array<Mesh<BoxGeometry, MeshBasicMaterial>> = []
  constructor() {
    console.log('layers', Layers)
    console.log('layers of service', this.layers)
    this.createDefaultLayers()
  }

  private createDefaultLayers() {
    const assetShade = this.createLayer('assetShade', this.layers.assetShade, 0xABBABD)
    assetShade.material.opacity = 0.01
    this.layerCubes.push(assetShade)
    console.log(`Created default layers`, this.layerCubes)
  }

  addLayersToscene(_threeService: ThreeService) {
    if (this.layerCubes.length >= 0) {
      for (const layer of this.layerCubes) {
        // _threeService.AddToScene(layer, Tags.Layer, `Layer cube: ${layer.name}`)
      }
    }
  }

  createLayer(_name: string, _order: number, _color: number) {
    let cube: null | Mesh<BoxGeometry, MeshBasicMaterial> = null
    if (this.layerCube != null) {
      cube = this.layerCube.clone()
      cube.name = _name
      cube.material.color.set(_color)
      // cube.renderOrder = _order
    } else {
      cube = schemaCube().CreateCube({
        position: new Vector3(0, 0, 0),
        params: {
          width: threeDefaultsWall.viewport.width,
          height: threeDefaultsWall.viewport.height,
        },
      } as CubeSchema);
      cube.position.setZ(_order)
      cube.material.color = new Color(_color);
      cube.material.color.convertSRGBToLinear();
      cube.material.opacity = 0.01
      // cube.renderOrder = 1
    }
    return cube
  }

  setLayer(_object: Mesh<BoxGeometry, MeshBasicMaterial> | Group, _layer: number) {
    if ("position" in _object) {
      _object.position.setZ(_layer)
      console.log(`Moved object to layer: ${_layer}:${_object.position.z}`)
    }
  }

  setObjectRenderOrder(_object: any, _order: number) {
    if ("renderOrder" in _object) {
      _object.renderOrder = _order
      console.log(`Set render order for object ${_object} to ${_order}:${_object.renderOrder}`)
    }
  }


}

const layerService = new LayerService()
export default layerService