import { useNavigate, useLocation } from "react-router-dom";
import { Gauge, AlertTriangle, Activity, Cpu, Car } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", path: "/", icon: Gauge, label: "Dashboard" },
    { id: "dtc", path: "/dtc", icon: AlertTriangle, label: "DTC" },
    { id: "live-data", path: "/live-data", icon: Activity, label: "Live Data" },
    { id: "ecu", path: "/ecu", icon: Cpu, label: "ECU" },
    { id: "vehicle", path: "/vehicle", icon: Car, label: "Vehicle" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-[hsl(213_22%_14%)] border-t border-border z-50"
      data-testid="bottom-nav"
    >
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-[hsl(186_100%_53%)] bg-[hsl(186_100%_53%/0.1)]"
                  : "text-[hsl(210_10%_75%)] hover:bg-[hsl(215_14%_22%)]"
              }`}
              data-testid={`nav-${item.id}-button`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[hsl(186_100%_53%)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
