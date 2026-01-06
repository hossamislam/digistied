'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { todoApi } from '../api';
import { useState, useEffect } from 'react';

const todoSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});

export default function TodoForm({ editingTodo, onSuccess, onCancel }) {
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      completed: false,
    },
  });

  useEffect(() => {
    if (editingTodo) {
      reset({
        title: editingTodo.title || '',
        description: editingTodo.description || '',
        completed: editingTodo.completed || false,
      });
    } else {
      reset({
        title: '',
        description: '',
        completed: false,
      });
    }
    setSubmitError('');
  }, [editingTodo, reset]);

  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      
      if (editingTodo) {
        await todoApi.update(editingTodo.id, data);
      } else {
        await todoApi.create(data);
      }

      reset();
      onSuccess();
    } catch (error) {
      console.error('Error submitting todo:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Failed to submit todo. Please try again.'
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">
        {editingTodo ? 'Edit Todo' : 'Add New Todo'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label 
            htmlFor="title" 
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            placeholder="Enter todo title"
            className={`w-full px-3 py-3 text-gray-900 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label 
            htmlFor="description" 
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Enter todo description (optional)"
            rows="4"
            className={`w-full px-3 py-3 text-gray-900 border rounded-md text-sm transition-colors resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              {...register('completed')}
              className="w-4 h-4 mr-2 cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">Mark as completed</span>
          </label>
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 text-sm rounded-md">
            {submitError}
          </div>
        )}

        <div className="flex gap-3">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : editingTodo ? 'Update Todo' : 'Add Todo'}
          </button>
          {editingTodo && (
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-6 py-3 bg-gray-600 text-white text-sm font-semibold rounded-md transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}