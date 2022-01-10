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
  viewport: number;
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
  viewport: window.innerHeight * (48 / 9),
};

const threeDefaultsTouchTable: ThreeDefaults = {
  camera: {
    fov: 40,
    near: 10,
    far: 100,
    distance: 101,
  },
  scene: {
    ratioX: 48,
    ratioY: 9,
  },
  renderer: {
    gammaFactor: 2,
    antialias: true,
  },
  viewport: window.innerWidth,
};

export { threeDefaultsWall, threeDefaultsTouchTable, ThreeDefaults };
