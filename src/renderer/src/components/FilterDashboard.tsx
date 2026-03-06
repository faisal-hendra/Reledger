import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChartBarIcon } from 'lucide-react'

interface Props {
  children: React.ReactNode
  displayIncomeChart: boolean
  setDisplayIncomeChart: (value: boolean) => void
  displayExpenseChart: boolean
  setDisplayExpenseChart: (value: boolean) => void
}

import { Switch } from '@/components/ui/switch'
import { Label } from './ui/label'

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
      <PopoverContent>
        <div className="flex gap-2">
          <ChartBarIcon />
          <h3>Chart Settings</h3>
        </div>
        <br />
        <div className="flex grid grid-rows-1 gap-4">
          <div className="flex justify-between">
            <Switch
              checked={displayIncomeChart}
              onCheckedChange={() => setDisplayIncomeChart(!displayIncomeChart)}
            />
            <Label>Income</Label>
          </div>
          <div className="flex justify-between">
            <Switch
              checked={displayExpenseChart}
              onCheckedChange={() => {
                setDisplayExpenseChart(!displayExpenseChart)
              }}
            />
            <Label>Expense</Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterDashboard
