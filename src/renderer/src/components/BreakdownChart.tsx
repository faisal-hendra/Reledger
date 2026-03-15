import React, { useEffect, useState } from 'react'
import { Pie, PieChart } from 'recharts'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { chartConfig } from '@/constants/piechart-config'

interface Props {
  data: CategoryPercentage[] | null
}

function BreakdownChart({ data }: Props): React.JSX.Element {
  const [formattedData, setFormattedData] = useState<object[] | undefined>([])

  function toFixedIfNecessary(value, dp): number {
    return +parseFloat(value).toFixed(dp)
  }

  useEffect(() => {
    const formatData = (): void => {
      const formatted =
        data?.map((d) => ({
          category: d.category,
          slug: d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, '_'),
          count: d.category_count,
          percentage: toFixedIfNecessary(d.percentage, 2),
          fill: `var(--color-${d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, '_')})`
        })) || undefined
      setFormattedData(formatted)
    }
    formatData()
  }, [data])

  return (
    <Card className="flex flex-col columns-2 justify-center grow">
      <CardContent className="flex pb-0 justify-center">
        <ChartContainer
          config={chartConfig}
          className="flex min-h-94 min-w-50 aspect-square justify-center"
        >
          <PieChart>
            <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
            <Pie data={formattedData} dataKey="percentage" nameKey="slug" label innerRadius={50} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
    </Card>
  )
}

export default BreakdownChart
