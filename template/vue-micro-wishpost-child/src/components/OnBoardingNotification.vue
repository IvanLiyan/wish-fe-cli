<template>
  <div class="welcome-bg-color" style="height: 100%">
    <v-container fluid class="welcome-bg-color">
      <v-card v-show="show" class="mx-auto notification">
        <v-card-text class="pa-0">
          <v-icon
            color="#16A77A"
            style="
              font-size: 53.33px;
              margin-left: 213.33px;
              margin-top: 45.33px;
            "
          >
            check_circle
          </v-icon>

          <div style="font-size: 28px; margin-top: 21.33px; margin-left: 184px">
            {{ title }}
          </div>

          <v-btn
            color="#305BEF"
            class="pa-0 white--text"
            style="
              width: 400px;
              height: 36px;
              margin-top: 16px;
              margin-left: 40px;
            "
            @click="jumpToNext"
          >
            {{ btnContent }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "onBoardingNotification",
  props: {
    show: Boolean,
    title: String,
    waiting: Boolean,
    waitingTime: Number,
    next: { type: String, default: "show-tfa" },
  },
  data: () => ({
    btnContent: "",

    countDown: null,
    countDownJob: 0,
  }),
  methods: {
    calculateCountDown: function () {
      if (this.countDown <= 0) {
        this.jumpToNext();
        return;
      }

      this.countDown = this.countDown - 1;
      this.btnContent = this.countDown.toString() + this.i18n("s后自动跳转");
    },
    jumpToNext: function () {
      clearInterval(this.countDownJob);
      this.$emit(this.next);
    },
  },
  watch: {
    show: function () {
      if (this.show == false) {
        return;
      }

      if (this.waiting == false) {
        this.btnContent = this.i18n("下一步");
      } else {
        this.countDown = this.waitingTime;
        this.btnContent = this.countDown.toString() + this.i18n("s后自动跳转");
        this.countDownJob = setInterval(this.calculateCountDown, 1000);
      }
    },
  },
};
</script>

<style scoped>
.notification {
  width: 480px;
  height: 236px;
  margin-top: 48px;
}
</style>
