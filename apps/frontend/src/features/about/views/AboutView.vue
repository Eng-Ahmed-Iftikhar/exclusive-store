<template>
  <div class="about-page">
    <HeroSection
      title="About Exclusive"
      subtitle="Your premier destination for exclusive electronics and premium audio experiences"
      button-text="Watch Our Story"
      button-icon="mdi-play"
      @button-click="handleWatchStory"
    />

    <MissionSection
      title="Our Mission"
      description="To provide our customers with the highest quality electronics and audio equipment, backed by exceptional service and innovative solutions that enhance their daily lives."
      :stats="missionStats"
    />

    <StorySection
      title="Our Story"
      :paragraphs="storyParagraphs"
      :image-src="PLACEHOLDER_IMAGE"
      image-alt="Our Story"
    />

    <ValuesSection
      title="Our Values"
      subtitle="The principles that guide everything we do"
      :values="values"
    />

    <!-- <TeamSection :team="team" /> -->

    <CTASection
      title="Ready to Experience the Difference?"
      subtitle="Join thousands of satisfied customers who trust Exclusive for their electronics needs"
      :buttons="ctaButtons"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import MissionSection from '../components/MissionSection.vue';
import StorySection from '../components/StorySection.vue';
import ValuesSection from '../components/ValuesSection.vue';
import CTASection from '../components/CTASection.vue';


const PLACEHOLDER_IMAGE = import.meta.env.VITE_APP_PRODUCT_PLACEHOLDER_IMAGE;

const missionStats = ref([
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '5+', label: 'Years Experience' },
]);

const storyParagraphs = ref([
  'Founded in 2019, Exclusive began as a small passion project by audio enthusiasts who believed everyone deserves access to premium sound quality.',
  'What started as a local audio shop has grown into a comprehensive electronics retailer, serving customers nationwide with the latest technology and timeless classics.',
  'Today, we continue to innovate and expand our product range while maintaining the personal touch and expert knowledge that our customers have come to trust.',
]);

const values = ref([
  {
    icon: 'mdi-heart',
    title: 'Passion',
    description:
      'We love what we do and it shows in every product we offer and every customer we serve.',
  },
  {
    icon: 'mdi-shield-check',
    title: 'Quality',
    description:
      'We never compromise on quality, ensuring every product meets our high standards.',
  },
  {
    icon: 'mdi-handshake',
    title: 'Trust',
    description:
      'Building lasting relationships with our customers through honesty and reliability.',
  },
  {
    icon: 'mdi-lightbulb',
    title: 'Innovation',
    description:
      'Always staying ahead with the latest technology and creative solutions.',
  },
]);

const ctaButtons = ref([
  {
    text: 'Shop Now',
    to: '/products',
    color: 'primary',
    variant: 'flat' as const,
    icon: 'mdi-shopping',
  },
  {
    text: 'Contact Us',
    to: '/contact',
    color: 'white',
    variant: 'outlined' as const,
    icon: 'mdi-email',
  },
]);

const handleWatchStory = () => {
  // Handle watch story button click
  // You can implement video player or modal here
};
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}
</style>
