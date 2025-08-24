<template>
  <div class="contact-page">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <div class="contact-header text-center mb-8">
            <h1 class="text-h3 font-weight-bold mb-4">Contact Us</h1>
            <p class="text-body-1 text-medium-emphasis">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <v-card class="contact-form-card pa-6">
            <v-form @submit.prevent="submitForm" v-model="isFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.firstName"
                    label="First Name"
                    :rules="[rules.required]"
                    variant="outlined"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.lastName"
                    label="Last Name"
                    :rules="[rules.required]"
                    variant="outlined"
                    required
                  />
                </v-col>
              </v-row>

              <v-text-field
                v-model="formData.email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                required
              />

              <v-text-field
                v-model="formData.phone"
                label="Phone Number"
                variant="outlined"
              />

              <v-select
                v-model="formData.subject"
                label="Subject"
                :items="subjectOptions"
                :rules="[rules.required]"
                variant="outlined"
                required
              />

              <v-textarea
                v-model="formData.message"
                label="Message"
                :rules="[rules.required, rules.minLength]"
                variant="outlined"
                rows="5"
                required
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
                Send Message
              </v-btn>
            </v-form>
          </v-card>

          <div class="contact-info mt-8">
            <v-row>
              <v-col cols="12" md="4" class="text-center">
                <v-icon icon="mdi-map-marker" size="48" color="primary" class="mb-3" />
                <h3 class="text-h6 mb-2">Address</h3>
                <p class="text-body-2">
                  123 Music Street<br>
                  Melody City, MC 12345<br>
                  United States
                </p>
              </v-col>
              <v-col cols="12" md="4" class="text-center">
                <v-icon icon="mdi-phone" size="48" color="primary" class="mb-3" />
                <h3 class="text-h6 mb-2">Phone</h3>
                <p class="text-body-2">
                  +1 (555) 123-4567<br>
                  Mon-Fri 9AM-6PM
                </p>
              </v-col>
              <v-col cols="12" md="4" class="text-center">
                <v-icon icon="mdi-email" size="48" color="primary" class="mb-3" />
                <h3 class="text-h6 mb-2">Email</h3>
                <p class="text-body-2">
                  support@exclusive.com<br>
                  sales@exclusive.com
                </p>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
const isFormValid = ref(false);

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
});

const subjectOptions = [
  'General Inquiry',
  'Product Support',
  'Order Status',
  'Returns & Refunds',
  'Partnership',
  'Other'
];

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Please enter a valid email',
  minLength: (v: string) => v.length >= 10 || 'Message must be at least 10 characters'
};

const submitForm = async () => {
  loading.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    formData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
    
    // Show success message (you can use your notification system here)
    console.log('Form submitted successfully');
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.contact-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.contact-form-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.contact-info {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
</style>
