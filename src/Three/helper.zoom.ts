import * as d3 from 'd3';
import { ThreeDefaults, threeDefaultsTouchTable } from '@/Three/defaults.three';
import { MathUtils } from 'three';
import { ZoomBehavior } from 'd3';
import ThreeService from '@/services/ThreeService';

const ZoomHelper = (): {
  getScaleFromZ: (camera_z_position: number, threeSvc: ThreeService) => number;
  getZFromScale: (scale: number, threeSvc: ThreeService) => number;
  zoomHandler: (threeSvc: ThreeService) => void;
  zoom: (threeSvc: ThreeService) => ZoomBehavior<Element, unknown>;
} => {
  const defaultvalues = threeDefaultsTouchTable;

  const getScaleFromZ = (camera_z_position: number, threeSvc: ThreeService) => {
    const half_fov = defaultvalues.camera.fov / 2;
    const half_fov_radians = MathUtils.degToRad(half_fov);
    const half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
    const fov_height = half_fov_height * 2;
    const scale = threeSvc.state.height / fov_height;
    return scale;
  };

  const getZFromScale = (scale: number, threeSvc: ThreeService) => {
    const half_fov = defaultvalues.camera.fov / 2;
    const half_fov_radians = MathUtils.degToRad(half_fov);
    const scale_height = threeSvc.state.height / scale;
    const camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
    return camera_z_position;
  };

  const zoomHandler = (threeSvc: ThreeService) => {
    const scale = d3.zoomTransform(threeSvc.element.value).k;
    const x =
      -(d3.zoomTransform(threeSvc.element.value).x - threeSvc.state.width / 2) / scale;
    const y =
      (d3.zoomTransform(threeSvc.element.value).y - threeSvc.state.height / 2) / scale;
    const z = getZFromScale(scale, threeSvc);
    threeSvc.state.camera.position.set(x, y, z);
  };

  const zoom = (threeSvc: ThreeService) => {
    const d3_zoom = d3
      .zoom()
      .scaleExtent([
        getScaleFromZ(defaultvalues.camera.far, threeSvc),
        getScaleFromZ(defaultvalues.camera.near, threeSvc),
      ])
      .on('zoom', () => {
        zoomHandler(threeSvc);
      });
    return d3_zoom;
  };

  return {
    getScaleFromZ,
    getZFromScale,
    zoomHandler,
    zoom,
  };
};

export default ZoomHelper;
