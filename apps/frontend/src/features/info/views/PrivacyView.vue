<template>
  <div class="privacy-view">
    <v-container>
      <div class="page-header">
        <h1 class="page-title">Privacy Policy</h1>
        <p class="last-updated">Last Updated: December 9, 2025</p>
      </div>

      <div class="content-wrapper">
        <InfoSection title="Introduction">
          <p>
            Welcome to Exclusive. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our 
            website and tell you about your privacy rights and how the law protects you.
          </p>
        </InfoSection>

        <InfoSection title="Information We Collect">
          <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
          <ul>
            <li><strong>Identity Data:</strong> First name, last name, username or similar identifier</li>
            <li><strong>Contact Data:</strong> Email address, telephone numbers, billing and delivery addresses</li>
            <li><strong>Transaction Data:</strong> Details about payments and products you have purchased from us</li>
            <li><strong>Technical Data:</strong> IP address, browser type, time zone, and device information</li>
            <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
          </ul>
        </InfoSection>

        <InfoSection title="How We Use Your Information">
          <p>We use your personal data for the following purposes:</p>
          <ul>
            <li>To process and deliver your orders</li>
            <li>To manage your account and provide customer support</li>
            <li>To send you marketing communications (with your consent)</li>
            <li>To improve our website, products, and services</li>
            <li>To protect against fraudulent or illegal activity</li>
          </ul>
        </InfoSection>

        <InfoSection title="Data Security">
          <p>
            We have implemented appropriate security measures to prevent your personal data from being 
            accidentally lost, used, accessed in an unauthorized way, altered, or disclosed. We limit access 
            to your personal data to those employees, agents, contractors, and other third parties who have a 
            business need to know.
          </p>
        </InfoSection>

        <InfoSection title="Your Rights">
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
          <ul>
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>Right to withdraw consent</li>
          </ul>
        </InfoSection>

        <InfoSection title="Cookies">
          <p>
            Our website uses cookies to distinguish you from other users. This helps us provide you with a 
            good experience when you browse our website and allows us to improve our site. You can set your 
            browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
          </p>
        </InfoSection>

        <InfoSection title="Contact Us">
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@exclusive.com<br>
            <strong>Phone:</strong> +1 (555) 123-4567<br>
            <strong>Address:</strong> 123 E-commerce Street, Digital City, DC 12345
          </p>
        </InfoSection>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import InfoSection from '../components/InfoSection.vue';
</script>

<style scoped>
.privacy-view {
  min-height: calc(100vh - 200px);
  padding: 40px 0 80px;
  background: #f8f9fa;
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.last-updated {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 48px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .privacy-view {
    padding: 20px 0 40px;
  }

  .page-title {
    font-size: 28px;
  }

  .content-wrapper {
    padding: 24px;
  }
}
</style>
