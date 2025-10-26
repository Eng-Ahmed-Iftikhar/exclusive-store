import React from 'react';
import SearchInput from './SearchInput';
import FilterDropdown from './FilterDropdown';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  searchPlaceholder?: string;
  filters: Array<{
    key: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search orders...',
  filters,
  className = '',
}) => {
  return (
    <div className={`px-6 pb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          placeholder={searchPlaceholder}
        />
        <div className="flex gap-2">
          {filters.map((filter) => (
            <FilterDropdown
              key={filter.key}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              placeholder={filter.placeholder}
              icon={filter.icon}
              className="min-w-[140px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
