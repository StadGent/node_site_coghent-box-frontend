const changeLineColorHelper = (line: any, color: string) => {
  line.stroke = color;
};

const createDynamicLine = (frame1: any, frame2: any) => {
  console.log('Generating relation');
  if (frame1 && frame2) {
    const line = [
      frame1.getCenterPoint().x,
      frame1.getCenterPoint().y,
      frame2.getCenterPoint().x,
      frame2.getCenterPoint().y,
    ];
  }
};

export { createDynamicLine, changeLineColorHelper };
