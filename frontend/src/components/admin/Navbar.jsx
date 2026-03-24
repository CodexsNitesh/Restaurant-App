const Navbar = ({ title }) => (
  <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    <span className="text-sm text-gray-400">Single Restaurant Admin</span>
  </header>
);

export default Navbar;