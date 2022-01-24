type FabricDefaults = {
  canvas: {
    amountOfFrames: number;
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
      origin: {
        originX: string;
        originY: string;
      };
    };
    secondaryImage: {
      positions: {
        xAxis: Array<number>;
        yAxis: Array<number>;
      };
      scale: {
        scaleX: number;
        scaleY: number;
      };
    };
  };
};

const fabricdefaults: FabricDefaults = {
  canvas: {
    amountOfFrames: 25,
    dimensions: {
      width: 3840,
      height: 2160,
    },
    selectedImage: {
      canvasPosition: {
        left: 3840 / 2,
        top: 2160 - 20,
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
      origin: {
        originX: 'center',
        originY: 'bottom',
      },
    },
    secondaryImage: {
      positions: {
        xAxis: [
          3840 / 7,
          (3840 / 7) * 2,
          (3840 / 7) * 3,
          (3840 / 7) * 4,
          (3840 / 7) * 5,
          (3840 / 7) * 6,
        ],
        yAxis: [2160 / 7, (2160 / 7) * 2, (2160 / 7) * 3, (2160 / 7) * 4, (2160 / 7) * 5],
      },
      scale: {
        scaleX: 0.2,
        scaleY: 0.2,
      },
    },
  },
};

export { fabricdefaults, FabricDefaults };
