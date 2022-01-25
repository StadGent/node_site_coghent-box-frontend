const Colors = (): {
  green: number;
  pink: number;
  yellow: number;
  lightBlue: number;
  white: number;
  black: number;
  grey: number;
  progressGrey: number;
} => {
  const green = 0x02a77f;
  const pink = 0xb65099;
  const yellow = 0xfdc20b;
  const lightBlue = 0x9fcdd;
  const white = 0xffffff;
  const black = 0x00f00;
  const grey = 0xdcdcdc;
  const progressGrey = 0xc6c6c6;

  return {
    green,
    pink,
    yellow,
    lightBlue,
    white,
    black,
    grey,
    progressGrey
  };
};

export default Colors;
