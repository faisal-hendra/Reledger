import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import dayjs from 'dayjs'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card } from './ui/card'
import { useCurrency } from '@/stores/use-currency'

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
  const { currency } = useCurrency()

  return (
    <Card className="px-6 shadow-none h-100">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={data}>
          <ChartTooltip
            cursor={{ fill: 'hsl(var(--muted-foreground) / 0.08)' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const month = dayjs().month(Number(label) - 1).format('MMMM')
              const items = payload
                .filter((p) => p.value !== undefined)
                .sort((a, b) => String(a.name).localeCompare(String(b.name)))
              return (
                <div className="grid min-w-[9rem] items-start gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
                  <span className="text-muted-foreground font-medium">{month}</span>
                  <div className="flex flex-col gap-1.5">
                    {items.map((p) => {
                      const key = p.name as string
                      const color = chartConfig[key]?.color
                      const label = chartConfig[key]?.label || key
                      const value = Number(p.value)
                      return (
                        <div key={key} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-muted-foreground">{label}</span>
                          </div>
                          <span className="font-medium tabular-nums">
                            {currency.symbol}
                            {value.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            }}
          />
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
