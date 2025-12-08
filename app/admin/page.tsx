"use client";

import LinkTable from "../../components/ui_self/LinkTable";
import AdminLayout from "../../components/ui_self/AdminLayout";

const AdminPage: React.FC = () => {
  return (
    <AdminLayout title="Links">
      <LinkTable />
    </AdminLayout>
  );
};

export default AdminPage;
