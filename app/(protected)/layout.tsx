import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] });

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
    return (
        <div className={inter.className}>
            {children}
        </div>
    );
}
