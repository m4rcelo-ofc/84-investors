<script setup lang="ts">
import { Wallet, TrendingUp, Calendar, Clock, ArrowUpRight } from 'lucide-vue-next'

interface Props {
  type: 'investment' | 'rentability' | 'contract' | 'payment'
  value: string
  label: string
  subtext: string
  trend?: {
    value: string
    isPositive: boolean
  }
  meta?: string
}

defineProps<Props>()

const iconComponents = {
  investment: Wallet,
  rentability: TrendingUp,
  contract: Calendar,
  payment: Clock,
}
</script>

<template>
  <div
    class="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300"
  >
    <component
      :is="iconComponents[type]"
      class="absolute -top-2 -right-2 w-16 h-16 text-blue-500 opacity-5 group-hover:opacity-10 transition-opacity rotate-12"
    />
    <p
      class="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2"
    >
      {{ label }}
    </p>
    <h2 class="text-2xl font-bold text-white mb-1 tracking-tight">
      {{ value }}
    </h2>
    <div v-if="trend" class="flex items-center gap-2">
      <span
        class="text-xs font-bold flex items-center"
        :class="trend.isPositive ? 'text-blue-400' : 'text-rose-400'"
      >
        <ArrowUpRight class="w-3 h-3 mr-1" />
        {{ trend.value }}
      </span>
      <span v-if="meta" class="text-slate-500 text-xs font-medium">
        {{ meta }}
      </span>
    </div>
    <span v-else class="text-slate-500 text-xs font-medium">
      {{ subtext }}
    </span>
  </div>
</template>
