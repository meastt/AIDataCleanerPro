import { Spinner } from '@/app/components/ui'

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  )
}
