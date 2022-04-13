import { ConfigStore } from '@/stores/ConfigStore';
import StoreFactory from '@/stores/StoreFactory';
import axios from 'axios';

const useDMX = (): {
  sequence: () => void
  lightsOn: () => void;
  lightsOff: () => void;
} => {
  const configStore = StoreFactory.get(ConfigStore);
  const BASE = configStore.config.value.dmx
  const sequence = () => {
    try {
      axios.get(`${BASE}/sequence`)
      console.log('DMX SEQUENCE')

    } catch (error) {
      console.error({ error })
    }
  };
  const lightsOff = () => {
    try {
      axios.get(`${BASE}/lightsOff`)
      console.log('DMX OFF')
    } catch (error) {
      console.error({ error })
    }

  };
  const lightsOn = () => {
    try {
      axios.get(`${BASE}/lightsOn`)
      console.log('DMX ON')
    } catch (error) {
      console.error({ error })
    }

  };
  return { sequence, lightsOff, lightsOn };
};

export default useDMX;
