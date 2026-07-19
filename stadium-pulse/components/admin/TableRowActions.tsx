"use client";

import { Edit, Trash2 } from "lucide-react";

interface TableRowActionsProps {
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
}

export function TableRowActions({ onEdit, onDelete }: TableRowActionsProps) {
  return (
    <td className="py-3 px-5 flex items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <Edit size={14} className="text-zinc-400" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        <Trash2 size={14} className="text-red-400" />
      </button>
    </td>
  );
}
