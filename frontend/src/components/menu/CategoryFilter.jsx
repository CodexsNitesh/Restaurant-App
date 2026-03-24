const CategoryFilter = ({ categories, selected, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      onClick={() => onChange('')}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
        selected === '' ? 'bg-primary text-white' : 'bg-white border text-gray-600'
      }`}
    >
      All
    </button>
    {categories.map((cat) => (
      <button
        key={cat._id}
        onClick={() => onChange(cat._id)}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
          selected === cat._id ? 'bg-primary text-white' : 'bg-white border text-gray-600'
        }`}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

export default CategoryFilter;