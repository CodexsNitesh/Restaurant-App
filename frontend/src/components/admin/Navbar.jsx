const Navbar = ({ title, onMenuClick }) => (
  <header className="bg-secondary border-b border-amber-300/20 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
    <button
      onClick={onMenuClick}
      className="sm:hidden text-amber-100 bg-amber-300/15 rounded-lg px-3 py-2 hover:bg-amber-300/30 transition"
      aria-label="Open sidebar"
    >
      ☰
    </button>

    <div>
      <h2 className="text-lg font-semibold text-amber-100">{title}</h2>
      <span className="text-xs text-amber-200/80">Single Restaurant Admin</span>
    </div>
  </header>
);

export default Navbar;