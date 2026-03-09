import { createColumns } from '@/components/Columns'
import { DataTable } from '@/components/DataTable'
import { useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { FunnelIcon, PlusIcon, FileSpreadsheetIcon } from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import { AddTransaction } from '@/components/AddTransaction'
import { toast } from 'sonner'
import FilterTransaction from '@/components/FilterTransaction'
import { saveAs } from 'file-saver'

interface Props {
  platform: string
}

const INITIAL_FILTER = {
  month: null,
  year: null,
  keyword: null,
  category: null
}

function Transactions({ platform }: Props): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<TransactionFilters>(INITIAL_FILTER)

  const loadTransactions = async (): Promise<void> => {
    try {
      const data = await window.api.getTransactions(filters)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    }
  }

  useEffect(() => {
    const initializeTransactions = async (): Promise<void> => {
      try {
        const data = await window.api.getTransactions(filters)
        setTransactions(data)
      } catch (error) {
        console.error('Failed to initialize transactions:', error)
      }
    }

    initializeTransactions()
  }, [])

  const displayToast = (message: string): void => {
    toast.success(message, { position: 'top-center' })
  }

  useEffect(() => {
    const handleFilterChange = async (): Promise<void> => {
      try {
        const data = await window.api.getTransactions(filters)
        setTransactions(data)
      } catch (error) {
        console.error('Failed to load transactions:', error)
      }
    }

    handleFilterChange()
  }, [filters])

  const handleCSVExport = (): void => {
    const csvContent = [
      ['Date', 'Name', 'Amount', 'Category', 'Type'],
      ...transactions.map((t) => [t.date, t.name, t.amount, t.category, t.transaction_type])
    ]
      .map((row) => row.join(','))
      .join('\n')
    handleCSVDownload(csvContent)
  }

  const handleCSVDownload = (csv: string): void => {
    const file = new File([csv], 'transactions.csv', { type: 'text/csv' })
    saveAs(file)
  }

  return (
    <>
      <PageHeader>
        <ButtonGroup>
          <FilterTransaction
            transactions={transactions}
            onFilterChange={setFilters}
            onTransactionFiltered={loadTransactions}
          >
            <Button variant="outline">
              <FunnelIcon />
            </Button>
          </FilterTransaction>
          <Button
            variant="outline"
            onClick={() => {
              handleCSVExport()
            }}
          >
            <FileSpreadsheetIcon />
          </Button>
          <AddTransaction
            onTransactionAdded={loadTransactions}
            editMode={false}
            alert={displayToast}
          >
            <Button>
              <PlusIcon />
              Add
            </Button>
          </AddTransaction>
        </ButtonGroup>
      </PageHeader>
      <div
        className={`space-y-6 flex-1 overflow-auto p-6 ${platform === 'win32' && `hover:scrollbar-thumb-[#4b4e52] scrollbar-active:scrollbar-thumb-[#696E78] h-32 scrollbar`}`}
      >
        {transactions.length > 0 ? (
          <DataTable columns={createColumns(loadTransactions, displayToast)} data={transactions} />
        ) : (
          <div className="w-full text-center opacity-70 text-sm">No data to display</div>
        )}
      </div>
    </>
  )
}

export default Transactions
