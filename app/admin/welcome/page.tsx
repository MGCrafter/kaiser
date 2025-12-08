// welcome/page.tsx
"use client";

import WelcomeTable from '../../../components/ui_self/WelcomeTable';
import AdminLayout from '../../../components/ui_self/AdminLayout';

const WelcomeMessagesPage: React.FC = () => {
  return (
    <AdminLayout title="Welcome Messages">
      <WelcomeTable />
    </AdminLayout>
  );
};

export default WelcomeMessagesPage;
