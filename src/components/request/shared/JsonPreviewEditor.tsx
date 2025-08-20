import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

export const getJsonTheme = (theme: string | undefined) => {
  if (theme === "dark") {
    return {
      base00: "transparent", // background
      base01: "#1f2937", // lighter background
      base02: "#374151", // selection background
      base03: "#6b7280", // comments
      base04: "#9ca3af", // dark foreground
      base05: "#f9fafb", // default foreground
      base06: "#f3f4f6", // light foreground
      base07: "#ffffff", // light background
      base08: "#ef4444", // red
      base09: "#f97316", // orange
      base0A: "#eab308", // yellow
      base0B: "#22c55e", // green
      base0C: "#06b6d4", // cyan
      base0D: "#3b82f6", // blue
      base0E: "#a855f7", // purple
      base0F: "#f59e0b", // brown
    };
  } else {
    return {
      base00: "transparent", // background
      base01: "#f8fafc", // lighter background
      base02: "#e2e8f0", // selection background
      base03: "#64748b", // comments
      base04: "#475569", // dark foreground
      base05: "#1e293b", // default foreground
      base06: "#0f172a", // light foreground
      base07: "#020617", // light background
      base08: "#dc2626", // red
      base09: "#ea580c", // orange
      base0A: "#d97706", // yellow
      base0B: "#16a34a", // green
      base0C: "#0891b2", // cyan
      base0D: "#2563eb", // blue
      base0E: "#9333ea", // purple
      base0F: "#c2410c", // brown
    };
  }
};

export default function JsonPreviewEditor({
  json,
  edit = false,
  onEdit = () => {},
}: {
  json: any;
  edit: boolean;
  onEdit?: (newJson: any) => void;
}) {
  const theme = useTheme();

  const jsonTheme = getJsonTheme(theme.theme);

  if (edit) {
    return <ReactJson src={json} theme={jsonTheme} onEdit={onEdit} />;
  }
  return <ReactJson src={json} theme={jsonTheme} />;
}
