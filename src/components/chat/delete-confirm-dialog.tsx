'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

/**
 * A reusable confirmation dialog for delete operations
 */
export function DeleteConfirmDialog({
  onConfirm,
  onCancel,
  title = "Delete Chat?",
  message = "Are you sure you want to delete this chat? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false
}: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="relative bg-[#18181b] rounded-xl shadow-2xl p-7 max-w-sm w-full border border-white/10 flex flex-col">
        {/* Close (X) icon */}
        <button
          className="absolute top-3 right-3 text-white/40 hover:text-white/80 p-1 rounded transition-colors"
          onClick={onCancel}
          aria-label="Close dialog"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-white/70 mb-6 text-sm leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 border border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}