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
      height: 160,
    },
    relationBrowser: {
      height: 100,
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
      width: 3840,
      height: 1900,
    },
    selectedImage: {
      canvasPosition: {
        left: 3840 / 2,
        top: 1900 - 50,
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
    infoBar: {
      startFrame: {
        text: {
          position: {
            x: 3840 / 2 - 300,
            y: 1900 - 300,
          },
          origin: {
            originX: 'right',
            originY: 'bottom',
          },
          fontSize: 24,
          fontFamily: 'Avenir',
        },
        position: {
          top: 1900 - 50,
          left: 3840 / 2 - 300,
        },
        scale: {
          scaleX: 0.3,
          scaleY: 0.3,
        },
        origin: {
          originX: 'right',
          originY: 'bottom',
        },
      },
      historyFrame: {
        text: {
          position: {
            x: 3840 / 2 + 300,
            y: 1900 - 300,
          },
          origin: {
            originX: 'left',
            originY: 'bottom',
          },
          fontSize: 24,
          fontFamily: 'Avenir',
        },
        position: {
          top: 1900 - 50,
          left: 3840 / 2 + 300,
        },
        scale: {
          scaleX: 0.3,
          scaleY: 0.3,
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
          3840 / 7,
          (3840 / 7) * 2,
          (3840 / 7) * 3,
          (3840 / 7) * 4,
          (3840 / 7) * 5,
          (3840 / 7) * 6,
          (3840 / 7) * 7,
        ],
        yAxis: [1900 / 6 - 300, 1900 / 6, (1900 / 6) * 2, (1900 / 6) * 3, (1900 / 6) * 4],
        blockedPositions: [{ xIndex: 2, yIndex: 4 }],
        range: 1,
      },
      scale: {
        scaleX: 0.3,
        scaleY: 0.3,
      },
    },
  },
};

export { fabricdefaults, FabricDefaults };
