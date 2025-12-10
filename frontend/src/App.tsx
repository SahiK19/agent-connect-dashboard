import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NidsLogs from "./pages/NidsLogs";
import HidsLogs from "./pages/HidsLogs";
import InstallAgent from "./pages/InstallAgent";
import AgentStatus from "./pages/AgentStatus";
import ApiToken from "./pages/ApiToken";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nids-logs" element={<NidsLogs />} />
          <Route path="/hids-logs" element={<HidsLogs />} />
          <Route path="/install-agent" element={<InstallAgent />} />
          <Route path="/agent-status" element={<AgentStatus />} />
          <Route path="/api-token" element={<ApiToken />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
