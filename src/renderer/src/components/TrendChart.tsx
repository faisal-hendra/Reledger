'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import dayjs from 'dayjs'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card } from './ui/card'

const chartConfig = {
  income: {
    label: 'Income',
    color: '#65dc7e'
  },
  expense: {
    label: 'Expense',
    color: '#e06866'
  }
} satisfies ChartConfig

interface Props {
  data: { month: number; income: number; expense: number }[] | undefined
  displayIncomeChart: boolean
  displayExpenseChart: boolean
}
export function TrendChart({
  data,
  displayIncomeChart,
  displayExpenseChart
}: Props): React.JSX.Element {
  return (
    <Card className="px-6 shadow-none h-100">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={data}>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) =>
              dayjs()
                .month(value - 1) // dayjs months are 0-indexed (0=Jan), but data uses 1-indexed (1=Jan)
                .format('MMM')
            }
          />
          <CartesianGrid vertical={false} />

          {displayIncomeChart && (
            <Bar dataKey="income" fill="var(--color-income)" radius={[0, 0, 4, 4]} stackId="a" /> // radius order: [top-left, top-right, bottom-right, bottom-left]
          )}

          {displayExpenseChart && (
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} stackId="a" /> // stackId="a" stacks bars; radius rounding matches their position in the stack
          )}
        </BarChart>
      </ChartContainer>
    </Card>
  )
}
