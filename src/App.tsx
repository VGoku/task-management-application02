import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchBar from './components/SearchBar';
import TaskStats from './components/TaskStats';
import NotFound from './components/NotFound';
import { useTaskStore } from './lib/store';
import { Task, TaskFormData } from './types/task';
import ThemeToggle from './components/ThemeToggle';
import TaskMetrics from './components/TaskMetrics';
import TaskProgress from './components/TaskProgress';
import TaskDeadlines from './components/TaskDeadlines';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'todo',
      tags: typeof data.tags === 'string' ? 
            data.tags.split(',').map((tag: string) => tag.trim()) : 
            Array.isArray(data.tags) ? data.tags : [],
    };
    addTask(newTask);
  };

  const handleUpdateTask = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        ...data,
        tags: typeof data.tags === 'string' ? 
              data.tags.split(',').map((tag: string) => tag.trim()) :
              Array.isArray(data.tags) ? data.tags : [],
      });
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    setTaskStatus(id, status);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen dark:bg-dark-bg transition-colors duration-300">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <Routes>
            <Route path="/" element={
              <>
                <header className="mb-8 md:mb-12 text-center relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-600/10 dark:bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
                  <h1 className="text-4xl md:text-5xl font-bold heading-gradient mb-3 animate-float">
                    Taskify
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                    Your personal task manager that makes productivity fun and efficient
                  </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                  <TaskMetrics tasks={tasks} />
                  <TaskProgress tasks={tasks} />
                  <TaskDeadlines tasks={tasks} />
                </div>

                <TaskStats tasks={tasks} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="glass-card">
                    <h2 className="text-2xl font-semibold heading-gradient mb-6">
                      {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <TaskForm
                      onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                      initialData={editingTask ?? undefined}
                    />
                  </div>
                  
                  <div className="glass-card">
                    <h2 className="text-2xl font-semibold heading-gradient mb-6">
                      Your Tasks
                    </h2>
                    <SearchBar
                      onSearch={setSearchQuery}
                      onFilterChange={setStatusFilter}
                    />
                    <div className="h-[400px] overflow-y-auto mt-4 custom-scrollbar pr-1">
                      <TaskList
                        tasks={filteredTasks}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  </div>
                </div>

                <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm pb-4">
                  <p>© {new Date().getFullYear()} Taskify. All rights reserved.</p>
                  <p className="mt-1">Designed to showcase modern web development skills</p>
                </footer>
              </>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <ThemeToggle />
      </div>
    </BrowserRouter>
  );
}

export default App;