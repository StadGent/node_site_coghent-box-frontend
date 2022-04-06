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
    console.log('DMX SEQUENCE')
    axios.get(`${BASE}1/go+`)
  };
  const lightsOff = () => {
    console.log('DMX OFF')
    axios.get(`${BASE}3/go+`)

  };
  const lightsOn = () => {
    console.log('DMX ON')
    axios.get(`${BASE}2/go+`)

  };
  return { sequence, lightsOff, lightsOn };
};

export default useDMX;
