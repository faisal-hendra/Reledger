import { ModeToggle } from '@/components/ui/mode-toggle'
import PageHeader from '@/components/PageHeader'

function Settings(): React.JSX.Element {
  return (
    <>
      <PageHeader />
      <div className="flex-1 overflow-auto p-6">
        <div className="grow space-y-6">
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
        </div>
      </div>
    </>
  )
}

export default Settings
