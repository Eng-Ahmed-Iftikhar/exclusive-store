<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@frontend/stores';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
    try {
        // Get the token from URL parameters (fallback for non-popup flow)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            console.error('No token received from Google OAuth');
            authStore.setErrorMessage('Google authentication failed. No token received.');
            router.push('/login');
            return;
        }

        // Handle the Google OAuth callback (fallback scenario)
        const success = await authStore.handleGoogleCallback(token);

        if (success) {
            // Redirect to the appropriate page
            authStore.handlePostAuthRedirect(router);
        } else {
            // Redirect to login page with error
            router.push('/login');
        }
    } catch (error) {
        console.error('Google callback error:', error);
        authStore.setErrorMessage('Google authentication failed. Please try again.');
        router.push('/login');
    }
});
</script>

<template>
    <div class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-progress-circular indeterminate color="primary" size="64" />
        <div class="ml-4">
            <h3>Completing Google authentication...</h3>
            <p class="text-grey">Please wait while we finish setting up your account.</p>
        </div>
    </div>
</template>
