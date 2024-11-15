"use client";

import { getAllUsers } from "@/actions/db";
import { RoleGate } from "@/components/auth/role-gate";
import { UserTable } from "@/components/user-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";

const AdminPage = () => {
    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    return (
        <Card className="w-[800px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Admin Panel
                </p>
            </CardHeader>
            <CardContent>
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <UserTable users={users} />
                </RoleGate>
            </CardContent>
        </Card>
    );
};

export default AdminPage;