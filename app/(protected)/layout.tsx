import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import SimpleNavbar from "@/components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const session = await auth();
  
    return (
      <SessionProvider session={session}>
        <div>
            <SimpleNavbar />
            <div className="min-h-[calc(100vh-40rem)] w-full flex flex-col gap-y-10 items-center justify-center">
             {children}
            </div>
        </div>
      </SessionProvider>
    );
}
