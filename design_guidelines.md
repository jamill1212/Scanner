{
  "meta": {
    "product_name": "TorqueProX (Automotive Diagnostics & ECU Programmer)",
    "audience": ["Automotive technicians", "Performance tuners", "Advanced car enthusiasts"],
    "platform": "Android-first, responsive mobile UI (works on small phones to 7-8\" tablets)",
    "brand_attributes": ["technical", "trustworthy", "precise", "rugged", "workshop-friendly"],
    "visual_style": "Dark, high-contrast technical UI with teal/cyan accents, caution amber, and danger red. Solid dark surfaces (no flashy gradients). Gauges with bold numerics (Space Grotesk)."
  },

  "color_system": {
    "notes": "Dark workshop theme optimized for readability in low-light garages. Avoid saturated purple/pink. Use subtle steel/graphite tints and bright accent colors only for data and states.",
    "tokens_hsl": {
      "--bg": "215 37% 7%",              
      "--bg-elev-1": "215 28% 9%",        
      "--bg-elev-2": "214 24% 12%",       
      "--surface": "213 22% 14%",         
      "--muted": "215 14% 22%",
      "--text": "210 20% 96%",
      "--text-secondary": "210 10% 75%",

      "--accent": "186 100% 53%",         
      "--accent-2": "173 66% 47%",        
      "--ok": "146 64% 52%",             
      "--warn": "38 97% 55%",            
      "--danger": "2 85% 58%",           
      "--info": "200 98% 50%",

      "--ring": "186 100% 53%",
      "--border": "215 14% 28%",
      "--card": "213 22% 14%",
      "--card-foreground": "210 20% 96%",
      "--chart-1": "186 100% 53%",
      "--chart-2": "173 66% 47%",
      "--chart-3": "200 98% 50%",
      "--chart-4": "38 97% 55%",
      "--chart-5": "2 85% 58%",
      "--radius": "0.625rem"
    },
    "usage": {
      "background": "Use --bg across app body; prefer --bg-elev-* for sections and cards.",
      "primary_actions": "Use --accent on primary CTAs, focus rings, and active tabs.",
      "semantic_states": {
        "success": "--ok",
        "warning": "--warn",
        "error": "--danger",
        "info": "--info"
      }
    },
    "gradients": {
      "rule": "Follow gradient restriction: keep decorative only, <20% viewport, never on text-heavy areas or small UI.",
      "examples": [
        "bg-[radial-gradient(ellipse_at_top,_hsl(215_37%_7%)_0%,_hsl(214_24%_12%)_60%,_hsl(215_37%_7%)_100%)]",
        "after:absolute after:inset-0 after:bg-[linear-gradient(180deg,_transparent,_hsl(214_24%_12%))] after:pointer-events-none"
      ]
    },
    "textures": {
      "noise_css": "background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 2px 2px;"
    }
  },

  "typography": {
    "fonts": {
      "heading": "Space Grotesk, ui-sans-serif, system-ui",
      "body": "Inter, ui-sans-serif, system-ui",
      "mono": "Roboto Mono, ui-monospace, SFMono-Regular"
    },
    "import": {
      "google_fonts": "<link href=\"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">"
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight font-semibold",
      "h2": "text-base sm:text-lg font-semibold",
      "body": "text-sm sm:text-base leading-relaxed",
      "small": "text-xs leading-snug"
    },
    "numerics": "Use tabular-nums and lining-nums for live values: font-variant-numeric: tabular-nums lining-nums;"
  },

  "design_tokens_css": {
    "extend_index_css": "Add into /app/frontend/src/index.css :root.dark block to override tokens with automotive palette.",
    "snippet": "@layer base{ .dark{ --background: var(--bg); --foreground: var(--text); --card: var(--card); --card-foreground: var(--text); --muted: var(--muted); --muted-foreground: var(--text-secondary); --primary: var(--accent); --primary-foreground: 0 0% 10%; --secondary: var(--bg-elev-1); --secondary-foreground: var(--text); --destructive: var(--danger); --destructive-foreground: 0 0% 10%; --border: var(--border); --input: var(--border); --ring: var(--ring);} }"
  },

  "layout_principles": {
    "navigation": "Bottom tab bar (3-5 items) for Dashboard, DTC, Live Data, ECU, Vehicle. Use shadcn Tabs for top sub-nav.",
    "reading_patterns": "Use Z-pattern within each screen. Left edge houses labels, right edge numeric emphasis.",
    "card_grid": "Mobile: 1 column with 16-20px gaps; >=md: 2 columns; >=lg: 12-column grid for tablet dashboard.",
    "touch_targets": ">= 44x44px; spacing 16-24px between interactive elements.",
    "safe_area": "Use pt-safe and pb-safe with env(safe-area-inset-*) on Android devices with gesture bars."
  },

  "components": {
    "dashboard_header": {
      "purpose": "Top status bar with vehicle name, OBD connection pill, ignition status, and quick actions.",
      "paths": ["/app/frontend/src/components/ui/menubar.jsx", "/app/frontend/src/components/ui/badge.jsx", "/app/frontend/src/components/ui/button.jsx", "/app/frontend/src/components/ui/dropdown-menu.jsx"],
      "tailwind": "sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-border",
      "micro": "Connection pill pulses with accent ring when connecting. Use aria-live=polite for status."
    },
    "stat_cards": {
      "purpose": "Quick KPIs: Engine load, coolant temp, battery voltage.",
      "paths": ["/app/frontend/src/components/ui/card.jsx", "/app/frontend/src/components/ui/progress.jsx", "/app/frontend/src/components/ui/badge.jsx"],
      "style": "bg-[hsl(214_24%_12%)] hover:bg-[hsl(214_20%_15%)] border border-border rounded-xl",
      "content": "Label (small), large numeric (Space Grotesk, tabular-nums), trend sparkline (Recharts)."
    },
    "gauges": {
      "purpose": "Live RPM/Speed/Boost/Temp using radial and linear gauges.",
      "lib": "Recharts RadialBarChart + AreaChart for smooth performance on mobile.",
      "tailwind": "aspect-square rounded-2xl bg-[hsl(214_24%_12%)] border border-border",
      "code_skeleton_jsx": "import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';\nexport const GaugeCard = ({label, value=0, max=8000, unit='RPM'}) => {\n  const pct = Math.min(100, Math.round((value/max)*100));\n  const data = [{ name: label, value: pct, fill: 'hsl(186 100% 53%)' }];\n  return (\n    <div className=\"p-4 rounded-2xl bg-[hsl(214_24%_12%)] border border-border\" data-testid=\"gauge-card\">\n      <div className=\"text-xs text-[hsl(210_10%_75%)]\">{label}</div>\n      <div className=\"flex items-center justify-center\">\n        <RadialBarChart width={220} height={220} cx=\"50%\" cy=\"50%\" innerRadius=\"60%\" outerRadius=\"90%\" barSize={10} data={data} startAngle={220} endAngle={-40}>\n          <PolarAngleAxis type=\"number\" domain={[0, 100]} tick={false} />\n          <RadialBar background clockWise dataKey=\"value\" cornerRadius=\"50%\" />\n        </RadialBarChart>\n      </div>\n      <div className=\"text-3xl font-semibold tracking-tight font-[Space_Grotesk] tabular-nums\" aria-live=\"polite\" data-testid=\"gauge-value\">{value.toLocaleString()} <span className=\"text-xs text-[hsl(210_10%_75%)]\">{unit}</span></div>\n    </div>\n  );\n};"
    },
    "dtc_list": {
      "purpose": "Scan, list, filter, and clear Diagnostic Trouble Codes.",
      "paths": ["/app/frontend/src/components/ui/accordion.jsx", "/app/frontend/src/components/ui/input.jsx", "/app/frontend/src/components/ui/button.jsx", "/app/frontend/src/components/ui/badge.jsx", "/app/frontend/src/components/ui/alert.jsx", "/app/frontend/src/components/ui/alert-dialog.jsx"],
      "item_spec": "Row shows code (e.g., P0300), severity chip (success/warn/danger), short title, expand for description, probable causes, and actions.",
      "code_skeleton_jsx": "export const DtcRow = ({code, severity='warn', title, children}) => {\n  const color = severity==='danger' ? 'bg-[hsl(2_85%_58%)]' : severity==='warn' ? 'bg-[hsl(38_97%_55%)]' : 'bg-[hsl(146_64%_52%)]';\n  return (\n    <div className=\"flex items-center justify-between rounded-lg border border-border p-3 bg-[hsl(214_24%_12%)]\" data-testid=\"dtc-row\">\n      <div className=\"flex items-center gap-3\">\n        <span className=\"px-2 py-1 rounded-md text-xs font-medium text-black \" style={{backgroundColor:'hsl(215 14% 90%)'}}>{code}</span>\n        <span className=\"px-2 py-1 rounded-md text-xs font-medium text-black\" style={{backgroundColor: `hsl(${severity==='danger'? '2 85% 58%' : severity==='warn'? '38 97% 55%' : '146 64% 52%'})`}}>{severity}</span>\n        <span className=\"text-sm text-white\">{title}</span>\n      </div>\n      <div className=\"flex items-center gap-2\">\n        <button className=\"h-9 px-3 rounded-md bg-[hsl(215_14%_22%)] text-white hover:bg-[hsl(215_14%_26%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(186_100%_53%)]\" data-testid=\"dtc-more-button\">Details</button>\n        <button className=\"h-9 px-3 rounded-md bg-[hsl(2_85%_58%)] text-black hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(186_100%_53%)]\" data-testid=\"dtc-clear-button\">Clear</button>\n      </div>\n    </div>\n  );\n};"
    },
    "live_table": {
      "purpose": "Scrollable sensor table with pinning and unit badges.",
      "paths": ["/app/frontend/src/components/ui/table.jsx", "/app/frontend/src/components/ui/scroll-area.jsx", "/app/frontend/src/components/ui/switch.jsx", "/app/frontend/src/components/ui/checkbox.jsx"],
      "pattern": "Mobile: key sensors at top, others collapsible. Pin rows using star/checkbox and show pinned at top with a Divider.",
      "classes": "bg-[hsl(214_24%_12%)] border border-border rounded-xl"
    },
    "ecu_programming": {
      "purpose": "Safe, step-driven flows: Read ECU, Backup, Program, Verify.",
      "paths": ["/app/frontend/src/components/ui/tabs.jsx", "/app/frontend/src/components/ui/progress.jsx", "/app/frontend/src/components/ui/alert-dialog.jsx", "/app/frontend/src/components/ui/card.jsx", "/app/frontend/src/components/ui/textarea.jsx", "/app/frontend/src/components/ui/input.jsx", "/app/frontend/src/components/ui/select.jsx"],
      "interactions": "Before write operations, require explicit confirmation via AlertDialog. Show persistent progress with cancel disabled once flashing starts.",
      "file_upload": {
        "lib": "react-dropzone",
        "install": "npm i react-dropzone",
        "pattern": "Drag & drop .bin/.hex/.ori files or tap to select. Validate by magic bytes & size.",
        "jsx": "import {useDropzone} from 'react-dropzone';\nexport const FileDrop = ({onFile})=>{\n  const {getRootProps, getInputProps, isDragActive} = useDropzone({\n    accept:{'application/octet-stream':['.bin','.hex','.ori']},\n    multiple:false,\n    onDrop:(files)=>onFile && onFile(files[0])\n  });\n  return (\n    <div {...getRootProps()} className=\"border-2 border-dashed rounded-xl p-6 text-center bg-[hsl(214_24%_12%)] hover:bg-[hsl(214_20%_15%)]\" data-testid=\"ecu-file-drop\">\n      <input {...getInputProps()} />\n      <p className=\"text-sm text-[hsl(210_10%_75%)]\">{isDragActive ? 'Drop file to upload' : 'Drop ECU file here or tap to select'}</p>\n    </div>\n  )\n}"
      }
    },
    "vehicle_info": {
      "purpose": "VIN, make/model/year, ECU IDs, protocol, battery status.",
      "paths": ["/app/frontend/src/components/ui/card.jsx", "/app/frontend/src/components/ui/badge.jsx", "/app/frontend/src/components/ui/separator.jsx"],
      "layout": "Definition grid (2-col on tablet). Use monospace for IDs.",
      "classes": "grid grid-cols-1 sm:grid-cols-2 gap-4"
    },
    "obd_connection": {
      "purpose": "Discover/connect ELM327 devices, show protocol and signal strength.",
      "paths": ["/app/frontend/src/components/ui/sheet.jsx", "/app/frontend/src/components/ui/button.jsx", "/app/frontend/src/components/ui/radio-group.jsx", "/app/frontend/src/components/ui/progress.jsx", "/app/frontend/src/components/ui/badge.jsx"],
      "pattern": "Bottom Sheet with device list, Connect button, and live status. Show amber during handshake, green when connected.",
      "code_skeleton_jsx": "export const OBDConnectSheet = ({open,onClose,devices=[],onConnect})=>{\n  return (\n    <div role=\"dialog\" aria-modal=\"true\" className=\"fixed inset-x-0 bottom-0 bg-[hsl(213_22%_14%)] border-t border-border rounded-t-2xl p-4 shadow-2xl\" hidden={!open} data-testid=\"obd-connect-sheet\">\n      <div className=\"flex items-center justify-between\">\n        <h3 className=\"text-base font-semibold\">OBD-II Devices</h3>\n        <button onClick={onClose} className=\"h-9 px-3 rounded-md bg-[hsl(215_14%_22%)] hover:bg-[hsl(215_14%_26%)]\" data-testid=\"obd-close-button\">Close</button>\n      </div>\n      <div className=\"mt-3 space-y-2 max-h-64 overflow-y-auto\">\n        {devices.map(d=> (\n          <button key={d.id} onClick={()=>onConnect(d)} className=\"w-full text-left p-3 rounded-lg bg-black/20 hover:bg-black/30 border border-border\" data-testid=\"obd-device-item\">\n            <div className=\"flex items-center justify-between\">\n              <span className=\"font-medium\">{d.name}</span>\n              <span className=\"text-xs text-[hsl(210_10%_75%)]\">{d.rssi} dBm</span>\n            </div>\n            <div className=\"text-xs text-[hsl(210_10%_75%)]\">{d.protocol}</div>\n          </button>\n        ))}\n      </div>\n    </div>\n  )\n};"
    }
  },

  "buttons": {
    "tokens": {
      "--btn-radius": "0.625rem",
      "--btn-shadow": "0 4px 18px rgba(0,0,0,0.25)",
      "--btn-motion": "200ms cubic-bezier(0.2, 0.8, 0.2, 1)"
    },
    "variants": {
      "primary": "bg-[hsl(186_100%_53%)] text-black hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[hsl(186_100%_53%)]",
      "secondary": "bg-[hsl(215_14%_22%)] text-white hover:bg-[hsl(215_14%_26%)] focus-visible:ring-2 focus-visible:ring-[hsl(186_100%_53%)]",
      "ghost": "bg-transparent text-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[hsl(186_100%_53%)]"
    },
    "sizes": {
      "sm": "h-9 px-3 rounded-[var(--btn-radius)]",
      "md": "h-11 px-4 rounded-[var(--btn-radius)]",
      "lg": "h-12 px-6 rounded-[var(--btn-radius)]"
    },
    "notes": "Professional/Corporate style; glass subtly on secondary only for distinctiveness; always provide visible focus state."
  },

  "data_viz": {
    "charts": "Use Recharts for mobile-friendly charts.",
    "types": ["RadialBar for gauges", "AreaChart for time-series (RPM, speed)", "TinyLine for sparklines"],
    "empty_states": "Use muted placeholders with dashed borders and an inline description and a primary button.",
    "thresholds": {
      "coolant_c": {"warn": 105, "danger": 115},
      "oil_pressure_bar": {"warn": 1.2, "danger": 0.6},
      "battery_v": {"warn_low": 11.8, "danger_low": 11.3}
    },
    "legend": "Inline colored dots using --ok/--warn/--danger tokens with labels."
  },

  "alerts": {
    "toast": {
      "component_path": "/app/frontend/src/components/ui/sonner.jsx",
      "usage": "import { Toaster, toast } from './components/ui/sonner';\n<Toaster richColors/>; toast.error('Overheat detected');",
      "positions": "top-center on mobile to avoid keyboard; bottom-right on tablet."
    },
    "inline_alerts": "Use Alert component with strong left border using semantic colors.",
    "critical_modal": "AlertDialog for irreversible ECU programming operations. Require double-confirm checkbox."
  },

  "accessibility": {
    "contrast": "Maintain WCAG AA. Light text on dark surfaces >= 4.5:1.",
    "focus": "Use ring-2 ring-[hsl(186_100%_53%)] ring-offset-1 ring-offset-[hsl(213_22%_14%)] for keyboard/touch focus.",
    "motion": "Respect prefers-reduced-motion: disable gauge sweep animations, use instant value updates.",
    "aria": "Announce critical alerts via role='alert'; live values via aria-live=polite if they convey status changes.",
    "hit_areas": ">=44px height; avoid tightly packed toggles."
  },

  "grid_and_spacing": {
    "container": "mx-auto px-4 sm:px-5 lg:px-6 max-w-[1200px]",
    "gaps": "gap-4 sm:gap-5 lg:gap-6",
    "sections": "py-4 sm:py-6 lg:py-8",
    "cards": "rounded-xl border border-border bg-[hsl(214_24%_12%)]"
  },

  "micro_interactions": {
    "libraries": ["framer-motion"],
    "install": "npm i framer-motion",
    "examples": [
      {
        "name": "Card subtle lift",
        "jsx": "import {motion} from 'framer-motion';\nexport const LiftCard = ({children}) => (<motion.div whileHover={{y:-2}} transition={{duration:0.18}} className=\"rounded-xl border border-border bg-[hsl(214_24%_12%)]\" data-testid=\"lift-card\">{children}</motion.div>);"
      },
      {
        "name": "Connect pulse",
        "css": ".pulse{ box-shadow: 0 0 0 0 hsl(186 100% 53% / .7); animation: ring 1.2s ease-out infinite; } @keyframes ring{ to{ box-shadow: 0 0 0 12px hsl(186 100% 53% / 0);} }"
      }
    ],
    "rules": "Never use transition: all; transition only color, background-color, opacity, and box-shadow on interactive elements."
  },

  "screens": {
    "dashboard": {
      "layout": "Header with connection/status, then grid of gauges (RPM, Speed), stat cards (Coolant, Oil Pressure, Battery), and tiny live graphs.",
      "classes": "grid grid-cols-1 md:grid-cols-2 gap-4"
    },
    "dtc_scanner": {
      "layout": "Filter bar (search input, severity filter), List of DTC rows with expandable details, Clear All button.",
      "classes": "space-y-3"
    },
    "live_data": {
      "layout": "Tab switcher for categories (Engine, Transmission, Fuel). ScrollArea with pinning.",
      "classes": "space-y-3"
    },
    "ecu_program": {
      "layout": "Tabs for steps, FileDrop, options select, Progress, and Log textarea.",
      "classes": "space-y-4"
    },
    "vehicle": {
      "layout": "Definition grid for metadata and badges for statuses.",
      "classes": "space-y-4"
    },
    "obd_connect": {
      "layout": "Bottom sheet triggered from header connection pill.",
      "classes": ""
    }
  },

  "navigation": {
    "bottom_nav": "Use Menubar or custom bottom nav bar with 4-5 items. Active item uses accent dot and label. Buttons must include data-testid like data-testid=\"nav-dashboard-button\".",
    "top_tabs": "Use shadcn Tabs for subsections (e.g., Live Data categories)."
  },

  "component_path": {
    "shadcn": [
      "/app/frontend/src/components/ui/button.jsx",
      "/app/frontend/src/components/ui/tabs.jsx",
      "/app/frontend/src/components/ui/card.jsx",
      "/app/frontend/src/components/ui/accordion.jsx",
      "/app/frontend/src/components/ui/table.jsx",
      "/app/frontend/src/components/ui/scroll-area.jsx",
      "/app/frontend/src/components/ui/progress.jsx",
      "/app/frontend/src/components/ui/alert.jsx",
      "/app/frontend/src/components/ui/alert-dialog.jsx",
      "/app/frontend/src/components/ui/input.jsx",
      "/app/frontend/src/components/ui/select.jsx",
      "/app/frontend/src/components/ui/sheet.jsx",
      "/app/frontend/src/components/ui/badge.jsx",
      "/app/frontend/src/components/ui/menubar.jsx",
      "/app/frontend/src/components/ui/separator.jsx",
      "/app/frontend/src/components/ui/checkbox.jsx",
      "/app/frontend/src/components/ui/switch.jsx",
      "/app/frontend/src/components/ui/sonner.jsx"
    ],
    "third_party": ["recharts", "framer-motion", "react-dropzone"]
  },

  "libraries": {
    "recharts": {
      "install": "npm i recharts",
      "usage_note": "Prefer simple elements (RadialBar, Area, Line) for performance. Limit active animations to 30fps equivalent.",
      "example_jsx": "import { AreaChart, Area, ResponsiveContainer } from 'recharts';\nexport const Spark = ({data}) => (<div className=\"h-10 w-full\" data-testid=\"spark\"><ResponsiveContainer width=\"100%\" height=\"100%\"><AreaChart data={data}><Area type=\"monotone\" dataKey=\"v\" stroke=\"hsl(186 100% 53%)\" fill=\"hsl(186 100% 53% / .15)\" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>);"
    },
    "framer_motion": {
      "install": "npm i framer-motion",
      "usage_note": "Use for hover/tap and sheet/dialog entrances; disable for prefers-reduced-motion.",
      "example_jsx": "import {motion, useReducedMotion} from 'framer-motion';\nexport const FadeIn = ({children})=>{const reduce = useReducedMotion(); return <motion.div initial={{opacity:0,y:reduce?0:8}} animate={{opacity:1,y:0}} transition={{duration:0.25}} data-testid=\"fade-in\">{children}</motion.div>};"
    },
    "react_dropzone": {
      "install": "npm i react-dropzone",
      "usage_note": "Accept ECU file formats only; show error toast on invalid file."
    }
  },

  "testing_attributes": {
    "rule": "All interactive and key informational elements MUST include a data-testid attribute.",
    "format": "kebab-case that describes role, e.g., 'dtc-clear-button', 'ecu-start-program-button', 'obd-connect-sheet', 'live-sensor-row-speed'.",
    "examples": [
      "<button data-testid=\"nav-dashboard-button\">Dashboard</button>",
      "<input data-testid=\"dtc-search-input\" />",
      "<div data-testid=\"battery-voltage-value\">12.4V</div>"
    ]
  },

  "+tailwind_utilities": {
    "badges": "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
    "chips": {
      "ok": "bg-[hsl(146_64%_52%)] text-black",
      "warn": "bg-[hsl(38_97%_55%)] text-black",
      "danger": "bg-[hsl(2_85%_58%)] text-black"
    },
    "card": "rounded-xl border border-border bg-[hsl(214_24%_12%)]",
    "ring-accent": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(186_100%_53%)]"
  },

  "image_urls": [
    {"url": "https://images.unsplash.com/photo-1691840204491-f5c608613b68?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Wide workshop backdrop (hero/empty-state)", "category": "background"},
    {"url": "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Tire stacks in dark garage (section divider texture)", "category": "background"},
    {"url": "https://images.unsplash.com/photo-1658351354155-e854d19233e0?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Workbench with diagnostic laptop (ECU programming intro)", "category": "feature"},
    {"url": "https://images.unsplash.com/photo-1631972241361-330c704b90f1?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Cluttered shop aesthetic (subtle overlay with blur)", "category": "background"},
    {"url": "https://images.pexels.com/photos/7019602/pexels-photo-7019602.jpeg", "description": "Low light undercar inspection (alert context)", "category": "feature"},
    {"url": "https://images.pexels.com/photos/6720537/pexels-photo-6720537.jpeg", "description": "Mechanic with tablet near wheel (connection flow)", "category": "feature"}
  ],

  "iconography": {
    "library": "lucide-react via existing project setup (or FontAwesome CDN)",
    "usage": "Prefer line icons with 2px stroke for dark UI. Avoid emoji icons.",
    "mapping": {
      "dashboard": "Gauge icon",
      "dtc": "AlertTriangle icon with semantic colors",
      "live_data": "Activity icon",
      "ecu": "Cpu icon",
      "vehicle": "Car icon",
      "connect": "Bluetooth or Link icon"
    }
  },

  "instructions_to_main_agent": [
    "Add 'dark' class to html element by default for this app.",
    "Populate :root custom props in index.css according to tokens_hsl under color_system.",
    "Build a BottomNav component with 5 items and data-testid attributes for each.",
    "Compose Dashboard with GaugeCard (RPM/Speed) + 3 StatCards + Spark charts.",
    "Implement DTC page with search input, severity filter chips, and list of DtcRow.",
    "Add ECU Programming screen with FileDrop, option selects, progress, and AlertDialog before flashing.",
    "Implement OBDConnectSheet, trigger from header connection pill.",
    "Wire sonner.jsx Toaster at root and use toasts for connect/disconnect/critical alerts.",
    "Every button/input/value includes data-testid. Use kebab-case naming tied to role.",
    "Respect gradient rules; keep gradients for decorative section backgrounds only (<20% viewport)."
  ]
}


General UI UX Design Guidelines  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.