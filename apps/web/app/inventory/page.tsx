import InventoryList from './_components/InventoryList';

export default function InventoryPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500">Track parts, manage stock levels, and handle reordering.</p>
                </div>

                <InventoryList />
            </div>
        </div>
    );
}
