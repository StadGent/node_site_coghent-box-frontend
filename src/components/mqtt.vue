<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import mqtt, { IClientSubscribeOptions } from 'mqtt';

export default defineComponent({
  name: 'Mqtt',
  emits: ['selectStory'],
  setup(props, {emit}) {
    const { host, port, endpoint, ...options } = {
      host: 'localhost',
      // host: 'mqtt.inuits.local',
      port: 9001,
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

    const doSubscribe = (_topic: string) => {
      console.log('DO SCUBSCRIBE')
      const { qos } = subscription;
      client.subscribe(_topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error);
          return;
        }
      });

      client.on('message', (_topic, message) => {
        emit('selectStory', {topic:_topic ,id: filterSensorOutOfTopic(_topic), msg: JSON.parse(message.toString())});
      });
    };

    const filterSensorOutOfTopic = (_topic: string) => {
      const index = _topic.indexOf('/') + 1;
      const lastIndex = _topic.lastIndexOf('/');
      return _topic.substring(index, lastIndex);
    };

    onMounted(() => {
      doSubscribe('sensors/+/#');
    });
  },
});
</script>