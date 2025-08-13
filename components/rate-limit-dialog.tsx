'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GUEST_MESSAGE_LIMIT } from '@/lib/ai/entitlements';

interface RateLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RateLimitDialog = ({
  open,
  onOpenChange,
}: RateLimitDialogProps) => {
  const router = useRouter();

  const handleSignIn = () => {
    onOpenChange(false);
    router.push('/login');
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden rounded-xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-2xl p-0">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 -right-24 size-48 rounded-full bg-purple-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 size-48 rounded-full bg-indigo-400/20 blur-3xl" />
          </div>

          <div className="px-6 pt-6 pb-2">
            <DialogHeader>
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-purple-300 text-white">
                <span aria-hidden className="text-3xl text-purple-800">
                  ⚠
                </span>
              </div>
              <DialogTitle className="text-center text-xl font-semibold">
                Message limit reached
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                You&apos;ve reached your limit of{' '}
                <span className="font-semibold">{GUEST_MESSAGE_LIMIT}</span>{' '}
                messages as a guest. Sign in to continue the conversation with
                unlimited access.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6">
            <div className="mb-4 grid grid-cols-2 gap-3 text-center text-xs text-muted-foreground">
              <div className="rounded-md border bg-card px-3 py-2">
                <div className="text-2xl">✦</div>
                <div>Unlimited messages</div>
              </div>
              <div className="rounded-md border bg-card px-3 py-2">
                <div className="text-xl">✔︎</div>
                <div>Save chat history</div>
              </div>
              <div className="rounded-md border bg-card px-3 py-2">
                <div className="text-xl">✔︎</div>
                <div>Marketplace</div>
              </div>
              <div className="rounded-md border bg-card px-3 py-2">
                <div className="text-2xl">✦</div>
                <div>Premium features</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleSignIn}
                className="w-full"
                size="lg"
                aria-label="Sign in to continue"
              >
                Sign in / Create new account
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                className="w-full"
                aria-label="Cancel and stay as guest"
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
