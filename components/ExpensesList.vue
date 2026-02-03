<script setup lang="ts">
import { Receipt, ArrowDownRight } from 'lucide-vue-next'
import type { Expense } from '~/types'

interface Props {
  expenses: Expense[]
}

const props = defineProps<Props>()

const { formatCurrency } = useMotoData()
</script>

<template>
  <div class="glass-panel rounded-2xl p-5 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <h3
        class="text-slate-400 font-semibold text-sm flex items-center gap-2 tracking-wide uppercase"
      >
        <Receipt class="text-emerald-500 w-4 h-4" />
        Despesas Recentes
      </h3>
    </div>
    <div class="space-y-4">
      <div
        v-for="expense in props.expenses"
        :key="expense.id"
        class="flex items-center gap-4 p-3 bg-slate-800/10 rounded-2xl border border-slate-800/30"
      >
        <div
          class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500"
        >
          <ArrowDownRight class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <p class="text-xs font-bold text-slate-200 uppercase tracking-tight">
            {{ expense.title }}
          </p>
          <p class="text-[10px] text-slate-500 font-medium">
            {{ expense.date }}
          </p>
        </div>
        <p class="text-sm font-bold text-rose-400">
          - R$ {{ formatCurrency(expense.amount) }}
        </p>
      </div>
    </div>
  </div>
</template>
