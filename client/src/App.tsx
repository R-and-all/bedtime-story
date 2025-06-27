import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Library from "@/pages/library";
import Settings from "@/pages/settings";
import { BookOpen, Settings as SettingsIcon, Home as HomeIcon } from "lucide-react";

function Header() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <header className="bg-white shadow-sm border-b border-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[hsl(248,84%,67%)] to-[hsl(249,84%,70%)] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[hsl(215,16%,28%)]">Bedtime Stories</h1>
              <p className="text-sm text-gray-500">Create magical tales together</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-1">
            <Link href="/" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isActive('/') 
                ? 'bg-[hsl(248,84%,67%)] text-white' 
                : 'text-[hsl(215,16%,28%)] hover:bg-purple-50'
            }`}>
              <HomeIcon className="w-4 h-4" />
              <span>Create Story</span>
            </Link>
            <Link href="/library" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isActive('/library') 
                ? 'bg-[hsl(248,84%,67%)] text-white' 
                : 'text-[hsl(215,16%,28%)] hover:bg-purple-50'
            }`}>
              <BookOpen className="w-4 h-4" />
              <span>Story Library</span>
            </Link>
            <Link href="/settings" className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isActive('/settings') 
                ? 'bg-[hsl(248,84%,67%)] text-white' 
                : 'text-[hsl(215,16%,28%)] hover:bg-purple-50'
            }`}>
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/library" component={Library} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-[hsl(37,27%,98%)]">
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-8">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
