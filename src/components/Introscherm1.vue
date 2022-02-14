<template>
  <div class="background">
    <div class="overlay"></div>
  </div>
  <div class="data" @click="nextStep">
    <div class="image qrIcon">
      <img src="/images_entrance/qr_intro1.svg" alt="" />
    </div>
    <p class="text title">Haal hier je code om te <br />starten in de box</p>
    <p class="text tip">je hebt een ticket nodig om in <br />te loggen.</p>
    <div class="image dots">
      <img src="/images_entrance/dots_intro1.svg" alt="" />
    </div>
    <p class="text title englishTitle">Get here your ticket to <br />start in the box</p>
    <p class="text tip">You need a ticket to log in.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Introscherm1',
  props: {
    nextPath: {
      type: String,
      default: '/intro-2',
      required: false,
    },
  },
  setup(props) {
    const nextStep = () => {
      window.location.href = `${window.location.origin}/entrance${props.nextPath}`;
    };

    return { nextStep };
  },
});
</script>

<style>
.background {
  position: relative;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  z-index: -2;
}
.overlay {
  filter: blur(15px);
  content: '';
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(45, 36, 42, 0.8)),
    url('/background.png');
  background-size: cover;
  background-color: #000000;
  position: absolute;
  left: 0;
  top: 0;
  width: 1080px;
  height: 1920px;
  z-index: -1;
  transform: scale(1.1);
}
.data {
  position: absolute;
  left: 0;
  top: 0;
  width: 1080px;
  height: 1920px;
}
.image {
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 0;
}
.qrIcon {
  margin-top: 500px;
  height: 213px;
}
.dots {
  margin-top: 48px;
}

.text {
  color: #f6f5f1;
  width: 100%;
}
.title {
  margin-top: 120px;
  font-weight: 700;
  font-size: 54px;
  line-height: 64px;
  text-align: center;
}
.englishTitle {
  margin-top: 24px !important;
}
.tip {
  margin-top: 24px;
  font-weight: 400;
  font-size: 36px;
  line-height: 54px;
  text-align: center;
}
</style>