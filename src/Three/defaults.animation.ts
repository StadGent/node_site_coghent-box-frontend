type AnimationTime = {
  fadeUpdateTime: number,
  scaleUpdateTime: number,
  fadeIn: number,
}
type AnimationValues = {
  opacityInactive: number,
  opacityActive: number,
  fadeStep: number,
  scaleStep: number,
  scaleReducer: number,
  zoomOfAsset: number,
}

type AnimationDefault = {
  timing: AnimationTime,
  values: AnimationValues,
}


const AnimationDefaults: AnimationDefault = {
  timing: {
    fadeUpdateTime: 50,
    scaleUpdateTime: 15,
    fadeIn: 200,
  },
  values: {
    opacityActive: 0.9,
    opacityInactive: 0.7,
    fadeStep: 0.04,
    scaleStep: 10,
    scaleReducer: 20,
    zoomOfAsset: 1.5,
  }

}

export default AnimationDefaults;