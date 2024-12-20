"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"

import { LogOut, Shield, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { ProfileButton } from "@/components/auth/profile-button";
import { AdminButton } from "./admin-button";
import { Link } from "@/components/ui/link";

export const UserButton = () => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Link href="/settings">
                <Avatar className="shadow-sm">
                    <AvatarImage src={user?.image || undefined} alt={user?.name || "Profil"}/>
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500">
                        <span className="text-xl font-bold text-white">
                            {user?.name?.charAt(0)}
                        </span>
                    </AvatarFallback>
                </Avatar>
                </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <ProfileButton>
                    <DropdownMenuItem>
                        <User className="h-4" />
                        Profile
                    </DropdownMenuItem>
                </ProfileButton>
                <AdminButton>
                    <DropdownMenuItem>
                        <Shield className="h-4" />
                        Admin
                    </DropdownMenuItem>
                </AdminButton>
                <LogoutButton>
                    <DropdownMenuItem>
                        <LogOut className="h-4"/>
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}