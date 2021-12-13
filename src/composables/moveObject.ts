import Defaults from '@/Three/defaults.config';
import { Mesh, Vector3 } from 'three';

const MoveObject = (): {
  move:(object: Mesh, toPosition: Vector3) => void
} => {
  const setXPosition =(object: Mesh, toPosition: Vector3, stepX: number) => {
    if(object.position.x <= toPosition.x && object.position.x+stepX <= toPosition.x){
      object.position.set(object.position.x + stepX, object.position.y, object.position.z)
    }else if (object.position.x >= toPosition.x && object.position.x - stepX >= toPosition.x){
     object.position.set(object.position.x - stepX, object.position.y, object.position.z)
    }
  }
  const setYPosition =(object: Mesh, toPosition: Vector3, stepY: number) => {
    if(object.position.y <= toPosition.y && object.position.y + stepY <= toPosition.y){
      object.position.set(object.position.x, object.position.y + stepY, object.position.z)
    }else if (object.position.y >= toPosition.y && object.position.y -stepY >= toPosition.y){
      object.position.set(object.position.x, object.position.y - stepY, object.position.z)
    }
  }
  const move = (object: Mesh, toPosition: Vector3) => {
  const stepY = Math.abs(object.position.y - toPosition.y) / Defaults().steps();
  const stepX = Math.abs(object.position.x - toPosition.x) / Defaults().steps();
  setXPosition(object, toPosition, stepX);
  setYPosition(object, toPosition, stepY);

  setTimeout(() => move(object, toPosition), Defaults().refreshStep());
  
  };
  return { move }
};

export default MoveObject;