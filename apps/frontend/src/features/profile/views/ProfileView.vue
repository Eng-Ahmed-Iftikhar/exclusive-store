<template>
  <div class="profile-page">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="profile-card pa-6">
            <div class="text-center mb-6">
              <v-avatar size="120" color="primary" class="mb-4">
                <v-icon size="60" color="white">mdi-account</v-icon>
              </v-avatar>
              <h1 class="text-h4 font-weight-bold">User Profile</h1>
            </div>

            <v-form @submit.prevent="updateProfile" v-model="isFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileData.firstName"
                    label="First Name"
                    variant="outlined"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileData.lastName"
                    label="Last Name"
                    variant="outlined"
                    required
                  />
                </v-col>
              </v-row>

              <v-text-field
                v-model="profileData.email"
                label="Email"
                type="email"
                variant="outlined"
                required
              />

              <v-text-field
                v-model="profileData.phone"
                label="Phone Number"
                variant="outlined"
              />

              <v-textarea
                v-model="profileData.bio"
                label="Bio"
                variant="outlined"
                rows="3"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!isFormValid"
                class="mt-4"
              >
                Update Profile
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
const isFormValid = ref(false);

const profileData = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  bio: 'Audio enthusiast and tech lover.'
});

const updateProfile = async () => {
  loading.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.profile-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.profile-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>
