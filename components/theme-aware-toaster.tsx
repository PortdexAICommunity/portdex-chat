"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ThemeAwareToaster() {
	const { theme } = useTheme();
	return <Toaster position="bottom-center" richColors theme={theme as any} />;
}
