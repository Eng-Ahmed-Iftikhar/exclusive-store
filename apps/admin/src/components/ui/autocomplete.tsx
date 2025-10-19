'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function Autocomplete({
  options,
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No option found.',
  disabled = false,
  className,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setSearchValue(''); // Reset search when closing
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            !selectedOption && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>
          <div className="mt-2 max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-gray-100',
                    option.disabled && 'opacity-50 cursor-not-allowed',
                    value === option.value && 'bg-blue-100 text-blue-900'
                  )}
                  onClick={() => {
                    if (!option.disabled) {
                      onValueChange?.(
                        option.value === value ? '' : option.value
                      );
                      setOpen(false);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Form field wrapper for use with react-hook-form
interface AutocompleteFieldProps
  extends Omit<AutocompleteProps, 'value' | 'onValueChange'> {
  field: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
  };
  onValueChange?: (value: string) => void;
}

export function AutocompleteField({
  field,
  onValueChange,
  ...props
}: AutocompleteFieldProps) {
  const handleValueChange = (value: string) => {
    field.onChange(value);
    onValueChange?.(value);
  };

  return (
    <Autocomplete
      {...props}
      value={field.value}
      onValueChange={handleValueChange}
    />
  );
}
