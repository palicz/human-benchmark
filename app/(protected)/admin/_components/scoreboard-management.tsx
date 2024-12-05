"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Crosshair,
  Timer,
  ArrowUpDown,
  MoreVertical,
  Search,
  Palette,
  Eye, Bolt, Zap
} from "lucide-react";
import { Card } from "@/app/(protected)/admin/_components/admin-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type GameId = keyof typeof gameIcons;

const gameIcons = {
  "aim-trainer": { icon: Crosshair, color: "text-yellow-500" },
  "number-memory": { icon: Brain, color: "text-blue-500" },
  "typing-test": { icon: Timer, color: "text-green-500" },
  "stroop-test": { icon: Palette, color: "text-red-500" },
  "visual-memory": { icon: Eye, color: "text-purple-500" },
  "reaction-time":{icon:Zap,color:"text-cyan-500"}
};

export function ScoreboardManagement() {
  const [games, setGames] = useState<Array<{ id: GameId; name: string; scores: any[] }>>([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState("");

  const fetchScores = async () => {
    try {
      const response = await fetch('/api/admin/scores');
      if (!response.ok) throw new Error('Failed to fetch scores');
      const data = await response.json();
      setGames(data);
      if (!selectedGame && data.length > 0) {
        setSelectedGame(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to fetch scores");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (username: string) => {
    try {
      const response = await fetch(
        `/api/admin/scores?username=${encodeURIComponent(username)}&gameType=${encodeURIComponent(selectedGame)}`,
        {
          method: 'DELETE',
        }
      );
      
      if (!response.ok) throw new Error('Failed to delete score');
      
      toast.success("Score deleted successfully");
      fetchScores();
    } catch (error) {
      toast.error("Failed to delete score");
    }
  };

  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    fetchScores();
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Card
              key={game.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedGame === game.id
                  ? "ring-2 ring-primary"
                  : "hover:bg-secondary/50"
              }`}
              onClick={() => setSelectedGame(game.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-secondary ${gameIcons[game.id].color}`}>
                  {gameIcons[game.id].icon && React.createElement(gameIcons[game.id].icon, { className: "w-5 h-5" })}
                </div>
                <div>
                  <h3 className="font-semibold">{game.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {game.scores.length} entries
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              <Skeleton className="h-8 w-48" />
            </h2>
            <Button disabled>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    );
  }

  const currentGame = games.find(g => g.id === selectedGame);
  const filteredScores = currentGame?.scores.filter((score: any) =>
    score.username.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a: any, b: any) => {
    return sortOrder === 'asc' 
      ? a.rank - b.rank
      : b.rank - a.rank;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Card
            key={game.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedGame === game.id
                ? "ring-2 ring-primary"
                : "hover:bg-secondary/50"
            }`}
            onClick={() => setSelectedGame(game.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-secondary ${gameIcons[game.id].color}`}>
                {gameIcons[game.id].icon && React.createElement(gameIcons[game.id].icon, { className: "w-5 h-5" })}
              </div>
              <div>
                <h3 className="font-semibold">{game.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {game.scores.length} entries
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold">
            {currentGame?.name} Leaderboard
          </h2>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={toggleSort}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores?.map((score: any) => (
                <TableRow key={`${score.username}-${score.date}`}>
                  <TableCell>
                    <Badge 
                      variant={score.rank <= 3 ? "default" : "secondary"}
                      className={`
                        ${score.rank === 1 && "bg-yellow-500 hover:bg-yellow-600"}
                        ${score.rank === 2 && "bg-gray-400 hover:bg-gray-500"}
                        ${score.rank === 3 && "bg-amber-700 hover:bg-amber-800"}
                      `}
                    >
                      #{score.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {score.username}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {score.score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {format(new Date(score.date), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(score.date), "HH:mm:ss")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(score.username)}
                        >
                          Remove Entry
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
}