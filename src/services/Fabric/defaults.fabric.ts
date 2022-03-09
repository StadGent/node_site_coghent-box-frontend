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
      height: 100,
    },
    relationBrowser: {
      height: 80,
      selectedRelationBorder: {
        color: '#02A77F',
        stroke: 10,
      },
      selectedRelationLine: {
        color: '#B65099',
      },
    },
    relationLimit: 4,
    dimensions: {
      width: 1920,
      height: 900,
    },
    selectedImage: {
      canvasPosition: {
        left: 1920 / 2,
        top: 880 - 50,
      },
      scale: {
        scaleX: 0.25,
        scaleY: 0.25,
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
      height: 400,
      startFrame: {
        text: {
          position: {
            x: 1920 / 2 - 300,
            y: 880 - 300,
          },
          origin: {
            originX: 'right',
            originY: 'bottom',
          },
          fontSize: 24,
          fontFamily: 'Avenir',
        },
        position: {
          top: 1920 - 50,
          left: 1080 / 2 - 300,
        },
        scale: {
          scaleX: 0.2,
          scaleY: 0.2,
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
            y: 880 - 300,
          },
          origin: {
            originX: 'left',
            originY: 'bottom',
          },
          fontSize: 24,
          fontFamily: 'Avenir',
        },
        position: {
          top: 880 - 50,
          left: 1920 / 2 + 300,
        },
        scale: {
          scaleX: 0.2,
          scaleY: 0.2,
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
        yAxis: [-100, 0, 250, 400],
        blockedPositions: [
          { xIndex: 3, yIndex: 3 },
          { xIndex: 2, yIndex: 3 },
        ],
        range: 1,
      },
      scale: {
        scaleX: 0.2,
        scaleY: 0.2,
      },
    },
  },
};

export { fabricdefaults, FabricDefaults };
