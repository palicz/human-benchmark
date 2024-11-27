"use client";

import { Link } from "@/components/ui/link";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

interface AdminButtonProps {
    children?: React.ReactNode;
};

export const AdminButton = ({
    children
}: AdminButtonProps) => {
    const role = useCurrentRole();

    if (role !== UserRole.ADMIN) {
        return null;
    }

    return (
        <Link href="/admin">
            {children}
        </Link>
    )
}