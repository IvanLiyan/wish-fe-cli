<template>
  <div class="welcome-bg-color" style="height: 100%">
    <v-container fluid class="welcome-bg-color">
      <v-card v-show="showNotification == false" class="mx-auto change-phone">
        <v-card-title class="change-password-title">
          {{ this.i18n("请输入新手机") }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form v-model="changePhoneFormValid">
            <v-row
              class="pa-0"
              style="
                max-width: 400px;
                height: 40px;
                margin-left: 40px;
                margin-top: 29px;
                margin-bottom: 0px;
              "
            >
              <v-col class="pa-0" style="max-width: 120px">
                <v-select
                  v-model="phoneNumberDistrict"
                  :items="phoneDistrictList"
                  item-text="text"
                  item-value="val"
                  dense
                  outlined
                  class="pa-0"
                ></v-select>
              </v-col>
              <v-col class="pa-0" style="max-width: 272px; margin-left: 8px">
                <v-text-field
                  v-model="phoneNumber"
                  :label="this.i18n('手机号')"
                  :rules="[rules.required, cellPhoneNumberValidator]"
                  dense
                  outlined
                  clearable
                  class="pa-0"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row
              class="pa-0"
              style="
                max-width: 400px;
                height: 40px;
                margin-left: 40px;
                margin-top: 26px;
                margin-bottom: 0px;
              "
            >
              <v-col class="pa-0" style="max-width: 120px">
                <v-btn
                  color="#305BEF"
                  outlined
                  @click="sendVerificationCode"
                  style="width: 120px; height: 40px"
                  :disabled="verificationCodeBtnDisabled"
                >
                  {{ verificationCodeBtnContent }}
                </v-btn>
              </v-col>
              <v-col class="pa-0" style="max-width: 272px; margin-left: 8px">
                <v-text-field
                  v-model="verificationCode"
                  :label="this.i18n('验证码')"
                  :rules="[rules.required]"
                  dense
                  outlined
                  clearable
                  class="pa-0"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              color="#305BEF"
              class="pa-0 white--text"
              style="
                width: 400px;
                height: 36px;
                margin-top: 16px;
                margin-left: 40px;
              "
              @click="submit"
              :disabled="changePhoneFormValid == false"
            >
              {{ this.i18n("下一步") }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <tfa-verification
        :popUp="popUp"
        :email="currentEmail"
        :phoneNumber="currentPhoneNumber"
        v-on:pass="edit"
        v-on:cancel="cancelEdit"
      >
      </tfa-verification>

      <on-boarding-notification
        :show="showNotification"
        title="修改成功"
        :waiting="true"
        :waitingTime="5"
        next="logout"
        v-on:logout="logout"
      >
      </on-boarding-notification>
    </v-container>
  </div>
</template>

<script>
import TfaVerification from "@component/TfaVerification";
import OnBoardingNotification from "@component/OnBoardingNotification";
import req from "@util/request";
import URL from "./url";

export default {
  name: "changePhoneNumber",

  components: {
    TfaVerification,
    OnBoardingNotification,
  },
  data: () => ({
    // Page variables
    rules: {},
    phoneNumberDistrict: "+86",
    phoneDistrictList: [
      {
        text: "中国(+86)",
        val: "+86",
      },
      {
        text: "美国(+1)",
        val: "+1",
      },
    ],

    username: null,

    changePhoneFormValid: false,
    showNotification: false,
    popUp: true,

    currentEmail: "",
    currentPhoneNumber: "",

    phoneNumber: "",
    verificationCode: "",

    // Verification code
    verificationCodeBtnContent: "",
    verificationCodeCountDown: null,
    verificationCodeCountDownJob: 0,
  }),
  methods: {
    edit: function () {
      this.popUp = false;
    },
    cancelEdit: function () {
      window.location.href = "/";
    },
    logout: function () {
      window.location.href = "/logout";
    },
    initRules: function () {
      this.rules = {
        required: (value) => !!value || this.i18n("Required."),
      };
    },
    initVerificationCode: function () {
      this.verificationCodeBtnContent = this.i18n("发送验证码");
    },
    getInitAccountStatusParams: function () {
      return {
        username: this.username,
      };
    },
    initAccountStatus: async function () {
      this.username = this.$route.query.username;
      let params = this.getInitAccountStatusParams();
      try {
        const data = await req(URL.getAccountStatus, params);
        this.currentEmail = data["valid_email"];
        this.currentPhoneNumber = data["phone_number"];
      } catch (err) {
        this.$store.commit("common/setSnackMsg", err.message);
      }
    },
    calculateVerificationCodeCountDown: function () {
      if (this.verificationCodeCountDown <= 0) {
        this.verificationCodeBtnContent = this.i18n("发送验证码");
        clearInterval(this.verificationCodeCountDownJob);
        return;
      }
      this.verificationCodeCountDown = this.verificationCodeCountDown - 1;
      this.verificationCodeBtnContent =
        this.verificationCodeCountDown.toString() + this.i18n("后重发");
    },
    getSendVerificationCodeParams: function () {
      return {
        phone_number: this.phoneNumberDistrict + this.phoneNumber,
      };
    },
    sendVerificationCode: async function () {
      let params = this.getSendVerificationCodeParams();

      try {
        const data = await req(URL.sendVerificationCodeStateless, params);

        this.verificationCodeCountDown = data["remain"];
        this.verificationCodeCountDownJob = setInterval(
          this.calculateVerificationCodeCountDown,
          1000
        );
      } catch (err) {
        this.$store.commit("common/setSnackMsg", err.message);
      }
    },
    getSubmitParams: function () {
      return {
        username: this.username,
        phone_number: this.phoneNumber,
        verification_code: this.verificationCode,
      };
    },
    submit: async function () {
      let params = this.getSubmitParams();
      try {
        const data = await req(URL.changePhoneNumber, params);
        let success = data["success"];
        if (success == true) {
          this.showNotification = true;
        } else {
          this.$store.commit("common/setSnackMsg", err.message);
        }
      } catch (err) {
        this.$store.commit("common/setSnackMsg", err.message);
      }
    },
  },
  computed: {
    cellPhoneNumberValidator() {
      if (this.phoneNumber == null) return false;
      this.phoneNumber = this.phoneNumber.replace(/[ ,-]/g, "");
      let isInt = /^[0-9]*$/;
      if (!isInt.test(this.phoneNumber)) {
        return this.i18n("Not a valid cell phone number");
      }
      if (this.phoneNumberDistrict == "+86" && this.phoneNumber.length == 11) {
        return true;
      }
      if (this.phoneNumberDistrict == "+1" && this.phoneNumber.length == 10) {
        return true;
      }
      return this.i18n("Not a valid cell phone number");
    },
    verificationCodeBtnDisabled: function () {
      if (this.phoneNumber == "" || this.phoneNumber == null) {
        return true;
      }
      return this.verificationCodeCountDown > 0;
    },
  },
  created: function () {
    console.log("======index", this);
    this.initAccountStatus();
    this.initRules();
    this.initVerificationCode();
  },
};
</script>

<style scoped>
.change-phone {
  width: 480px;
  margin-top: 48px;
  padding-bottom: 40px;
}

.change-phone-title {
  padding-left: 40px;
  padding-top: 40px;
  padding-bottom: 0px;
  font-size: 28px;
}
</style>
