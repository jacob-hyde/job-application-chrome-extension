<template>
  <v-card :rounded="0">
    <v-card-title>Create Profile</v-card-title>
    <v-card-subtitle>Manage profile autofill values</v-card-subtitle>
    <v-card-text>
      <AutofillForm />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useProfilesStore } from "@/stores/profiles";

const profilesStore = useProfilesStore();
</script>
