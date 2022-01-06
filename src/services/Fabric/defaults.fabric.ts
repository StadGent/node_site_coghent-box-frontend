type FabricDefaults = {
  images: {
    scaleX: number;
    scaleY: number;
  };
  canvas: {
    dimensions: {
      width: number;
      height: number;
    };
    selectedImage: {
      canvasPosition: {
        left: number;
        top: number;
      };
      scale: {
        scaleX: number;
        scaleY: number;
      };
      controls: {
        bl: boolean;
        br: boolean;
        mt: boolean;
        mb: boolean;
        ml: boolean;
        mr: boolean;
        tl: boolean;
        tr: boolean;
        mtr: boolean;
      };
    };
    secondaryImage: {
      scale: {
        scaleX: number;
        scaleY: number;
      };
    };
  };
};

const fabricdefaults: FabricDefaults = {
  images: {
    scaleX: 0.25,
    scaleY: 0.25,
  },
  canvas: {
    dimensions: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    selectedImage: {
      canvasPosition: {
        left: 20,
        top: 20,
      },
      scale: {
        scaleX: 0.3,
        scaleY: 0.3,
      },
      controls: {
        bl: false,
        br: false,
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        tl: false,
        tr: false,
        mtr: false,
      },
    },
    secondaryImage: {
      scale: {
        scaleX: 0.2,
        scaleY: 0.2,
      },
    },
  },
};

export { fabricdefaults, FabricDefaults };
