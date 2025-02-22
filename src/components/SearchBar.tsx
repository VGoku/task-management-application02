import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterChange }) => {
  return (
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Search tasks..."
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 p-2 border dark:border-dark-border dark:bg-dark-hover dark:text-dark-text rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="p-2 border dark:border-dark-border dark:bg-dark-hover dark:text-dark-text rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="all">All Tasks</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default SearchBar;
