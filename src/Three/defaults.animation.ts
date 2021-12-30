type AnimationTime = {
  fadeUpdateTime: number,
  scaleUpdateTime: number,
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
  },
  values: {
    opacityActive: 1,
    opacityInactive: 0.5,
    fadeStep: 0.04,
    scaleStep: 0.02,
    scaleReducer: 0.2,
    zoomOfAsset: 1.5,
  }

}

export default AnimationDefaults;