"use client";

import HeaderTable from "../../../components/ui_self/HeaderTable";
import AdminLayout from "../../../components/ui_self/AdminLayout";

const HeaderMessagesPage: React.FC = () => {
  return (
    <AdminLayout title="Header">
      <HeaderTable />
    </AdminLayout>
  );
};

export default HeaderMessagesPage;
