import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [dateFrom, setDateFrom] = React.useState<string>('');
  const [dateTo, setDateTo] = React.useState<string>('');

  React.useEffect(() => {
    if (value?.from) {
      setDateFrom(format(value.from, 'yyyy-MM-dd'));
    } else {
      setDateFrom('');
    }
    if (value?.to) {
      setDateTo(format(value.to, 'yyyy-MM-dd'));
    } else {
      setDateTo('');
    }
  }, [value]);

  // Validate date range
  const isValidRange = React.useMemo(() => {
    if (!dateFrom || !dateTo) return true; // Allow partial selection
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    return from <= to;
  }, [dateFrom, dateTo]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateFrom = e.target.value;
    setDateFrom(newDateFrom);

    // If "to" date is earlier than new "from" date, update "to" date
    if (dateTo && newDateFrom > dateTo) {
      setDateTo(newDateFrom);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTo = e.target.value;

    // Only allow "to" date if it's not earlier than "from" date
    if (!dateFrom || newDateTo >= dateFrom) {
      setDateTo(newDateTo);
    }
  };

  const handleApply = () => {
    if (!isValidRange) return;

    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    onChange?.({ from, to });
    setOpen(false);
  };

  const handleClear = () => {
    setDateFrom('');
    setDateTo('');
    onChange?.({ from: null, to: null });
  };

  const displayValue = React.useMemo(() => {
    if (value?.from && value?.to) {
      return `${format(value.from, 'MMM dd, yyyy')} - ${format(
        value.to,
        'MMM dd, yyyy'
      )}`;
    }
    if (value?.from) {
      return `From ${format(value.from, 'MMM dd, yyyy')}`;
    }
    return placeholder;
  }, [value, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={handleFromChange}
                max={dateTo || undefined}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={handleToChange}
                min={dateFrom || undefined}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:ring-blue-400"
              />
            </div>
          </div>
          {!isValidRange && (
            <p className="text-sm text-red-600 dark:text-red-400">
              To date must be on or after from date
            </p>
          )}
          <div className="flex gap-2 justify-end">
            {(dateFrom || dateTo) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8"
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleApply}
              className="h-8"
              disabled={!isValidRange}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
