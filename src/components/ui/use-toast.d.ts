import * as React from "react";

export interface ToastActionElement extends React.ReactElement {}

export interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
}

export function toast(props: Omit<ToastProps, "id">): {
  id: string;
  dismiss: () => void;
  update: (props: ToastProps) => void;
};

export function useToast(): {
  toast: typeof toast;
  dismiss: (toastId?: string) => void;
  toasts: ToastProps[];
};
