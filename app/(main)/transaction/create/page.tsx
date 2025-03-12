import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";

import { getTransaction } from "@/actions/transaction";
import { AddTransactionForm } from "../_components/transaction-form";

export default async function AddTransactionPage({ searchParams }) {
    const accounts = await getUserAccounts();
    const editId = searchParams?.edit;

    let initialData = null;
    if (editId) {
        const transaction = await getTransaction(editId);
        initialData = transaction;
    }

    return (
        <div className='flex items-center justify-center   min-h-screen bg-background'>
            <div className='flex-1 overflow-hidden'>
                <div className='p-6 space-y-6'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Add Transction
                    </h1>
                    <div className=' gap-4  w-full'>
                        <AddTransactionForm
                            accounts={accounts}
                            categories={defaultCategories}
                            editMode={!!editId}
                            initialData={initialData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
