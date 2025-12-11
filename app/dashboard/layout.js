// app/dashboard/layout.jsx
import SideNav from "./_components/SideNav";  // default import
import Header from "./_components/Header";    // default import

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block w-64 fixed inset-y-0 bg-white border-r">
        <SideNav />
      </div>

      {/* Main content */}
      <div className="flex flex-col w-full md:ml-64">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}