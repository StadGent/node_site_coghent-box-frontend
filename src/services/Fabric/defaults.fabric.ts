import { Coordinate, Scale, Position } from './FabricService';

type FabricDefaults = {
  canvas: {
    header: {
      height: number;
    };
    relationBrowser: {
      height: number;
      selectedRelationBorder: {
        color: string;
        stroke: number;
      };
      selectedRelationLine: {
        color: string;
      };
    };
    relationLimit: number;
    relationIterations: number;
    dimensions: {
      width: number;
      height: number;
    };
    selectedImage: {
      canvasPosition: {
        left: number;
        top: number;
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
    infoBar: {
      height: number;
      startFrame: {
        text: {
          position: {
            x: number;
            y: number;
          };
          origin: {
            originX: string;
            originY: string;
          };
          fontSize: number;
          fontFamily: string;
        };
        position: {
          top: number;
          left: number;
        };
        origin: {
          originX: string;
          originY: string;
        };
        scale: Scale;
      };
      historyFrame: {
        text: {
          position: {
            x: number;
            y: number;
          };
          origin: {
            originX: string;
            originY: string;
          };
          fontSize: number;
          fontFamily: string;
        };
        position: {
          top: number;
          left: number;
        };
        origin: {
          originX: string;
          originY: string;
        };
        scale: Scale;
      };
    };
    secondaryImage: {
      positions: {
        xAxis: Array<number>;
        yAxis: Array<number>;
        blockedPositions: Position[];
        range: number;
      };
      height: Array<number>;
    };
  };
};

const fabricdefaults: FabricDefaults = {
  canvas: {
    header: {
      height: 100,
    },
    relationBrowser: {
      height: 80,
      selectedRelationBorder: {
        color: '#02A77F',
        stroke: 5,
      },
      selectedRelationLine: {
        color: '#B65099',
      },
    },
    relationIterations: 3,
    relationLimit: 7,
    dimensions: {
      width: 1920,
      height: 900,
    },
    selectedImage: {
      canvasPosition: {
        left: 1920 / 2,
        top: 880 - 10,
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
    infoBar: {
      height: 300,
      startFrame: {
        text: {
          position: {
            x: 1920 / 2 - 300,
            y: 880 - 200,
          },
          origin: {
            originX: 'right',
            originY: 'bottom',
          },
          fontSize: 20,
          fontFamily: 'Avenir',
        },
        position: {
          top: 880 - 10,
          left: 1920 / 2 - 250,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
        },
        origin: {
          originX: 'right',
          originY: 'bottom',
        },
      },
      historyFrame: {
        text: {
          position: {
            x: 1920 / 2 + 300,
            y: 880 - 200,
          },
          origin: {
            originX: 'left',
            originY: 'bottom',
          },
          fontSize: 20,
          fontFamily: 'Avenir',
        },
        position: {
          top: 880 - 10,
          left: 1920 / 2 + 250,
        },
        scale: {
          scaleX: 1,
          scaleY: 1,
        },
        origin: {
          originX: 'left',
          originY: 'bottom',
        },
      },
    },
    secondaryImage: {
      positions: {
        xAxis: [
          1920 / 6,
          (1920 / 6) * 2,
          (1920 / 6) * 3,
          (1920 / 6) * 4,
          (1920 / 6) * 5,
          (1920 / 6) * 6,
        ],
        yAxis: [-100, 100, 300, 500],
        blockedPositions: [{ yIndex: 3, xIndex: 3 }],
        range: 1,
      },
      height: [150, 125, 100],
    },
  },
};

export { fabricdefaults, FabricDefaults };
