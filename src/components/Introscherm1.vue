<template>
  <div class="background overflow-hidden" />
  <div class="w-screen h-screen flex flex-col px-32" @click="nextStep">
    <CardComponent
      :large="true"
      :background-color="`bg-accent-yellow`"
      :ring-color="'ring-accent-yellow'"
      class="z-10"
    >
      <div class="flex justify-center font-bold text-center text-4xl my-32">
        <h1 class="text-6xl font-bold">
          {{ t('intro.screen-1.title-1') }}<br />
          {{ t('intro.screen-1.title-2') }}
        </h1>
      </div>
    </CardComponent>
    <div class="w-full flex flex-col justify-center text-text-black">
      <div class="flex justify-center my-20">
        <svg
          width="148"
          height="175"
          viewBox="0 0 148 175"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M90.692 117.662V6.09065C90.692 4.42611 88.7774 3.48999 87.4637 4.51227L78.6005 11.4096C77.8182 12.0185 76.7078 11.9623 75.9909 11.2776L67.6907 3.35033C66.9047 2.59966 65.6631 2.61409 64.8947 3.38284L57.2277 11.054C56.4466 11.8356 55.1797 11.8356 54.3985 11.054L46.7641 3.41537C45.9829 2.63381 44.716 2.63381 43.9349 3.41537L36.3004 11.054C35.5193 11.8356 34.2523 11.8356 33.4712 11.054L25.8367 3.41537C25.0556 2.63381 23.7887 2.63381 23.0075 3.41537L15.2819 11.1452C14.5373 11.8903 13.3424 11.93 12.5499 11.2362L5.31742 4.90433C4.02437 3.77229 2 4.69055 2 6.40912V134.114C2 145.082 7.97924 173 43.8547 173C72.9536 173 80.5606 147.076 80.7266 134.114V117.662H146V137.603C146 150.566 134.54 173 110.623 173C86.7059 173 62.4567 173 47.3426 173M15.4533 83.7609H75.7439M15.4533 99.2157H75.7439M15.4533 113.175H50.8304"
            stroke="#212121"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M17.1233 64.8513L15.8693 63.1023L14.8463 64.8513H12.7783L14.8133 61.6503L12.7013 58.7133H14.8133L16.0563 60.4403L17.0793 58.7133H19.1473L17.0683 61.8373L19.2353 64.8513H17.1233Z"
            fill="#212121"
          />
          <path
            d="M26.1233 64.8513L24.8693 63.1023L23.8463 64.8513H21.7783L23.8133 61.6503L21.7013 58.7133H23.8133L25.0563 60.4403L26.0793 58.7133H28.1473L26.0683 61.8373L28.2353 64.8513H26.1233Z"
            fill="#212121"
          />
          <path
            d="M35.1233 64.8513L33.8693 63.1023L32.8463 64.8513H30.7783L32.8133 61.6503L30.7013 58.7133H32.8133L34.0563 60.4403L35.0793 58.7133H37.1473L35.0683 61.8373L37.2353 64.8513H35.1233Z"
            fill="#212121"
          />
          <path
            d="M44.1233 64.8513L42.8693 63.1023L41.8463 64.8513H39.7783L41.8133 61.6503L39.7013 58.7133H41.8133L43.0563 60.4403L44.0793 58.7133H46.1473L44.0683 61.8373L46.2353 64.8513H44.1233Z"
            fill="#212121"
          />
          <path
            d="M53.1233 64.8513L51.8693 63.1023L50.8463 64.8513H48.7783L50.8133 61.6503L48.7013 58.7133H50.8133L52.0563 60.4403L53.0793 58.7133H55.1473L53.0683 61.8373L55.2353 64.8513H53.1233Z"
            fill="#212121"
          />
          <path
            d="M62.1233 64.8513L60.8693 63.1023L59.8463 64.8513H57.7783L59.8133 61.6503L57.7013 58.7133H59.8133L61.0563 60.4403L62.0793 58.7133H64.1473L62.0683 61.8373L64.2353 64.8513H62.1233Z"
            fill="#212121"
          />
          <path
            d="M71.1233 64.8513L69.8693 63.1023L68.8463 64.8513H66.7783L68.8133 61.6503L66.7013 58.7133H68.8133L70.0563 60.4403L71.0793 58.7133H73.1473L71.0683 61.8373L73.2353 64.8513H71.1233Z"
            fill="#212121"
          />
          <path
            d="M80.1233 64.8513L78.8693 63.1023L77.8463 64.8513H75.7783L77.8133 61.6503L75.7013 58.7133H77.8133L79.0563 60.4403L80.0793 58.7133H82.1473L80.0683 61.8373L82.2353 64.8513H80.1233Z"
            fill="#212121"
          />
        </svg>
      </div>
      <p class="font-bold text-5xl text-center font-bold">
        {{ t('intro.screen-1.info-1') }}<br />
        {{ t('intro.screen-1.info-2') }}
      </p>
      <div class="text-center">
        <button
          class="
            text-4xl
            font-bold
            bg-text-black
            text-text-white
            mt-28
            py-11
            px-24
            rounded
          "
        >
          {{ t('intro.screen-1.button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Common from '@/composables/common';
  import { CardComponent } from 'coghent-vue-3-component-library';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  export let showCodePopup: string | null = null;

  export default defineComponent({
    name: 'Introscherm1',
    components: { CardComponent },
    setup() {
      const { t } = useI18n();

      const router = useRouter();
      const nextStep = () => {
        router.push({ name: 'entrance.step2' });
      };

      onMounted(() => {
        if (showCodePopup === null) showCodePopup = Common().getUrlParamValue('popup');
      });

      return { t, nextStep };
    },
  });
</script>

<style>
  .background {
    top: 0;
    left: 0;
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-image: url('/background_entrance.png');
    background-size: cover;
    z-index: -1;
  }

  .background::after {
    content: '';
    width: 100vh;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    background: rgba(246, 245, 241, 0.8);
    backdrop-filter: blur(5px);
  }
</style>
