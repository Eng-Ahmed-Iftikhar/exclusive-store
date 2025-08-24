<template>
  <v-card class="team-member-card text-center pa-6 h-100" variant="outlined">
    <v-avatar size="120" class="mb-4">
      <v-img :src="member.image" :alt="member.name" cover />
    </v-avatar>
    <h3 class="text-h6 font-weight-semibold mb-2">{{ member.name }}</h3>
    <p class="text-body-2 text-primary mb-3">{{ member.position }}</p>
    <p class="text-body-2 text-medium-emphasis">{{ member.bio }}</p>
  </v-card>
</template>

<script setup lang="ts">
interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
}

interface TeamMemberProps {
  member: TeamMember;
}

defineProps<TeamMemberProps>();
</script>

<style scoped>
.team-member-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e0e0e0;
}

.team-member-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>
