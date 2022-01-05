<template>
  <v-dialog v-model="popUp" max-width="480px" persistent :scrollable="false">
    <v-card style="padding: 40px">
      <v-row class="ma-0 pa-0">
        <v-icon @click="back">mdi-arrow-left</v-icon>
        <v-card-title class="headline">{{ i18n("两步验证") }}</v-card-title>
      </v-row>
      <v-card-text v-if="step == 1" class="pa-0">
        <div>
          {{ i18n("为确定是您本人操作, 请选择认证方式:") }}
        </div>
        <v-select
          :items="selections"
          item-text="text"
          item-value="val"
          :label="i18n('可用验证途径')"
          v-model="selected"
          style="margin-top: 18px; height: 40px"
          outlined
          dense
        >
        </v-select>

        <v-row class="ma-0 pa-0">
          <v-col class="ma-0 pa-0" align="end">
            <v-btn
              right
              color="#305BEF"
              class="pa-0 white--text"
              style="margin-top: 16px; width: 120px; height: 36px"
              @click="sendCode"
            >
              {{ verificationCodeBtnContent }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-if="step == 2" class="pa-0">
        <div>
          {{
            i18n("我们已向\(") +
            selectContact +
            i18n("\)发送一个6位数字的验证码, 请在下方输入:")
          }}
        </div>
        <v-text-field
          v-model="verificationCode"
          outlined
          class="pa-0"
          style="max-width: 400px; height: 40px; margin-top: 16px"
          dense
        ></v-text-field>

        <v-row
          class="pa-0"
          style="max-width: 400px; height: 40px; margin: 16px 0 0 0"
        >
          <v-row class="pa-0 mt-2 ml-0" style="width: 264px">
            <div>{{ i18n("没有收到?") }}</div>
            <div style="color: #305bef" @click="sendCode">
              {{ verificationCodeBtnContent }}
            </div>
          </v-row>

          <v-btn
            color="#305BEF"
            class="pa-0 white--text"
            style="width: 120px; height: 36px; margin-left: 16px"
            @click="verify"
          >
            {{ i18n("验证") }}
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "tfaVerification",

  props: {
    popUp: Boolean,
    email: String,
    phoneNumber: String,
  },
  data: function () {
    return {
      step: 1,
      selected: null,
      selectContact: "",

      emailChoice: 1,
      phoneNumberChoice: 2,

      // Verification code
      verificationCodeBtnContent: this.i18n("发送验证码"),
      verificationCodeCountDown: null,
      verificationCodeCountDownJob: 0,

      verificationCode: "",
    };
  },
  created: function () {
    console.log("component=====", this);
  },
  methods: {
    cancel: function () {
      clearInterval(this.verificationCodeCountDownJob);
      this.$emit("cancel");
    },
    pass: function () {
      clearInterval(this.verificationCodeCountDownJob);
      this.$emit("pass");
    },
    back: function () {
      if (this.step > 1) {
        this.step = this.step - 1;
        return;
      }
      this.cancel();
    },
    calculateVerificationCodeCountDown: function () {
      if (this.verificationCodeCountDown <= 0) {
        this.verificationCodeBtnContent = this.i18n("发送验证码");
        clearInterval(this.verificationCodeCountDownJob);
        return;
      }
      this.verificationCodeCountDown = this.verificationCodeCountDown - 1;
      this.verificationCodeBtnContent =
        this.verificationCodeCountDown.toString() + this.i18n("s后重新发送");
    },
    getSendSmsParams: function () {
      return {
        phone_number: this.phoneNumber,
      };
    },
    initCountDown: function (res) {
      this.verificationCodeCountDown = res.data["remain"];
      this.verificationCodeCountDownJob = setInterval(
        this.calculateVerificationCodeCountDown,
        1000
      );
      this.step = 2;
    },
    getSendEmailParams: function () {
      return {
        email: this.email,
      };
    },
    sendEmail: async function () {
      this.selectContact = this.email;
      let params = this.getSendEmailParams();

      try {
        const res = await req(
          "/api/signup/send-email-verification-code",
          params
        );
        this.initCountDown(res);
      } catch (err) {
        this.$store.commit("common/setSnackMsg", err.message);
      }
    },
    sendSms: async function () {
      this.selectContact = this.phoneNumber;
      let params = this.getSendSmsParams();
      try {
        const res = await req(
          "/api/signup/send-verification-code-stateless",
          params
        );

        this.initCountDown(res);
      } catch (err) {
        this.$store.commit("common/setSnackMsg", err.message);
      }
    },
    sendCode: function () {
      if (this.sendBtnDisabled == true) {
        this.$store.commit("common/setSnackMsg", err.message);
        return;
      }
      if (this.selected == this.emailChoice) {
        this.sendEmail();
      } else {
        this.sendSms();
      }
    },
    getVerifyParams: function () {
      let params = {
        verification_code: this.verificationCode,
      };
      if (this.selected == this.emailChoice) {
        Object.assign(params, {
          username: this.selectContact,
        });
      } else {
        Object.assign(params, {
          phone_number: this.selectContact,
        });
      }
      return params;
    },
    verify: async function () {
      let params = this.getVerifyParams();
      try {
        const res = await req("/api/verify-tfa-verification", params);
        let valid = res.data["valid"];
        if (valid == true) {
          this.pass();
        } else {
          this.$store.commit("common/setSnackMsg", err.message);
        }
      } catch (err) {
        this.$store.commit("common/setSnackMsg", err.message);
      }
    },
  },
  computed: {
    selections: function () {
      let result = [];
      if (this.email != "" && this.email != null) {
        result.push({
          text: this.email,
          val: this.emailChoice,
        });
      }
      if (this.phoneNumber != "" && this.phoneNumber != null) {
        result.push({
          text: this.phoneNumber,
          val: this.phoneNumberChoice,
        });
      }
      return result;
    },
    sendBtnDisabled: function () {
      return this.verificationCodeCountDown > 0;
    },
  },
};
</script>

<style scoped></style>
