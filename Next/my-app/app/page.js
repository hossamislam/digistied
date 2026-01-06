'use client';
import { useEffect, useState } from 'react';
import { todoApi } from './api';
import TodoForm from './todoform/page';
import TodoList from './todolist/page';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from './protected/ProtectedRoutes';

function HomePage() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoApi.getAll();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoApi.delete(id);
        setTodos(todos.filter(todo => todo.id !== id));
        
        if (editingTodo?.id === id) {
          setEditingTodo(null);
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
        alert('Failed to delete todo. Please try again.');
      }
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    fetchTodos();
    setEditingTodo(null);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-5 min-h-screen bg-white">
      <header className="text-center mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1"></div>
          <h1 className="text-4xl font-bold text-gray-800 flex-1">
            📝 Todo List App
          </h1>
          <div className="flex-1 flex justify-end gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name}!
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-base">
          Manage your tasks efficiently
        </p>
      </header>
      
      <TodoForm 
        editingTodo={editingTodo}
        onSuccess={handleFormSuccess}
        onCancel={handleCancelEdit}
      />

      {loading ? (
        <div className="text-center py-16 px-5">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-5"></div>
          <p className="text-gray-600 text-sm">Loading todos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 px-5 bg-red-100 rounded-lg text-red-800">
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchTodos} 
            className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <TodoList 
          todos={todos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}