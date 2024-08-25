<template>
  <v-dialog max-width="500" height="100%" v-model="isOpen">
    <v-card>
      <v-card-title>Confirmation</v-card-title>
      <v-card-text
        >Are you sure you want to delete the profile:
        {{ props.profile.name }}?</v-card-text
      >
      <v-card-actions>
        <v-btn @click="$emit('close')">Cancel</v-btn>
        <v-btn @click="deleteProfile">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useModal } from "@/composables/useModal";
import { useProfilesStore } from "@/stores/profiles";
const props = defineProps({
  profile: Object,
});
const isOpen = ref(true);
const profilesStore = useProfilesStore();

const deleteProfile = async () => {
  await profilesStore.removeProfileById(props.profile.id);
  useModal().hideModal();
};
</script>
