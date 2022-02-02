type FabricDefaults = {
  canvas: {
    header: {
      height: number;
    };
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
      underline: {
        spacing: number;
        color: string;
        stroke: number;
      };
    };
    secondaryImage: {
      positions: {
        xAxis: Array<number>;
        yAxis: Array<number>;
        blockedPositions: Array<{ xIndex: number; yIndex: number }>;
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
    header: {
      height: 160,
    },
    amountOfFrames: 25,
    dimensions: {
      width: 3840,
      height: 2160,
    },
    selectedImage: {
      canvasPosition: {
        left: 3840 / 2,
        top: 2160 - 200,
      },
      scale: {
        scaleX: 0.4,
        scaleY: 0.4,
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
      underline: {
        spacing: 10,
        color: '#02A77F',
        stroke: 10,
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
        yAxis: [2160 / 6, (2160 / 6) * 2, (2160 / 6) * 3, (2160 / 6) * 4],
        blockedPositions: [{ xIndex: 2, yIndex: 3 }],
      },
      scale: {
        scaleX: 0.3,
        scaleY: 0.3,
      },
    },
  },
};

export { fabricdefaults, FabricDefaults };
