<script setup lang="ts">
import AppSidebar from '~/components/AppSidebar.vue'
import BackgroundDecor from '~/components/BackgroundDecor.vue'
</script>

<template>
  <div class="min-h-screen selection:bg-blue-500/30 overflow-x-hidden">
    <AppSidebar />

    <main class="lg:pl-24 relative z-10">
      <div class="p-6 md:p-10 max-w-[1500px] mx-auto min-h-screen">
        <RouterView />
      </div>
    </main>

    <BackgroundDecor />
  </div>
</template>
