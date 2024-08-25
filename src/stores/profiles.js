import { defineStore } from "pinia";

const chromeExtension =
  typeof chrome !== "undefined" && typeof chrome.storage !== "undefined";

export const useProfilesStore = defineStore("profiles", {
  state: () => ({
    profiles: {},
    selectedProfileId: null,
  }),
  actions: {
    async createProfile(profile) {
      profile.id = Object.keys(this.profiles).length + 1;
      this.profiles[profile.id] = {
        id: profile.id,
        default: false,
        autofill: {
          ...profile,
          name: `${profile.first_name} ${profile.last_name}`,
        },
      };
      if (chromeExtension) {
        await chrome.storage.sync.set({ profiles: this.profiles });
      }
    },
    async updateProfile(profile) {
      this.profiles[profile.id] = profile;
      if (chromeExtension) {
        await chrome.storage.sync.set({ profiles: this.profiles });
      }
    },
    async removeProfileById(profileId) {
      delete this.profiles[profileId];
      if (chromeExtension) {
        await chrome.storage.sync.set({ profiles: this.profiles });
      }
    },
    setSelectedProfileById(profileId) {
      this.selectedProfileId = profileId;
    },
    setSelectedProfileId(profileId) {
      this.selectedProfileId = profileId;
    },
  },
  getters: {
    getProfiles() {
      return this.profiles;
    },
    getSelectedProfile() {
      if (!this.selectedProfileId) {
        this.selectedProfileId = Object.values(this.profiles).filter(
          (profile) => profile.default
        )?.id;
        // this.selectedProfileId =
        //   Object.values(this.profiles).filter((profile) => profile.default)
        //     ?.id || Object.values(this.profiles)[0].id;
      }

      return this.profiles[this.selectedProfileId];
    },
  },
  persist: {
    afterRestore: async (context) => {
      if (chromeExtension) {
        const { profiles } = await chrome.storage.sync.get("profiles");
        context.store.profiles = profiles;
      }
    },
  },
});
