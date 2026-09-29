"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BeautifulModalProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isShowBtns?: boolean;
}

export function BeautifulModal({
  trigger,
  title,
  description,
  children,
  confirmText = "تأیید",
  cancelText = "انصراف",
  onConfirm,
  open,
  onOpenChange,
  isShowBtns = true,
}: BeautifulModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[480px] gap-0 overflow-hidden border-none bg-background p-0 shadow-2xl">
        {/* Header با گرادیان ملایم */}
        <div className="relative bg-gradient-to-br from-primary/10 via-background to-background px-6 pt-6 pb-4">
          <DialogHeader className="space-y-2 text-right">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        {/* محتوای اصلی */}
        {children && (
          <div className="px-6 py-5 text-sm text-muted-foreground">
            {children}
          </div>
        )}

        {/* Footer */}
        {isShowBtns && (
          <DialogFooter className="flex flex-row-reverse gap-3 border-t bg-muted/30 px-6 py-4">
            <Button
              onClick={onConfirm}
              className="min-w-[100px] rounded-lg"
            >
              {confirmText}
            </Button>
            <Button
              variant="outline"
              className="min-w-[100px] rounded-lg"
              onClick={() => onOpenChange?.(false)}
            >
              {cancelText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}