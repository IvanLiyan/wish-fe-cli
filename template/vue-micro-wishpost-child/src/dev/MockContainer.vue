<template>
  <v-app>
    <!-- <userNavBar style="width:300px;" /> -->
    <v-navigation-drawer
      clipped
      fixed
      app
      width="300px"
      style="max-height: unset; padding-bottom: 81px"
    >
      <!-- <Login></Login> -->
      <v-list v-for="item in routes" :key="item.name" :name="item.name" flat>
        <v-list-item
          v-if="item.children == null || item.children.length == 0"
          :to="{ name: item.name }"
          :disabled="item.hint == true"
          :color="item.hint == true ? 'grey' : 'green'"
          >{{ item.name }}</v-list-item
        >
        <v-list-group
          v-model="gp"
          v-else
          :key="item.name"
          append-icon="keyboard_arrow_down"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(child, i) in item.children.filter((e) => e.hint != true)"
            :key="i"
            :to="{ name: child.name }"
          >
            <v-list-item-action>
              <v-icon></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ child.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- <userHeader /> -->
    <v-app-bar
      color="#337AB7"
      app
      fixed
      elevate-on-scroll
      height="81px"
      style="border-bottom: 3px solid #337ab7; left: 0px"
    >
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-snackbar v-model="show" :timeout="3000" top>
        {{ message }}
        <v-btn color="error" @click.native="show = false">Close</v-btn>
      </v-snackbar>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <v-footer app color="#f0f5f7" style="height: 27px"> footer </v-footer>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import routes from "@/routes";
import Login from "@/dev/Login";
import req from "@util/request";
export default {
  components: { Login },
  data() {
    return {
      show: false,
      message: "",
      mini: true,
      routes,
      gp: 1,
      userName: "",
    };
  },

  computed: {
    title() {
      return process.env.VUE_APP_NAME;
    },
  },

  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const { user } = await req("/api/get-user");
      if (!user) {
        this.$router.push(`login`);
      }
    },
  },
};
</script>

<style>
.user-footer {
  bottom: unset !important;
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
