
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  Menu,
  X
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";

interface MobileHeaderProps {
  title: string;
  onOpenSidebar: () => void;
  onExport: () => void;
  onImportClick: () => void;
}

export function MobileHeader({ 
  title, 
  onOpenSidebar, 
  onExport, 
  onImportClick 
}: MobileHeaderProps) {
  return (
    <div className="sticky top-0 flex items-center justify-between w-full py-2 px-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-lg font-bold truncate">{title}</h1>
      </div>
      
      <div className="flex items-center gap-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Import data">
              <Upload size={16} />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="sm:max-w-md sm:rounded-t-xl">
            <SheetHeader>
              <SheetTitle>Import Roadmap Data</SheetTitle>
              <SheetDescription>
                Upload a JSON file or use the desktop version for more options.
              </SheetDescription>
            </SheetHeader>
            <div className="flex justify-center my-6">
              <Button onClick={onImportClick} className="w-full sm:w-auto">
                Select File
              </Button>
            </div>
            <SheetFooter className="sm:justify-center">
              <SheetClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onExport}
          aria-label="Export data"
        >
          <Download size={16} />
        </Button>
        
        <ThemeToggle />
      </div>
    </div>
  );
}
