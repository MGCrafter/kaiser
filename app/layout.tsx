import "../app/globals.css";
import Footer from "../components/footer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const metadata = {
  title: "KaiserJasulyo - Linktree",
  description: "Linktree by NekoZDevTeam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="flex flex-col min-h-90vh">
        <main className="flex-grow">
          {children}
        </main>
        <ToastContainer />
        <Footer />
      </body>
    </html>
  );
}