"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ComponentProps } from "react";

export function Providers({ children }: { children: ComponentProps<typeof QueryClientProvider>["children"] }) {
	const [queryClient] = useState(() => new QueryClient());
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}