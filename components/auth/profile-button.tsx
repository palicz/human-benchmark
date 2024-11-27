"use client";

import { Link } from "@/components/ui/link";

interface ProfileButtonProps {
    children?: React.ReactNode;
};

export const ProfileButton = ({
    children
}: ProfileButtonProps) => {
    return (
        <Link href="/settings">
            {children}
        </Link>
    )
}