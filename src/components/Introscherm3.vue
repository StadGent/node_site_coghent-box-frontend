<template>
  <div class="background custom-dark overflow-hidden" />
  <div class="w-screen h-screen flex flex-col px-12">
    <div class="pt-32 pb-20">
      <h1 class="hide-things text-6xl font-bold text-text-white text-center">
        {{ t('intro.screen-3.title-1') }}<br />
        {{ t('intro.screen-3.title-2') }}
      </h1>
      <h1 class="show-things text-6xl font-bold text-text-white text-center">
        {{ t('intro.screen-3.title-3') }}<br />
        {{ t('intro.screen-3.title-4') }}
      </h1>
    </div>
    <div
      class="
        overflow-hidden
        custom-container
        rounded-2xl
        z-10
        flex flex-wrap
        text-center
        bg-background-medium
        justify-center
        relative
      "
    >
      <div
        :class="`
          hide-things
          bg-stories-${selectedStory.color}
          w-full
          py-10
          rounded-2xl
          flex
          justify-center
          items-center
          flex-col
          h-96
        `"
      >
        <span class="text-text-white font-bold text-4xl mb-10">
          {{ selectedStory.title }}
        </span>
        <div class="circle-wrapper">
          <svg class="watch__border-animated">
            <circle cx="200" cy="200" r="190" />
          </svg>
          <div class="inner-circle rounded-full flex items-center justify-center">
            <span class="text-text-white text-8xl font-bold">{{
              getNumberByColor(selectedStory.color)
            }}</span>
          </div>
          <div
            :class="`
              checkmark
              bg-text-white
              rounded-full
              w-16
              h-16
              flex
              items-center
              justify-center
              text-stories-${selectedStory.color}
            `"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current"
            >
              <path
                d="M2.8125 19.0625L15.3125 31.5625L37.8125 9.0625"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="w-full absolute bottom-0 hide-things">
        <svg
          width="460"
          height="822"
          viewBox="0 0 230 411"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="ticket"
        >
          <rect width="230" height="411" fill="white" />
          <circle cx="22.5" cy="399.5" r="5.5" fill="#212121" />
          <circle cx="87.5" cy="399.5" r="5.5" fill="#212121" />
          <circle cx="109.5" cy="399.5" r="5.5" fill="#212121" />
          <circle cx="172.5" cy="399.5" r="5.5" fill="#212121" />
          <rect x="45" y="394" width="22" height="11" rx="5.5" fill="#212121" />
          <rect x="136" y="394" width="22" height="11" rx="5.5" fill="#212121" />
          <rect x="191" y="394" width="22" height="11" rx="5.5" fill="#212121" />
          <path
            d="M66.5518 271.234V246.514H90.8219V271.234H66.5518Z"
            stroke="#212121"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M141.138 271.234V246.514H166V271.234H141.138Z"
            stroke="#212121"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M67.7354 188.246V172.354H93.1894"
            stroke="#212121"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M110.948 170V188.834M142.322 172.943V196.486H165.408V172.943H142.322Z"
            stroke="#212121"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M64.1836 227.091H78.3905V215.909H89.6376V194.131H101.477M107.988 216.497H121.011V228.857H154.753M166 228.857H154.753M154.753 228.857V213.554M121.011 244.749V258.874M121.011 273V258.874M121.011 258.874H107.396"
            stroke="#212121"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <rect x="63" y="200.606" width="9.47126" height="9.41714" fill="#212121" />
          <rect x="94.9658" y="232.389" width="9.47126" height="9.41714" fill="#212121" />
          <rect x="116.275" y="190.011" width="9.47126" height="9.41714" fill="#212121" />
          <rect x="128.115" y="200.606" width="9.47126" height="9.41714" fill="#212121" />
          <rect x="23" width="62" height="74" fill="#212121" />
          <rect x="99" y="66" width="83" height="8" fill="#212121" />
          <rect x="23" y="101" width="184" height="4" fill="#212121" />
          <rect x="23" y="117" width="184" height="4" fill="#212121" />
          <rect x="23" y="133" width="184" height="4" fill="#212121" />
          <rect x="23" y="347" width="184" height="4" fill="#212121" />
          <rect x="23" y="363" width="184" height="4" fill="#212121" />
          <rect x="65" y="294" width="12" height="4" fill="#212121" />
          <rect x="83" y="294" width="12" height="4" fill="#212121" />
          <rect x="101" y="294" width="12" height="4" fill="#212121" />
          <rect x="119" y="294" width="12" height="4" fill="#212121" />
          <rect x="137" y="294" width="12" height="4" fill="#212121" />
          <rect x="155" y="294" width="12" height="4" fill="#212121" />
        </svg>

        <div
          :class="`ticket-box relative bg-stories-${selectedStory.color} w-full h-64 -ml-32`"
        />
      </div>
      <div
        class="
          show-things
          text-left
          pl-20
          w-full
          justify-between
          flex
          pr-20
          flex-col
          items-center
          py-20
        "
      >
        <span class="font-light mb-5 text-4xl px-20 text-center">{{
          t('intro.screen-3.info')
        }}</span>
        <img src="/box-map.png" class="w-9/12" />
        <div class="w-full flex justify-center">
          <button
            class="
              flex
              text-3xl
              font-light
              bg-text-white
              text-text-black
              py-7
              px-10
              rounded-2xl
              shadow-1xl
            "
            @click="naarStart"
          >
            <svg
              width="92"
              height="62"
              viewBox="0 0 46 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mr-4 mt-0.5"
            >
              <path
                d="M44.5 15.5H1.5"
                stroke="#212121"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.5 1.5L1.5 15.5L15.5 29.5"
                stroke="#212121"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ t('intro.screen-3.button-back') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, inject, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useBoxVisiter } from 'coghent-vue-3-component-library';
  import Colors from '@/Three/defaults.color';
  import { apolloClient } from '@/main';
  import { useQuery } from '@vue/apollo-composable';
  import { PrintBoxTicketDocument } from 'coghent-vue-3-component-library';
  import useTicket from '@/composables/useTicket';
  import Development from '@/Three/defaults.development';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'Introscherm3',
    components: {},
    setup(props) {
      const { t } = useI18n();
      const router = useRouter();
      let currentVisiter: any = null;
      const { print } = useTicket();
      const { selectedStory } = useBoxVisiter(apolloClient);
      const colors = Colors().storyCssOnlyColor();
      const showPopup = inject<any>('showCodePopup');

      const getNumberByColor = (color: string) => {
        const index = colors.findIndex((element) => color === element);
        return index !== undefined ? index + 1 : 'nan';
      };

      const { fetchMore: printNewTicket } = useQuery(PrintBoxTicketDocument, {
        code: '',
      });

      useBoxVisiter(apolloClient)
        .create(`entities/${selectedStory.value.id}`)
        .then(async (visiter: any) => {
          currentVisiter = visiter;
          if (currentVisiter.code) {
            printTicket();
          }
          if (Development().showVisiterCodePopUp() || showPopup.value !== null) {
            alert(visiter.code);
          }
        });

      const printTicket = async () => {
        const ticket = await printNewTicket({
          variables: { code: currentVisiter.code } as any,
        });
        console.log({ ticket });
        try {
          await print(ticket?.data.PrintBoxTicket.body as string);
        } catch (error) {
          console.log('Print service offline.');
        }
      };

      const naarStart = () => {
        router.push({ name: 'entrance.step1' });
      };

      return { t, naarStart, selectedStory, getNumberByColor, showPopup };
    },
  });
</script>

<style scoped>
  .ticket {
    margin-left: 38%;
    margin-top: 10%;
    z-index: -1;
    transform: translateY(0px);
    position: relative;
    animation: ticket-animation 3s linear;
  }
  .circle-wrapper {
    width: 400px;
    height: 400px;
    position: relative;
  }

  .inner-circle {
    width: 320px;
    height: 320px;
    /* flex-basis: 200px; */
    background-color: rgb(255 255 255 / 50%);
    left: 40px;
    top: 40px;
    position: absolute;
  }
  .watch__border-animated circle {
    animation: border-animation 3s linear;
  }

  @keyframes border-animation {
    0% {
      stroke-dashoffset: 1406;
    }
    100% {
      stroke-dashoffset: 206;
      stroke: white;
      display: none;
    }
  }

  @keyframes ticket-animation {
    0% {
      transform: translateY(520px);
    }
    100% {
      transform: translateY(50px);
    }
  }

  @keyframes hideAnimation {
    to {
      visibility: hidden;
      width: 0;
      height: 0;
      padding: 0 !important;
    }
  }

  @keyframes showAnimation {
    to {
      visibility: visible;
      height: auto;
    }
  }

  .hide-things {
    animation: hideAnimation 0s ease-in 3s;
    animation-fill-mode: forwards;
  }

  .show-things {
    animation: showAnimation 0s ease-in 3s;
    animation-fill-mode: forwards;
    visibility: hidden;
    height: 0;
  }

  [class^='watch__border-animated'] {
    position: relative;
    width: 400px;
    height: 400px;
  }

  [class^='watch__border-animated'] circle {
    fill: none;
    stroke: white;
    stroke-width: 20;
    stroke-linecap: round;
    stroke-dasharray: 1406, 1288;
    stroke-dashoffset: 206;
    transform-origin: center;
    transform: rotate(-90deg);
  }

  .ticket-box::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background: white;
  }

  .checkmark {
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
