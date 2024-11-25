import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function AdminHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 pb-6"
    >
      <div className="p-3 rounded-full bg-primary">
        <ShieldCheck className="w-8 h-8 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and game scoreboards</p>
      </div>
    </motion.div>
  );
}