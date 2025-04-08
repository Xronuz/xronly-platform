"use client";

import { LoginDialog } from "@/components/auth/LoginDialog";
import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center" style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Dialog defaultOpen onOpenChange={(open) => !open && router.push("/")}>
        <LoginDialog />
      </Dialog>
    </main>
  );
}
