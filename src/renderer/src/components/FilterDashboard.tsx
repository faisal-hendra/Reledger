import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChartBarIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface Props {
  children: React.ReactNode
  displayIncomeChart: boolean
  setDisplayIncomeChart: (value: boolean) => void
  displayExpenseChart: boolean
  setDisplayExpenseChart: (value: boolean) => void
}

function FilterDashboard({
  children,
  displayIncomeChart,
  setDisplayIncomeChart,
  displayExpenseChart,
  setDisplayExpenseChart
}: Props): React.JSX.Element {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-50 translate-y-1.5">
        <div className="flex gap-2 items-center opacity-90">
          <ChartBarIcon />
          <h3 className="text-sm font-mono">Chart</h3>
        </div>
        <br />
        <div className="flex grid grid-rows-1 gap-4">
          <div className="flex justify-between">
            <Switch
              checked={displayIncomeChart}
              onCheckedChange={() => setDisplayIncomeChart(!displayIncomeChart)}
            />
            <Label className="opacity-80">Income</Label>
          </div>
          <div className="flex justify-between">
            <Switch
              checked={displayExpenseChart}
              onCheckedChange={() => {
                setDisplayExpenseChart(!displayExpenseChart)
              }}
            />
            <Label className="opacity-80">Expense</Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterDashboard
