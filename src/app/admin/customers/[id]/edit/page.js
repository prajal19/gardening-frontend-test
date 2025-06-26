'use client';

import EditCustomerForm from '../../../../../components/EditCustomerForm';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import { useParams } from 'next/navigation';

export default function CustomerEditPage() {
  const params = useParams();
  const customerId = params.id;

  return (
    <AdminLayout>
      <EditCustomerForm customerId={customerId} />
    </AdminLayout>
  );
}