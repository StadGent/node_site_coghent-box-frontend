type AnimationTime = {
  fadeUpdateTime: number,
}
type AnimationValues = {
  opacityInactive: number,
  opacityActive: number,
  fadeStep: number,
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
  },
  values: {
    opacityActive: 1,
    opacityInactive: 0.5,
    fadeStep: 0.04,
    scaleReducer: 0.2,
    zoomOfAsset: 1.5,
  }

}

export default AnimationDefaults;