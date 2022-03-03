import { ConfigStore } from '@/stores/ConfigStore';
import StoreFactory from '@/stores/StoreFactory';

const useIIIF = () => {
  const configStore = StoreFactory.get(ConfigStore);
  const iiifUrl = configStore.config.value.iiifLink;
  console.log(configStore.config.value);
  const storageLink = configStore.config.value.storageLink;

  const noImageUrl = '/no-image.png';

  const generateUrl = (
    filename: string,
    format: 'square' | 'full',
    size: number | 'max' = 1000,
  ) => {
    return `${iiifUrl}iiif/3/${filename}/${format}/${
      size === 'max' ? size : size + ','
    }/0/default.jpg`;
    // return `${storageLink}download/${filename}`
  };

  const generateInfoUrl = (filename: string) => {
    return `${iiifUrl}iiif/3/${filename}/info.json`;
  };

  return {
    noImageUrl,
    generateUrl,
    generateInfoUrl,
  };
};

export default useIIIF;
