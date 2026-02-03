<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  userName: string
  userInitials: string
  userRole: string
}

defineProps<Props>()
</script>

<template>
  <header class="mb-12 animate-fade-in">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1
          class="text-4xl font-black text-white tracking-tighter uppercase italic leading-none"
        >
          {{ title }}
        </h1>
        <div class="flex items-center gap-3 mt-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p
            class="text-slate-500 font-bold text-xs uppercase tracking-widest"
          >
            {{ subtitle }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center gap-4 bg-slate-900/50 p-2 pr-6 rounded-2xl border border-slate-800/80"
      >
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 font-bold text-lg"
        >
          {{ userInitials }}
        </div>
        <div>
          <p
            class="text-xs font-black text-white uppercase tracking-tighter italic"
          >
            {{ userName }}
          </p>
          <p
            class="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]"
          >
            {{ userRole }}
          </p>
        </div>
      </div>
    </div>
  </header>
</template>
