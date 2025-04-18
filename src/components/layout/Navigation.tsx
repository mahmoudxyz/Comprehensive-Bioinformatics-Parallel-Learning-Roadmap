import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Download, 
  Upload, 
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface NavigationProps {
  title: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  globalSearch: string;
  setGlobalSearch: (value: string) => void;
  onExport: () => void;
  onImport: (jsonData: string) => void;
}

export function Navigation({
  title,
  isSidebarOpen,
  toggleSidebar,
  globalSearch,
  setGlobalSearch,
  onExport,
  onImport
}: NavigationProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedData, setImportedData] = React.useState<string>('');
  const [jsonError, setJsonError] = React.useState<string | null>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setImportedData(content);
        setJsonError(null);
      } catch (err) {
        console.error("Error reading file:", err);
        setJsonError("Could not read the file properly");
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleImportData = () => {
    try {
      onImport(importedData);
      setImportedData('');
      setJsonError(null);
    } catch (err) {
      console.error("Error importing data:", err);
      setJsonError("Invalid JSON format. Please check your data.");
      toast({
        title: "Import Failed",
        description: "Invalid JSON format. Please check your data.",
        variant: "destructive"
      });
    }
  };
  
  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (err) {
      setJsonError("Invalid JSON format. Please check your data.");
      return false;
    }
  };
  
  return (
    <>
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileChange}
      />
      
      {/* Desktop Navigation - Fixed at top */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16">
        <div className="container mx-auto flex justify-between items-center h-full px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </Button>
          <div className="flex flex-col items-start gap-0">
            <h1 className="text-lg font-bold leading-tight">
              Bioinformatics Roadmap
            </h1>
            <p className="text-[1rem] text-muted-foreground leading-none tracking-wide">
              by GeneR
            </p>
          </div>
        </div>
          
          <div className="relative w-1/3 mx-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search across all resources..."
              className="pl-8 w-full"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            {globalSearch && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1 h-7 w-7 p-0" 
                onClick={() => setGlobalSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Upload size={16} /> Import
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Import Roadmap Data</SheetTitle>
                  <SheetDescription>
                    Paste your JSON data below or upload a file.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-4 space-y-4">
                  <Textarea
                    value={importedData}
                    onChange={(e) => {
                      setImportedData(e.target.value);
                      if (e.target.value) {
                        validateJson(e.target.value);
                      } else {
                        setJsonError(null);
                      }
                    }}
                    placeholder="Paste your JSON data here..."
                    className="min-h-[200px]"
                  />
                  
                  {jsonError && (
                    <p className="text-sm text-destructive">{jsonError}</p>
                  )}
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Or</p>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleImportClick}
                    >
                      Upload JSON File
                    </Button>
                  </div>
                </div>
                
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <Button 
                    onClick={handleImportData}
                    disabled={!importedData || !!jsonError}
                  >
                    Import Data
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="outline" 
              className="gap-1" 
              onClick={onExport}
            >
              <Download size={16} /> Export
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation - Fixed at top */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <PanelLeftOpen size={18} />
            </Button>
            <h1 className="text-lg font-bold truncate">{title}</h1>
          </div>
          
          <div className="flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Upload size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Import Roadmap Data</SheetTitle>
                </SheetHeader>
                
                <div className="py-4 space-y-4">
                  <div className="text-center">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleImportClick}
                      className="w-full"
                    >
                      <Upload size={16} className="mr-2" /> 
                      Upload JSON File
                    </Button>
                  </div>
                  
                  <Textarea
                    value={importedData}
                    onChange={(e) => {
                      setImportedData(e.target.value);
                      if (e.target.value) {
                        validateJson(e.target.value);
                      } else {
                        setJsonError(null);
                      }
                    }}
                    placeholder="Or paste your JSON data here..."
                    className="min-h-[150px]"
                  />
                  
                  {jsonError && (
                    <p className="text-sm text-destructive">{jsonError}</p>
                  )}
                </div>
                
                <SheetFooter>
                  <Button 
                    onClick={handleImportData}
                    disabled={!importedData || !!jsonError}
                    className="w-full"
                  >
                    Import Data
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onExport}
            >
              <Download size={18} />
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile search bar */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources..."
              className="pl-8"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            {globalSearch && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1 h-7 w-7 p-0" 
                onClick={() => setGlobalSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}