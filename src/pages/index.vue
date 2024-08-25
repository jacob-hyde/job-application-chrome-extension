<template>
  <div>
    <v-btn @click.prevent="beginFill">Begin Fill</v-btn>
    <v-btn>Stop Fill</v-btn>
  </div>
</template>

<script setup>
import { useProfilesStore } from "@/stores/profiles";
import { onMounted, ref } from "vue";
import FormFiller from "@/services/FormFiller";
const profilesStore = useProfilesStore();
const selectedProfile = ref({});
let formFiller;
onMounted(async () => {});

const beginFill = async () => {
  selectedProfile.value = profilesStore.getSelectedProfile;
  formFiller = new FormFiller(selectedProfile.value);
  console.log("Begin Fill");
  formFiller.beginFill();
};
</script>
