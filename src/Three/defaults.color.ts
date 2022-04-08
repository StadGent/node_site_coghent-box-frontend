const Colors = (): {
  green: number;
  pink: number;
  yellow: number;
  lightBlue: number;
  white: number;
  black: number;
  grey: number;
  progressGrey: number;
  story: () => Array<number>
  storyCss: () => Array<string>
} => {
  const green = 0x028666
  const pink = 0x92407A;
  const yellow = 0xCA9B09;
  const lightBlue = 0x3596DB;
  const white = 0xffffff;
  const black = 0x00f00;
  const grey = 0xB0B0B0;
  const progressGrey = 0x9E9E9E;

  const story = () => {
    return [
      lightBlue,
      pink,
      yellow,      
      green,
    ];
  };

  const storyCss = () => {
    return [
      'bg-stories-yellow',
      'bg-stories-blue',
      'bg-stories-pink',
      'bg-stories-green',
    ];
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
    storyCss
  };
};

export default Colors;
