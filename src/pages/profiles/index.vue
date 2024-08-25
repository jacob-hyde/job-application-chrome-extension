<template>
  <div>
    <v-card :rounded="0">
      <v-card-title>
        Profiles
        <v-btn icon="mdi-plus" to="/profiles/create" />
      </v-card-title>
      <v-card-subtitle>Manage your autofill profiles</v-card-subtitle>
      <v-card-text>
        <v-list v-for="profile in profiles" :key="profile.id">
          <v-list-item class="d-flex">
            <div>
              <v-list-item-title
                >{{ profile.autofill.first_name }}
                {{ profile.autofill.last_name }}</v-list-item-title
              >
              <v-list-item-subtitle>{{
                profile.autofill.email
              }}</v-list-item-subtitle>
            </div>

            <v-list-item-action>
              <v-btn
                icon
                :to="{ name: `/profiles/[id]`, params: { id: profile.id } }"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteProfile(profile)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <Teleport to="#modal">
      <component
        :is="modal.component.value"
        v-if="modal.show.value"
        @close="modal.hideModal"
        v-bind="modalProps"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { useModal } from "@/composables/useModal";
import ConfirmationModal from "@/components/Modals/ConfirmationModal.vue";
import { useProfilesStore } from "@/stores/profiles";
import { onMounted, ref, markRaw } from "vue";
const profilesStore = useProfilesStore();
const profiles = ref({});
onMounted(async () => {
  profiles.value = profilesStore.getProfiles;
});

const modal = useModal();
const modalProps = ref({});
function deleteProfile(profile) {
  modalProps.value = { profile };
  modal.component.value = markRaw(ConfirmationModal);
  modal.showModal();
}
</script>
