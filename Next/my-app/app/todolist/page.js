export default function TodoList({ todos, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">
         Todos ({todos.length})
      </h2>
      
      {todos.length === 0 ? (
        <div className="text-center py-16 px-5 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600 mb-0"> No todos yet!</p>
          <p className="text-sm text-gray-500 mt-2">
            Add your first todo above to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`bg-white border border-gray-200 rounded-lg p-5 flex justify-between items-start transition-shadow hover:shadow-lg ${
                todo.completed ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex-1 mr-4">
                <h3 className={`text-lg font-medium mb-2 ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {todo.description}
                  </p>
                )}
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  todo.completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {todo.completed ? '✓ Completed' : '○ Pending'}
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button 
                  onClick={() => onEdit(todo)} 
                  className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-md transition-all hover:bg-green-700 hover:-translate-y-0.5"
                  title="Edit"
                >
                   edit
                </button>
                <button 
                  onClick={() => onDelete(todo.id)} 
                  className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-md transition-all hover:bg-red-700 hover:-translate-y-0.5"
                  title="Delete"
                >
                   destory
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}