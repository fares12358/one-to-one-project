"use client";

import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";

const ICON_SETS = { Fa: FaIcons, Fi: FiIcons };
const DEFAULT_ICON = "FaLeaf";

// Resolves a react-icons export name (e.g. "FaLeaf", "FiSearch") to its component.
// Falls back to a sensible default so a typo in the dashboard never breaks the page.
export default function DynamicIcon({ name, className }) {
  const resolve = (n) => {
    if (!n || typeof n !== "string") return null;
    const prefix = n.slice(0, 2);
    return ICON_SETS[prefix]?.[n] || null;
  };

  const Icon = resolve(name) || resolve(DEFAULT_ICON);
  if (!Icon) return null;
  return <Icon className={className} />;
}
