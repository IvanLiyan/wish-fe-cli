<template>
  <div class="welcome-bg-color" style="height: 100%">
    <v-container fluid class="welcome-bg-color">
      <v-card v-show="showNotification == false" class="mx-auto change-email">
        <v-card-title class="change-email-title">
          {{ this.i18n("请输入新邮箱") }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form v-model="changeEmailFormValid">
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
              <v-col class="pa-0" style="max-width: 400px">
                <v-text-field
                  v-model="email"
                  :label="this.i18n('邮箱')"
                  :rules="[
                    rules.required,
                    rules.email,
                    rules.notWorkEmail,
                    usernameUniquenessValidator,
                  ]"
                  :validate-on-blur="checkUsernameUniqueness"
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
              :disabled="changeEmailFormValid == false"
            >
              {{ i18n("下一步") }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <tfaVerification
        :popUp="popUp"
        :email="currentEmail"
        :phoneNumber="currentPhoneNumber"
        v-on:pass="edit"
        v-on:cancel="cancelEdit"
      >
      </tfaVerification>

      <onBoardingNotification
        :show="showNotification"
        title="修改成功"
        :waiting="true"
        :waitingTime="5"
        next="logout"
        v-on:logout="logout"
      >
      </onBoardingNotification>
    </v-container>
  </div>
</template>

<script>
import TfaVerification from "@component/TfaVerification";
import OnBoardingNotification from "@component/OnBoardingNotification";
import req from "@util/request";
import URL from "./url";

export default {
  name: "changeEmail",
  components: {
    TfaVerification,
    OnBoardingNotification,
  },
  data: () => ({
    rules: {},
    changeEmailFormValid: false,
    showNotification: false,
    popUp: true,

    currentEmail: "",
    currentPhoneNumber: "",

    email: "",
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
    usernameUniquenessValidator() {
      if (this.username_uniqueness == null) {
        return true;
      }
      return this.username_uniqueness;
    },
    initRules: function () {
      this.rules = {
        required: (value) => !!value || this.i18n("Required."),
        email: (value) => {
          let re =
            /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-011\013\014\016-\177])*")@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,10}\.?\s*$/i;
          return re.test(value) || this.i18n("Not a valid email address.");
        },
        notWorkEmail: (value) => {
          if (value == null) return false;
          return (
            (value.indexOf("@wish.com") <= 0 &&
              value.indexOf("@contextlogic.com") <= 0) ||
            this.i18n("Please use your own email address.")
          );
        },
      };
    },
    initVerificationCode: function () {
      this.verificationCodeBtnContent = this.i18n("发送验证码");
    },
    initAccountStatus: async function () {
      try {
        const data = await req(URL.getAccountStatus);
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
        email: this.email,
      };
    },
    sendVerificationCode: async function () {
      let params = this.getSendVerificationCodeParams();
      try {
        const data = await req(URL.sendEmailVerificationCode, params);
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
        username: this.email,
        verification_code: this.verificationCode,
      };
    },
    submit: async function () {
      let params = this.getSubmitParams();
      try {
        const data = await req(URL.changeUsername, params);
        let success = data["success"];
        if (success == true) {
          this.showNotification = true;
        } else {
          this.$store.commit("common/setSnackMsg", this.i18n("修改邮箱失败"));
        }
      } catch (err) {
        this.$store.commit("common/setSnackMsg", err.message);
      }
    },
  },
  computed: {
    checkUsernameUniqueness: function () {
      req(URL.checkUsernameUniqueness, this.username)
        .then((data) => {
          this.username_uniqueness =
            !data.email || this.i18n("This email is already in use");
        })
        .catch((err) => {
          this.$store.commit("common/setSnackMsg", err.message);
        });
      return true;
    },
    verificationCodeBtnDisabled: function () {
      if (this.email == "" || this.email == null) {
        return true;
      }
      return this.verificationCodeCountDown > 0;
    },
  },
  created: function () {
    this.initAccountStatus();
    this.initRules();
    this.initVerificationCode();
  },
};
</script>

<style scoped>
.change-email {
  width: 480px;
  margin-top: 48px;
  padding-bottom: 40px;
}

.change-email-title {
  padding-left: 40px;
  padding-top: 40px;
  padding-bottom: 0px;
  font-size: 28px;
}
</style>
