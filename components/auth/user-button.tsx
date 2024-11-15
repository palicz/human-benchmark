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

import { FaUser } from "react-icons/fa";
import { LogOut, Shield, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { ProfileButton } from "@/components/auth/profile-button";
import { AdminButton } from "./admin-button";

export const UserButton = () => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="shadow-sm">
                    <AvatarImage src={user?.image || undefined} alt={user?.name || "Profil"}/>
                        <AvatarFallback className="bg-slate-800">
                            <FaUser className="text-white"/>
                        </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <ProfileButton>
                    <DropdownMenuItem>
                        <User className="h-4" />
                        Profil
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
                        Kijelentkezés
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}