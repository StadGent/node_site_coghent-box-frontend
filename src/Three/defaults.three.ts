type ThreeDefaults = {
  camera: {
    fov: number;
    near: number;
    far: number;
    distance: number;
  };
  scene: {
    ratioX: number;
    ratioY: number;
  };
  renderer: {
    gammaFactor: number;
    antialias: true | false;
  };
  viewport: {
    height: number;
    width: number;
  };
};

const threeDefaultsWall: ThreeDefaults = {
  camera: {
    fov: 60,
    near: 1,
    far: 100,
    distance: 15,
  },
  scene: {
    ratioX: 48,
    ratioY: 9,
  },
  renderer: {
    gammaFactor: 1,
    antialias: true,
  },
  viewport: {
    height: 1080,
    width: 5760,
  },
};

export {
  threeDefaultsWall,
  ThreeDefaults,
};
