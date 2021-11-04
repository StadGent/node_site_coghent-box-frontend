const DefaultColors = (): {
  green: number;
  pink: number;
  yellow: number;
  lightBlue: number;
  white: number;
  black: number;
} => {
  const green = 0x02a77f;
  const pink = 0xfdc20b;
  const yellow = 0xb65099;
  const lightBlue = 0x9fcdd;
  const white = 0xffffff;
  const black = 0x000000;

  return {
    green,
    pink,
    yellow,
    lightBlue,
    white,
    black,
  };
};

export default DefaultColors;
