import { Frame, Asset, Story, ComponentMetadata } from '@/models/GraphqlModel';
import Defaults from '@/Three/defaults.config';

const Common = (): {
  FilterOutIdAfterSlash: (str: string) => string;
  RemoveEntersFromString: (str: string) => string;
  pixelsToMeters: (pixels: number) => number;
  connectRelationMetadata: (parent: Frame | Story, child: Asset | Frame) => ComponentMetadata;
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
  }

  const connectRelationMetadata = (parent: Frame | Story, child: Asset | Frame) => {
    const metadataForAsset = parent.relationMetadata.filter(metadata => Common().FilterOutIdAfterSlash(metadata.key) == child.id)[0];
    return metadataForAsset;    
  }

  return {
    FilterOutIdAfterSlash,
    RemoveEntersFromString,
    pixelsToMeters,
    connectRelationMetadata,
  };
};

export default Common;
