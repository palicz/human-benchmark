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
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";

export const UserButton = () => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="shadow-sm">
                    <AvatarImage src={user?.image ||""} />
                    <AvatarFallback className="bg-slate-800">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
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