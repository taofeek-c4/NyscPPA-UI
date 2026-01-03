import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import MyLogs from "./pages/MyLogs";
import PendingApprovals from "./pages/PendingApprovals";
import CreatePPA from "./pages/CreatePPA";
import JoinPPA from "./pages/JoinPPA";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/join-ppa" element={<JoinPPA />} />
            <Route path="/" element={<DashboardLayout><Index /></DashboardLayout>} />
            <Route path="/my-logs" element={<DashboardLayout><MyLogs /></DashboardLayout>} />
            <Route path="/pending-approvals" element={<DashboardLayout><PendingApprovals /></DashboardLayout>} />
            <Route path="/create-ppa" element={<DashboardLayout><CreatePPA /></DashboardLayout>} />
            <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
