import { Label } from './ui/label'

interface SettingCardProps {
  title: string
  description: string
  children: React.ReactNode
}

function SettingCard({ title, description, children }: SettingCardProps): React.ReactNode {
  return (
    <div className="pt-1">
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
        <div className="flex grid gap-1">
          <Label>{title}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default SettingCard
