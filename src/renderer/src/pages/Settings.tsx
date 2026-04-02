import { ModeToggle } from '@/components/ui/mode-toggle'
import { useCurrency } from '@/stores/use-currency'
import { useCsvSeparator } from '@/stores/use-csvseparator'
import { CURRENCIES } from '@/constants/currencies'
import { CSV_SEPARATORS } from '@/constants/csv-separators'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import PageHeader from '@/components/PageHeader'
import SettingCard from '@/components/SettingCard'
import { toast } from 'sonner'
import ResetDialog from '@/components/ResetDialog'

const handleReset = async (): Promise<void> => {
  try {
    window.api.resetTable()
  } catch (error) {
    console.error(error)
  } finally {
    toast('Ledger has been reset')
  }
}

function Settings(): React.JSX.Element {
  const { currency, setCurrency } = useCurrency()
  const { csvSeparator, setCsvSeparator } = useCsvSeparator()

  return (
    <>
      <PageHeader />
      <div className="flex-1 overflow-auto p-6">
        <div className="grow space-y-6 flex grid grid-cols-1 gap-6">
          <section className="flex grid gap-y-1">
            <h3 className="text-lg font-semibold">General</h3>
            <SettingCard
              title="Currency Symbol"
              description="Select your preferred currency for display"
            >
              <Select
                value={currency.code}
                onValueChange={(value) => {
                  const selected = CURRENCIES.find((c) => c.code === value)
                  if (selected) setCurrency(selected)
                }}
              >
                <SelectTrigger className="min-w-30 max-w-full min-h-12">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem
                      key={c.code}
                      value={c.code}
                      className="group px-3 py-2.5 cursor-pointer rounded-none focus:bg-accent/60 data-[state=checked]:bg-primary/8"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-foreground group-focus:bg-primary/10">
                          {c.symbol}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold leading-none text-foreground">
                            {c.code}
                          </span>
                          <span className="text-xs text-muted-foreground truncate mt-0.5">
                            {c.name}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>
            <SettingCard
              title="CSV Separator"
              description="Select your preferred CSV separator for exporting data"
            >
              <Select value={csvSeparator} onValueChange={setCsvSeparator}>
                <SelectTrigger className="min-w-30 max-w-full min-h-12">
                  <SelectValue placeholder="Select separator" />
                </SelectTrigger>
                <SelectContent>
                  {CSV_SEPARATORS.map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="group px-3 py-2.5 cursor-pointer rounded-none focus:bg-accent/60 data-[state=checked]:bg-primary/8"
                    >
                      <div className="flex items-center gap-3 w-full">
                        {s === ',' ? 'Comma ' : 'Semicolon '}( {` ${s} `} )
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Appearance</h3>
            <SettingCard title="Theme" description="Customize the appearance of the app">
              <ModeToggle />
            </SettingCard>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <SettingCard
              title="Reset"
              description="Completely delete transaction history. This action can NOT be undone!"
            >
              <ResetDialog handleReset={handleReset} />
            </SettingCard>
          </section>
        </div>
      </div>
    </>
  )
}

export default Settings
