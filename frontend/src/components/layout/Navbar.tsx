import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, Plus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AddTransactionModal from '../transactions/AddTransactionModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                FinanceTracker Pro
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col items-center space-y-2 p-4 border-b">
                    <Avatar className="h-12 w-12 mb-1">
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-base font-semibold leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <AddTransactionModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
    </>
  );
};

export default Navbar;
