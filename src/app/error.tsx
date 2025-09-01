"use client";

import ServerErrorPage from "@/components/pages/serverErrorPage";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Global error captured:", error);
  }, [error]);

  return (
 <div>
    <ServerErrorPage />
 </div>
  );
}
