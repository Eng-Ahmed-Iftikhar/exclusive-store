<template>
  <div class="terms-view">
    <v-container>
      <div class="page-header">
        <h1 class="page-title">Terms & Conditions</h1>
        <p class="last-updated">Last Updated: December 9, 2025</p>
      </div>

      <div class="content-wrapper">
        <InfoSection title="Agreement to Terms">
          <p>
            By accessing and using Exclusive, you agree to be bound by these Terms and Conditions. 
            If you disagree with any part of these terms, you may not access the service.
          </p>
        </InfoSection>

        <InfoSection title="Use of Service">
          <p>Our service allows you to:</p>
          <ul>
            <li>Browse and purchase products listed on our website</li>
            <li>Create and manage your account</li>
            <li>Save items to your wishlist</li>
            <li>Leave reviews and ratings for products</li>
          </ul>
          <p>
            You agree to use our service only for lawful purposes and in accordance with these Terms.
          </p>
        </InfoSection>

        <InfoSection title="Account Registration">
          <p>When you create an account with us, you must provide accurate and complete information. 
          You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account and password</li>
            <li>Restricting access to your computer or device</li>
            <li>All activities that occur under your account</li>
          </ul>
        </InfoSection>

        <InfoSection title="Product Information">
          <p>
            We strive to provide accurate product descriptions and pricing. However, we do not warrant 
            that product descriptions, pricing, or other content is accurate, complete, reliable, current, 
            or error-free. In the event of an error, we reserve the right to correct it and/or update 
            information as needed.
          </p>
        </InfoSection>

        <InfoSection title="Orders and Payment">
          <p>
            By placing an order, you make an offer to purchase a product. We reserve the right to accept 
            or decline your order for any reason. Payment must be received by us prior to our acceptance 
            of an order. We accept various payment methods as displayed on our checkout page.
          </p>
        </InfoSection>

        <InfoSection title="Shipping and Delivery">
          <p>
            Shipping times vary by location and product availability. We will provide estimated delivery 
            times at checkout. While we strive to meet these estimates, they are not guaranteed. Title 
            and risk of loss pass to you upon delivery to the carrier.
          </p>
        </InfoSection>

        <InfoSection title="Returns and Refunds">
          <p>
            We accept returns within 30 days of delivery. Items must be unused and in their original 
            packaging. Refunds will be processed within 5-10 business days of receiving your return. 
            Original shipping costs are non-refundable.
          </p>
        </InfoSection>

        <InfoSection title="Intellectual Property">
          <p>
            The service and its original content, features, and functionality are owned by Exclusive 
            and are protected by international copyright, trademark, patent, trade secret, and other 
            intellectual property laws.
          </p>
        </InfoSection>

        <InfoSection title="Limitation of Liability">
          <p>
            In no event shall Exclusive, its directors, employees, or agents be liable for any indirect, 
            incidental, special, consequential, or punitive damages arising out of or relating to your 
            use of the service.
          </p>
        </InfoSection>

        <InfoSection title="Changes to Terms">
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, 
            we will provide at least 30 days' notice prior to any new terms taking effect. Your continued 
            use of the service after such modifications constitutes acceptance of the updated Terms.
          </p>
        </InfoSection>

        <InfoSection title="Contact Information">
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> legal@exclusive.com<br>
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
.terms-view {
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
  .terms-view {
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
