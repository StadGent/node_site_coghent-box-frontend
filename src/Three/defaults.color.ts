const Colors = (): {
  green: number;
  pink: number;
  yellow: number;
  lightBlue: number;
  white: number;
  black: number;
  grey: number;
  progressGrey: number;
  story: () => Array<number>;
  storyCss: () => Array<string>;
  storyCssOnlyColor: () => Array<string>;
} => {
  const green = 0x028666;
  const pink = 0x92407a;
  const yellow = 0xca9b09;
  const lightBlue = 0x3596db;
  const white = 0xffffff;
    //@ts-ignore
  const black = 'Black' as number;
  const grey = 0xb0b0b0;
  const progressGrey = 0x9e9e9e;

  const story = () => {
    return [lightBlue, pink, yellow, green];
  };

  const storyCss = () => {
    return [
      'bg-stories-yellow',
      'bg-stories-blue',
      'bg-stories-pink',
      'bg-stories-green',
    ];
  };

  const storyCssOnlyColor = () => {
    return ['yellow', 'blue', 'pink', 'green'];
  };

  return {
    green,
    pink,
    yellow,
    lightBlue,
    white,
    black,
    grey,
    progressGrey,
    story,
    storyCss,
    storyCssOnlyColor,
  };
};

export default Colors;
