"use client";

import { useRouter } from 'next/navigation';
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

interface AdminButtonProps {
    children?: React.ReactNode;
};

export const AdminButton = ({
    children
}: AdminButtonProps) => {
    const role = useCurrentRole();
    const router = useRouter();

    if (role !== UserRole.ADMIN) {
        return null;
    }

    const onClick = () => {
        router.push('/admin');
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}