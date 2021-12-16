const Colors = (): {
  green: number;
  pink: number;
  yellow: number;
  lightBlue: number;
  white: number;
  black: number;
  grey: number;
} => {
  const green = 0x02a77f;
  const pink = 0xb65099;
  const yellow = 0xfdc20b;
  const lightBlue = 0x9fcdd;
  const white = 0xffffff;
  const black = 0x000000;
  const grey = 0xdcdcdc;

  return {
    green,
    pink,
    yellow,
    lightBlue,
    white,
    black,
    grey,
  };
};

export default Colors;
