<template>
  <div class="home-page">
    <hello-world msg="This is an about page" />
  </div>
</template>
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
