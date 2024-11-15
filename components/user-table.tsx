"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "@prisma/client";

interface UserTableProps {
  users: User[] | null;
}

export const UserTable = ({ users }: UserTableProps) => {
  if (!users) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Név</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rang</TableHead>
          <TableHead>Email állapot</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Badge variant={user.emailVerified ? "success" : "destructive"}>
                {user.emailVerified ? "Megerősítve" : "Megerősítésre vár"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
