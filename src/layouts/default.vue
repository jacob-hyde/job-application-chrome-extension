<template>
  <v-container class="pa-0">
    <v-app-bar absolute flat>
      <v-app-bar-title class="text-center"
        >Application Autofill</v-app-bar-title
      >
      <template v-slot:append>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" location="right" absolute>
      <v-list>
        <v-list-item
          v-for="(child, i) in items"
          :key="i"
          :to="child.link"
          link
          @click="drawer = false"
          class="d-flex"
        >
          <v-list-item :prepend-icon="child.icon">{{
            child.title
          }}</v-list-item>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <router-view />
  </v-container>
</template>

<script setup>
import { ref } from "vue";
const drawer = ref(false);
const items = [
  { title: "Dashboard", icon: "mdi-view-dashboard", link: "/" },
  { title: "Profiles", icon: "mdi-account-group", link: "/profiles" },
  // { title: "Projects", icon: "mdi-folder-multiple" },
  // { title: "Calendar", icon: "mdi-calendar" },
];
</script>
