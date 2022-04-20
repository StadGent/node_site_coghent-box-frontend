<template>
  <div class="background custom-dark overflow-hidden" />
  <div class="w-screen h-screen flex flex-col px-12">
    <h1 class="text-6xl font-bold text-text-white text-center mt-32 mb-20">
      {{ t('intro.screen-2.title-1') }}<br />
      {{ t('intro.screen-2.title-2') }}
    </h1>
    <div
      class="
        custom-container
        rounded-2xl
        z-10
        flex flex-wrap
        p-4
        text-center
        bg-background-medium
        items-center
        justify-center
      "
    >
      <svg
        width="240"
        height="148"
        viewBox="0 0 120 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="mt-10"
      >
        <path
          d="M55.7893 38.0144C51.3109 36.9677 47.383 34.2903 44.7716 30.5045C42.1601 26.7187 41.0525 22.0959 41.6646 17.5377C42.2767 12.9796 44.5647 8.81279 48.0824 5.85007C51.6001 2.88735 56.0952 1.34111 60.6911 1.51291C65.287 1.68472 69.6541 3.56224 72.9408 6.77932C76.2274 9.9964 78.198 14.3224 78.4681 18.9135C78.7382 23.5047 77.2885 28.0319 74.4017 31.6121C71.5149 35.1924 67.398 37.569 62.854 38.2785"
          stroke="#212121"
          stroke-width="3"
        />
        <circle cx="12" cy="20" r="10.5" stroke="#212121" stroke-width="3" />
        <circle cx="108" cy="20" r="10.5" stroke="#212121" stroke-width="3" />
        <path
          d="M54.5 21.5L57.5 24.5L64.5 15.5"
          stroke="#212121"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M76.3329 70.5L79.2379 56.557C79.9289 53.242 77.7409 50.013 74.4069 49.425L63.4999 47.5V34C63.4999 32.067 61.9329 30.5 59.9999 30.5C58.0669 30.5 56.4999 32.067 56.4999 34V57.358C56.4999 59.182 54.2579 60.054 53.0259 58.709L47.7069 52.906C46.4219 51.506 44.3299 51.202 42.6999 52.18C41.4649 52.921 41.0219 54.497 41.6899 55.773L49.4069 70.506"
          stroke="#212121"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p class="text-3xl p-2 w-full text-5xl font-bold mt-10">
        {{ t('intro.screen-2.sub-title-1') }}<br />
        {{ t('intro.screen-2.sub-title-2') }}
      </p>
      <svg
        class="mt-10"
        width="96"
        height="202"
        viewBox="0 0 48 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1_463_2734" fill="white">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M35.9988 0H11.9988V67H4.4141C1.09475 67 -0.780306 70.8097 1.24448 73.44L20.8302 98.8825C22.4314 100.963 25.5682 100.963 27.1694 98.8825L46.7551 73.44C48.7799 70.8097 46.9049 67 43.5855 67H35.9988V0Z"
          />
        </mask>
        <path
          d="M11.9988 0V-4H7.99876V0H11.9988ZM35.9988 0H39.9988V-4H35.9988V0ZM11.9988 67V71H15.9988V67H11.9988ZM1.24448 73.44L-1.92514 75.8799L-1.92514 75.88L1.24448 73.44ZM20.8302 98.8825L23.9998 96.4426V96.4426L20.8302 98.8825ZM27.1694 98.8825L23.9998 96.4426L27.1694 98.8825ZM46.7551 73.44L49.9247 75.88L49.9247 75.88L46.7551 73.44ZM35.9988 67H31.9988V71H35.9988V67ZM11.9988 4H35.9988V-4H11.9988V4ZM15.9988 67V0H7.99876V67H15.9988ZM4.4141 71H11.9988V63H4.4141V71ZM4.41411 71C4.40448 70.9875 4.40003 70.9799 4.39872 70.9776C4.3974 70.9752 4.39809 70.9761 4.39959 70.98C4.40107 70.9839 4.40269 70.989 4.40402 70.995C4.40534 71.0009 4.4061 71.0063 4.40647 71.011C4.40721 71.0203 4.40613 71.0236 4.40677 71.0203C4.4075 71.0166 4.40959 71.0092 4.4141 71C4.41862 70.9908 4.42327 70.9846 4.42576 70.9818C4.42793 70.9793 4.42602 70.9821 4.41815 70.9872C4.41423 70.9898 4.40944 70.9925 4.40398 70.9951C4.39844 70.9976 4.39339 70.9995 4.38943 71.0007C4.3854 71.0019 4.38427 71.0019 4.38695 71.0015C4.3896 71.0011 4.39832 71 4.4141 71V63C-2.22461 63 -5.97471 70.6194 -1.92514 75.8799L4.41411 71ZM23.9998 96.4426L4.4141 71L-1.92514 75.88L17.6606 101.323L23.9998 96.4426ZM23.9998 96.4426V96.4426L17.6605 101.323C20.863 105.483 27.1366 105.483 30.339 101.323L23.9998 96.4426ZM43.5855 71L23.9998 96.4426L30.339 101.323L49.9247 75.88L43.5855 71ZM43.5855 71C43.6013 71 43.61 71.0011 43.6127 71.0015C43.6153 71.0019 43.6142 71.0019 43.6102 71.0007C43.6062 70.9995 43.6012 70.9976 43.5956 70.9951C43.5902 70.9925 43.5854 70.9898 43.5814 70.9873C43.5736 70.9821 43.5717 70.9793 43.5738 70.9818C43.5763 70.9846 43.581 70.9908 43.5855 71C43.59 71.0092 43.5921 71.0166 43.5928 71.0204C43.5935 71.0236 43.5924 71.0203 43.5931 71.011C43.5935 71.0063 43.5943 71.0009 43.5956 70.995C43.5969 70.989 43.5985 70.9839 43.6 70.98C43.6015 70.9761 43.6022 70.9752 43.6009 70.9776C43.5996 70.9799 43.5951 70.9875 43.5855 71L49.9247 75.88C53.9743 70.6194 50.2242 63 43.5855 63V71ZM35.9988 71H43.5855V63H35.9988V71ZM31.9988 0V67H39.9988V0H31.9988Z"
          fill="#212121"
          mask="url(#path-1-inside-1_463_2734)"
        />
      </svg>

      <div class="grid grid-cols-4 mt-12 flex-wrap justify-evenly w-full mt-10">
        <div
          v-for="(item, index) in stories"
          :key="index"
          class="flex flex-col items-center"
          :class="[selectedIndex === index ? 'opacity-100' : 'opacity-80']"
          @click="selectStory(item, index)"
        >
          <div
            :class="[
              `bg-stories-${colors[index]} 
              circle text-white flex justify-center items-center font-bold text-5xl`,

              selectedIndex === index
                ? `border-text-white shadow-${colors[index]}`
                : `border-stories-${colors[index]}`,
            ]"
          >
            {{ index + 1 }}
          </div>
          <p class="p-4 text-center text-2xl mb-10">
            {{ item.title[0] ? item.title[0].value : '' }}
          </p>
        </div>
      </div>
      <div class="text-left pl-20 w-full mb-32 mt-10 justify-between flex pr-20">
        <button
          class="
            flex
            text-4xl
            font-light
            bg-text-white
            text-text-black
            py-7
            px-10
            rounded-2xl
            shadow-1xl
          "
          @click="prevStep"
        >
          <svg
            width="92"
            height="62"
            viewBox="0 0 46 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-4 mt-1.5"
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
          {{ t('intro.screen-2.button-back') }}
        </button>
        <button
          v-show="selectedIndex !== undefined"
          :class="[
            `
            flex
            text-4xl
            font-light
            text-text-white
            py-7
            px-10
            rounded-2xl
            shadow-1xl
            
          `,
            selectedIndex !== undefined
              ? `bg-stories-${colors[selectedIndex]}`
              : `bg-text-black`,
          ]"
          @click="nextStep(stories[selectedIndex], selectedIndex)"
        >
          {{ t('intro.screen-2.button-next') }}
          <svg
            width="92"
            height="62"
            viewBox="0 0 46 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ml-4 mt-1.5 stroke-current"
          >
            <path
              d="M1.5 15.5L44.5 15.5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M30.5 29.5L44.5 15.5L30.5 1.5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { CardComponent, GetActiveBoxDocument } from 'coghent-vue-3-component-library';
  import { Entity } from 'coghent-vue-3-component-library/lib/queries';
  import { useQuery } from '@vue/apollo-composable';
  import { useBoxVisiter } from 'coghent-vue-3-component-library';
  import Colors from '@/Three/defaults.color';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'Introscherm2',
    setup() {
      const router = useRouter();
      const { t } = useI18n();
      const selectedIndex = ref();
      const { setSelectedStory } = useBoxVisiter();
      const colors = Colors().storyCssOnlyColor();

      const selectStory = async (_entity: any, index: number) => {
        selectedIndex.value = index;
      };

      const nextStep = async (_entity: any, index: number) => {
        let title = '';
        if (_entity.title) {
          title = _entity.title[0]?.value as string;
        }
        setSelectedStory({
          id: _entity.id,
          color: colors[index],
          title: title,
        });

        router.push({ name: 'entrance.step3' });
      };

      const stories = inject<any>('stories');

      const prevStep = () => {
        router.push({ name: 'entrance.step1' });
      };

      return {
        t,
        stories,
        colors,
        nextStep,
        prevStep,
        selectStory,
        selectedIndex,
      };
    },
  });
</script>

<style scoped>
  .circle {
    width: 324px;
    height: 324px;
    opacity: 1;
    border-radius: 50%;
    /* background: black; */
    color: white;
    border-width: 16px;
    border-style: solid;
  }

  .shadow-yellow {
    box-shadow: 0px 0px 50px 20px rgba(253, 194, 11, 0.5);
  }
  .shadow-blue {
    box-shadow: 0px 0px 50px 20px rgba(159, 205, 217, 0.5);
  }
  .shadow-pink {
    box-shadow: 0px 0px 50px 20px rgba(182, 80, 153, 0.5);
  }
  .shadow-green {
    box-shadow: 0px 0px 50px 20px rgba(2, 167, 127, 0.5);
  }
</style>
