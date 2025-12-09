<template>
  <div class="faq-view">
    <v-container>
      <div class="page-header">
        <h1 class="page-title">Frequently Asked Questions</h1>
        <p class="page-subtitle">Find answers to common questions about our services</p>
      </div>

      <div class="content-wrapper">
        <div class="faq-category">
          <h3 class="category-title">Orders & Shopping</h3>
          <FAQItem question="How do I place an order?">
            <p>
              Simply browse our products, add items to your cart, and proceed to checkout. 
              You'll need to create an account or log in to complete your purchase. Follow 
              the checkout steps to enter your shipping information and payment details.
            </p>
          </FAQItem>

          <FAQItem question="Can I modify or cancel my order?">
            <p>
              You can modify or cancel your order within 1 hour of placement by contacting 
              our customer service. Once your order is processed or shipped, modifications 
              may not be possible. Please contact us immediately if you need to make changes.
            </p>
          </FAQItem>

          <FAQItem question="What payment methods do you accept?">
            <p>
              We accept major credit cards (Visa, MasterCard, American Express), debit cards, 
              PayPal, and other payment methods displayed at checkout. All transactions are 
              secure and encrypted.
            </p>
          </FAQItem>
        </div>

        <div class="faq-category">
          <h3 class="category-title">Shipping & Delivery</h3>
          <FAQItem question="How long will my order take to arrive?">
            <p>
              Standard shipping typically takes 5-7 business days. Express shipping is available 
              for 2-3 business days delivery. Shipping times may vary based on your location and 
              product availability. You'll receive tracking information once your order ships.
            </p>
          </FAQItem>

          <FAQItem question="Do you offer free shipping?">
            <p>
              Yes! We offer free standard shipping on orders over $100. For orders under $100, 
              a flat shipping fee of $10 applies. Express shipping is available at an additional cost.
            </p>
          </FAQItem>

          <FAQItem question="How can I track my order?">
            <p>
              Once your order ships, you'll receive a tracking number via email. You can also 
              track your order by logging into your account and viewing your order history. 
              Click on the specific order to see detailed tracking information.
            </p>
          </FAQItem>
        </div>

        <div class="faq-category">
          <h3 class="category-title">Returns & Refunds</h3>
          <FAQItem question="What is your return policy?">
            <p>
              We accept returns within 30 days of delivery. Items must be unused, unworn, and 
              in their original packaging with all tags attached. Some items like final sale 
              products, personalized items, and intimate apparel are not eligible for return.
            </p>
          </FAQItem>

          <FAQItem question="How do I return an item?">
            <p>
              Log into your account, go to Order History, select the order, and click "Return Item". 
              Follow the instructions to print your return label. Pack the item securely and drop 
              it off at any authorized shipping location. You'll receive a refund once we process 
              your return.
            </p>
          </FAQItem>

          <FAQItem question="When will I receive my refund?">
            <p>
              Refunds are processed within 5-10 business days after we receive your return. 
              The refund will be issued to your original payment method. Please allow additional 
              time for your bank or card issuer to post the refund to your account.
            </p>
          </FAQItem>
        </div>

        <div class="faq-category">
          <h3 class="category-title">Account & Privacy</h3>
          <FAQItem question="How do I create an account?">
            <p>
              Click the "Sign Up" button in the top right corner. Enter your email address, 
              create a password, and fill in your basic information. You can also sign up using 
              your Google account for faster registration.
            </p>
          </FAQItem>

          <FAQItem question="Is my information secure?">
            <p>
              Yes, we take your privacy and security seriously. All personal and payment information 
              is encrypted using industry-standard SSL technology. We never share your personal 
              information with third parties without your consent. Read our Privacy Policy for more details.
            </p>
          </FAQItem>

          <FAQItem question="How do I reset my password?">
            <p>
              Click "Forgot Password" on the login page. Enter your email address and we'll send 
              you a password reset link. Follow the instructions in the email to create a new password. 
              If you don't receive the email, check your spam folder.
            </p>
          </FAQItem>
        </div>

        <div class="faq-category">
          <h3 class="category-title">Products & Stock</h3>
          <FAQItem question="How do I know if a product is in stock?">
            <p>
              Product availability is shown on each product page. If an item is out of stock, 
              you'll see an "Out of Stock" label. You can sign up for back-in-stock notifications 
              to be alerted when the product becomes available again.
            </p>
          </FAQItem>

          <FAQItem question="Do you restock sold-out items?">
            <p>
              We regularly restock popular items, but availability depends on our suppliers. 
              Sign up for restock notifications on the product page to be notified when items 
              are back in stock. Some limited edition items may not be restocked.
            </p>
          </FAQItem>
        </div>

        <div class="contact-section">
          <h3>Still have questions?</h3>
          <p>
            Can't find what you're looking for? Our customer support team is here to help!
          </p>
          <v-btn color="error" size="large" variant="flat" to="/contact">
            <v-icon icon="mdi-email" start />
            Contact Support
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import FAQItem from '../components/FAQItem.vue';
</script>

<style scoped>
.faq-view {
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

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.faq-category {
  margin-bottom: 40px;
}

.category-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #DB4444;
}

.contact-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-top: 60px;
}

.contact-section h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.contact-section p {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px 0;
}

@media (max-width: 768px) {
  .faq-view {
    padding: 20px 0 40px;
  }

  .page-title {
    font-size: 28px;
  }

  .contact-section {
    padding: 24px;
  }
}
</style>
