<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import mqtt, { IClientSubscribeOptions } from 'mqtt';

export default defineComponent({
  name: 'mqtt',
  emits: ['selectStory'],
  setup(props, {emit}) {
    const { host, port, endpoint, ...options } = {
      host: 'broker.hivemq.com',
      port: 8000,
      endpoint: '/mqtt',
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 4000,
      clientId: 'python-mqtt-testClient678213',
      username: '',
      password: '',
    };

    const connectUrl = `ws://${host}:${port}${endpoint}`;
    let client: mqtt.MqttClient;
    const topic = 'sensor/+/present';
    let subscription: IClientSubscribeOptions = {
      qos: 0,
    };

    client = mqtt.connect(connectUrl, options);
    client.disconnected;
    

    client.on('connect', () => {
      console.log('Connection succeeded!');
    });
    client.on('error', (error) => {
      console.log('Connection failed', error);
    });

    const doSubscribe = () => {
      const { qos } = subscription;
      client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error);
          return;
        }
      });

      client.on('message', (topic, message) => {
      emit('selectStory', {id: filterSensorOutOfTopic(topic), msg: JSON.parse(message.toString())});
    });
    };

    const filterSensorOutOfTopic = (topic: string) => {
      const index = topic.indexOf('/') + 1;
      const lastIndex = topic.lastIndexOf('/');
      return topic.substring(index, lastIndex);
    };

    onMounted(() => {
      doSubscribe();
    });
  },
});
</script>