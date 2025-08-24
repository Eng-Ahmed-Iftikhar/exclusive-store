<template>
  <div class="placeholder-image" :style="imageStyles">
    <div class="placeholder-content">
      <v-icon :icon="icon" size="32" color="#999" />
      <span class="placeholder-text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  icon?: string;
  text?: string;
  backgroundColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '200px',
  icon: 'mdi-image',
  text: 'Image',
  backgroundColor: '#f8f8f8'
});

const imageStyles = {
  width: props.width,
  height: props.height,
  backgroundColor: props.backgroundColor
};
</script>

<style scoped>
.placeholder-image {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 0px;
  overflow: hidden;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.placeholder-text {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}
</style>
