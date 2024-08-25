<template>
  <v-form v-model="valid" @submit.prevent="save">
    <v-container class="pa-0">
      <v-row>
        <v-col cols="12">
          <v-file-input
            v-model="form.resume_file"
            label="Resume (Doc or PDF)"
            accept=".doc,.docx,.pdf"
          ></v-file-input>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="form.first_name"
            :rules="[() => !!form.first_name || 'First Name is required']"
            label="First Name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="9">
          <v-text-field
            v-model="form.middle_name"
            label="Middle Name"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            dense
            v-model="form.middle_initial"
            label="Initial"
            maxlength="1"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="form.last_name"
            :rules="[() => !!form.last_name || 'Last Name is required']"
            label="Last Name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn :disabled="!valid" type="submit" color="primary" dark
            >Submit</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useProfilesStore } from "@/stores/profiles";
const { autofill } = defineProps({
  autofill: {
    type: Object,
    required: false,
  },
});
const valid = ref(true);
const form = reactive({
  id: autofill?.id || null,
  resume_name: autofill?.resume_name || "",
  resume_file: autofill?.resume_file || null,
  first_name: autofill?.first_name || "",
  middle_name: autofill?.middle_name || "",
  middle_initial: autofill?.middle_initial || "",
  last_name: autofill?.last_name || "",
});

watch(
  () => form.resume_file,
  (value) => {
    form.resume_name = value?.name;
  }
);

const profilesStore = useProfilesStore();

async function save() {
  if (autofill) {
    await profilesStore.updateProfile(autofill.id, form);
    return;
  }
  await profilesStore.createProfile(form);
}
</script>

<style scoped>
.v-row {
  margin-top: 0;
}
.v-col {
  padding-top: 4px;
}
</style>
