"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserCog, Mail, Ban, CheckCircle, MoreVertical, Trophy, Zap, Brain, User, Timer, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/app/(protected)/admin/_components/admin-card";
import { Badge } from "@/app/(protected)/admin/_components/admin-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User as PrismaUser } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<PrismaUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PrismaUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [userStats, setUserStats] = useState<{
    aimScore: number | null;
    typeScore: number | null;
    score: number | null;
    ranks: {
      aimRank?: number;
      typeRank?: number;
      memoryRank?: number;
    };
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<PrismaUser | null>(null);

  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || ''
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LoadingRow = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[120px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[180px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[60px]" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );

  const fetchUserStats = async (userName: string) => {
    try {
        const response = await fetch(`/api/scores/${encodeURIComponent(userName)}`);
        if (response.ok) {
            const data = await response.json();
            setUserStats(data);
        } else if (response.status === 401) {
            console.error("Unauthorized access to user stats");
            setUserStats(null);
        } else {
            console.error("Error fetching user stats");
            setUserStats(null);
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
        setUserStats(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <LoadingRow />
                  <LoadingRow />
                  <LoadingRow />
                  <LoadingRow />
                  <LoadingRow />
                </>
              ) : filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.emailVerified ? "success" : "destructive"}
                    >
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={`${user.role === "ADMIN" ? "bg-red-500" : "bg-gray-500"} hover:no-underline hover:bg-opacity-100`}
                    >
                      {user.role === "ADMIN" ? (
                        <Shield className="h-4 w-4 text-white" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                          fetchUserStats(user.name || "");
                        }}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-500"
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold">User Statistics</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            {/* User Details Section */}
            <Card className="p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                User Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedUser?.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser?.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge 
                    variant="secondary"
                    className={`${selectedUser?.role === "ADMIN" ? "bg-red-500" : "bg-gray-500"} hover:no-underline hover:bg-opacity-100`}
                  >
                    {selectedUser?.role === "ADMIN" ? (
                      <Shield className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedUser?.emailVerified ? "success" : "destructive"}>
                    {selectedUser?.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Game Statistics Section */}
            <Card className="p-3 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Game Statistics
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <Card className="p-4 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-yellow-500/10">
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </div>
                    <h4 className="font-medium">Aim Trainer</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className="font-medium">{userStats?.aimScore ?? "No score"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rank</span>
                      <Badge variant="secondary">#{userStats?.ranks.aimRank ?? "N/A"}</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Brain className="h-4 w-4 text-blue-500" />
                    </div>
                    <h4 className="font-medium">Number Memory</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className="font-medium">{userStats?.score ?? "No score"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rank</span>
                      <Badge variant="secondary">#{userStats?.ranks.memoryRank ?? "N/A"}</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <Timer className="h-4 w-4 text-green-500" />
                    </div>
                    <h4 className="font-medium">Typing Test</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className="font-medium">{userStats?.typeScore ?? "No score"} WPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rank</span>
                      <Badge variant="secondary">#{userStats?.ranks.typeRank ?? "N/A"}</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-purple-500/10">
                      <Trophy className="h-4 w-4 text-purple-500" />
                    </div>
                    <h4 className="font-medium">Memory Test</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className="font-medium">
                        {[userStats?.aimScore, userStats?.typeScore, userStats?.score].filter(score => score !== null).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rank</span>
                      <span className="font-medium">
                        {/* TODO */}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </div>
          <DialogFooter className="sm:mt-2">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-destructive/10">
                <User className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="font-medium">{userToDelete?.name}</p>
                <p className="text-sm text-muted-foreground">{userToDelete?.email}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!userToDelete) return;
                
                try {
                  const response = await fetch(`/api/users/${userToDelete.id}`, {
                    method: 'DELETE',
                  });

                  if (!response.ok) {
                    throw new Error('Failed to delete user');
                  }

                  setUsers(users.filter(user => user.id !== userToDelete.id));
                  setIsDeleteModalOpen(false);
                } catch (error) {
                  console.error('Error deleting user:', error);
                }
              }}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}