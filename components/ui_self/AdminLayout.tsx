"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUserStore from "@/lib/state";
import {
  LogOut,
  Home,
  Link as LinkIcon,
  MessageSquare,
  Heading,
  ExternalLink
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.logout);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !token) {
      router.push("/login");
    }
  }, [token, router, isMounted]);

  if (!isMounted) {
    return null;
  }

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const goToHomepage = () => {
    window.open("/", "_blank");
  };

  const navigation = [
    { name: "Links", href: "/admin", icon: LinkIcon, current: pathname === "/admin" || pathname === "/admin/links" },
    { name: "Welcome", href: "/admin/welcome", icon: MessageSquare, current: pathname === "/admin/welcome" },
    { name: "Header", href: "/admin/header", icon: Heading, current: pathname === "/admin/header" },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center h-16 px-6 border-b border-gray-800">
            <Home className="w-6 h-6 text-blue-500" />
            <h1 className="ml-3 text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`
                    w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${
                      item.current
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 space-y-2 border-t border-gray-800">
            <button
              onClick={goToHomepage}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5 mr-3" />
              Zur Homepage
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="min-h-screen p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <p className="mt-1 text-sm text-gray-400">
              Verwalte deine {title.toLowerCase()}
            </p>
          </div>

          {/* Content */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            {children}
          </div>
        </main>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AdminLayout;
