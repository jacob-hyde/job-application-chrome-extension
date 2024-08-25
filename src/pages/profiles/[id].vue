<template>
  <v-card :rounded="0">
    <v-card-title
      >Profile: {{ profile.autofill?.first_name }}
      {{ profile.autofill?.last_name }}</v-card-title
    >
    <v-card-subtitle>Manage profile autofill values</v-card-subtitle>
    <v-card-text>
      <AutofillForm v-if="profile.autofill" :autofill="profile.autofill" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useProfilesStore } from "@/stores/profiles";
definePage({
  props: true,
});
const props = defineProps({
  id: String,
});

const profilesStore = useProfilesStore();

const profile = ref({});
onMounted(() => {
  profilesStore.setSelectedProfileById(parseInt(props.id));
  profile.value = profilesStore.getSelectedProfile;
});
</script>
