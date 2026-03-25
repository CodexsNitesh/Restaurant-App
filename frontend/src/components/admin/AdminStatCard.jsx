const StatCard = ({ label, value, icon, color = 'bg-gradient-to-r from-amber-400/20 to-amber-100/10 text-amber-100' }) => (
  <div className="card flex items-center gap-4">
    <div className={`text-3xl p-3 rounded-xl shadow-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-amber-200">{label}</p>
      <p className="text-2xl font-bold text-amber-50">{value}</p>
    </div>
  </div>
);

export default StatCard;