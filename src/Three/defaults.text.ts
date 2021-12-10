type Textsize = {
  smaller: number;
  small: number;
  medium: number;
  big: number;
  veryBig: number;
};

type CustomText = {
  size: Textsize;
};

const customText: CustomText = {
  size: {
    smaller: 0.2,
    small: 0.3,
    medium: 0.4,
    big: 0.5,
    veryBig: 1.2,
  },
};

export default customText;
