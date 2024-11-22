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
          <TableHead className="text-white font-bold">ID</TableHead>
          <TableHead className="text-white font-bold">Név</TableHead>
          <TableHead className="text-white font-bold">Email</TableHead>
          <TableHead className="text-white font-bold">Rang</TableHead>
          <TableHead className="text-white font-bold">Email állapot</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium text-white">{user.id}</TableCell>
            <TableCell className="text-white">{user.name}</TableCell>
            <TableCell className="text-white">{user.email}</TableCell>
            <TableCell className="text-white">{user.role}</TableCell>
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
