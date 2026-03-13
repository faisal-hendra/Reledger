import { ModeToggle } from '@/components/ui/mode-toggle'
import { useCurrency } from '@/components/ui/use-currency'
import { CURRENCIES } from '@/constants/currencies'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

const handleReset = async (): Promise<void> => {
  try {
    window.api.resetTable()
  } catch (error) {
    console.error(error)
  } finally {
    toast('Ledger has been reset')
  }
}

const ResetDialog = (): React.ReactNode => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Reset Ledger</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Reset Ledger?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all of your transaction histor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleReset}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function Settings(): React.JSX.Element {
  const { currency, setCurrency } = useCurrency()

  return (
    <>
      <PageHeader />
      <div className="flex-1 overflow-auto p-6">
        <div className="grow space-y-6 flex grid grid-cols-1 gap-6">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">General</h3>
            <div className=" pt-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card ">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Currency Symbol
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred currency for display
                  </p>
                </div>
                <Select
                  value={currency.code}
                  onValueChange={(value) => {
                    const selected = CURRENCIES.find((c) => c.code === value)
                    if (selected) setCurrency(selected)
                  }}
                >
                  <SelectTrigger className="min-w-30 max-w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="w-75">
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.symbol} {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Appearance</h3>
            <div className=" pt-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card ">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Theme
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Customize the appearance of the app
                  </p>
                </div>
                <ModeToggle />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-6">Danger Zone</h3>
            <div className=" pt-4"></div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card ">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Reset
                </label>
                <p className="text-sm text-muted-foreground">
                  Completely delete transaction history. This action can NOT be undone!
                </p>
              </div>
              <ResetDialog />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Settings
