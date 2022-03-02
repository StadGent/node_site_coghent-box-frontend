import { ref } from 'vue';
import BaseStore from './BaseStore';

export class ConfigStore extends BaseStore {
  id = 'ConfigStore';

  loading: boolean = false;

  config = ref<any>({});

  get hasConfig(): boolean {
    return !!this.config.value;
  }

  setConfig(config: any): void {
    this.config.value = config;
    this.loading = false;
  }
}
