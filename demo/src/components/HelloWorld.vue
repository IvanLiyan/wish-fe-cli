<template>
  <div class="hello">
    <wt-button @click="getData">req data</wt-button>
    <h1>{{ msg }}</h1>
  </div>
</template>
<script>
import req from '@utils/request';
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  async mounted() {},
  methods: {
    getData: async function () {
      // 接口调用示例
      const params = { mobile: '13333333333' };
      try {
        const { data } = await req('/user/send-code', params);
        console.log('res data', data);
      } catch (err) {
        this.$wt.notify({
          type: 'error',
          message: err.message,
        });
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  font-size: 16px;
}
</style>
