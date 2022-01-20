import { MeshBasicMaterial, Mesh, RingGeometry, Vector3, Group } from 'three';
import ChapeHelper from './helper.chape';
import CircleHelper from './helper.circle';
import SchemaCircle, { CircleSchema } from './schema.circle';
import Correction from './helper.correction';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import GroupHelper from './helper.group';
import Measurements from './defaults.measurements';

const CircularProgressBar = (): {
  create: (
    position: Vector3,
    radius: number,
    segments: number,
    progress: number,
    color?: number,
  ) => Mesh;
  createActiveSegment: (
    position: Vector3,
    radius: number,
    segments: number,
    progress: number,
    color?: number,
  ) => {object: Array<Group>, dotSchemas: Array<CircleSchema>};
} => {
  const create = (
    position: Vector3,
    radius: number,
    segments: number,
    progress: number,
    color?: number,
  ) => {
    const geometry = new RingGeometry(
      radius,
      radius + Measurements().progressBar.thickness,
      360 / segments,
      45,
      6.3 / 360 - (6.3 / 360 / segments) * progress,
      (6.3 / 360 / segments) * progress * 360,
    );
    const material = new MeshBasicMaterial({
      color: color || Colors().white,
      opacity: 0.4,
      transparent: true,
    });
    material.color.convertSRGBToLinear();
    const mesh = new Mesh(geometry, material);
    ChapeHelper().SetPosition(position, mesh);
    mesh.position.z = Layers.scene - Layers.fraction;
    return mesh;
  };

  const innerDotSchema = (schema: CircleSchema, storyColor: number, progress: number, currentProgress: number) => {
    let innerSchema: CircleSchema = {} as CircleSchema;
    if(progress > currentProgress){
      innerSchema = CircleHelper().CreateSchema(schema.position, 0.2, storyColor || Colors().white);
    }else{
      innerSchema = CircleHelper().CreateSchema(schema.position, 0.2, Colors().white);
    }
    return innerSchema
  }

  const createActiveSegment = (
    position: Vector3,
    radius: number,
    segments: number,
    progress: number,
    color?: number,
  ) => {
    const mesh = create(position, radius, segments, progress,  Colors().white);
    const points = CircleHelper().SplitCircleInSegments(new Vector3(position.x,position.y,position.z + Layers.fraction - 0.05), radius, segments);
    const schemas = CircleHelper().CreateSchemas(points, 0.4, color || Colors().white);
    const progressDots: Array<Group> = [];
    for (let i = 0; i < schemas.length; i++) {
      const innerSchema = innerDotSchema(schemas[i],color|| Colors().white,progress,i);
      schemas[i].position = Correction().CorrectionForDotOnProgressBar(schemas[i].position, 0.1);
      innerSchema.position = Correction().CorrectionForDotOnProgressBar(
        schemas[i].position,
        0.1,
      );
      const circle = SchemaCircle().CreateCircle(schemas[i]);
      const innerCircle = SchemaCircle().CreateCircle(innerSchema);
      progressDots.push(GroupHelper().CreateGroup([circle, innerCircle]))
    }
    GroupHelper().AddObjectsTogroups([mesh], progressDots)
    return {object: progressDots, dotSchemas: schemas};
  };

  return { create, createActiveSegment };
};

export default CircularProgressBar;
