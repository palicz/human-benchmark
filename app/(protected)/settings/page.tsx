
import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";

const SettingsPage = async () => {
    const user = await currentUser();
    
    return (
        <div>
            <UserInfo label="Fiók adatok" user={user} />
        </div>
    )
}

export default SettingsPage;