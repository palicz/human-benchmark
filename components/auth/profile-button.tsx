"use client";

import { useRouter } from 'next/navigation';

interface ProfileButtonProps {
    children?: React.ReactNode;
};

export const ProfileButton = ({
    children
}: ProfileButtonProps) => {
    const router = useRouter();

    const onClick = () => {
    router.push('/settings');
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}