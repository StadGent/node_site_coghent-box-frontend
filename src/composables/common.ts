import Defaults from '@/Three/defaults.config';

const Common = (): {
  FilterOutIdAfterSlash: (str: string) => string;
  RemoveEntersFromString: (str: string) => string;
  pixelsToMeters: (pixels: number) => number;
  firstIsBiggest: (first:number, second: number) => boolean;
  awaitTimeout: (time: number) => Promise<unknown>;
} => {
  const FilterOutIdAfterSlash = (str: string) => {
    const index = (str.indexOf('/') as number) + 1;
    const id = str.slice(index);
    return id;
  };

  const RemoveEntersFromString = (str: string) => {
    return str.replace(/\n/g, '');
  };

  const pixelsToMeters = (pixels: number) => {
    return pixels * Defaults().pixelInMeter();
  };

  const firstIsBiggest = (first: number, second: number) => {
    return first > second;
  }

  const awaitTimeout = (time: number) => {
    return new Promise((resolve) =>
      setTimeout(resolve, time),
    );
  }

  return {
    FilterOutIdAfterSlash,
    RemoveEntersFromString,
    pixelsToMeters,
    firstIsBiggest,
    awaitTimeout,
  };
};

export default Common;
