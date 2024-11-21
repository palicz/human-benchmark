import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
    user?: ExtendedUser;
    label: string;
}

export const UserInfo = ({
    user,
    label
}: UserInfoProps) => {
    return (
        <Card className="w-[600px] shadow-md mt-10">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {label}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-bold">
                        ID
                    </p>
                    <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-background text-secondary rounded-md">
                        {user?.id}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-bold">
                        Felhasználónév
                    </p>
                    <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-background text-secondary rounded-md">
                        {user?.name}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-bold">
                        Email cím
                    </p>
                    <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-background text-secondary rounded-md">
                        {user?.email}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-bold">
                        Fiók típus
                    </p>
                    <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-background text-secondary rounded-md">
                        {user?.role}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-bold">
                        Email cím állapot
                    </p>
                    <Badge variant={user?.emailVerified ? "success" : "destructive"}>
                        {user?.emailVerified ? "Megerősítve" : "Megerősítésre vár"}
                    </Badge>
                </div> 
            </CardContent>
        </Card>
    )
}