import { getAccount } from "@/actions/account";
import Setting from "./_components/setting";

interface AccountSettingsProps {
    params: {
        id: string;
    };
}

export default async function AccountSettings({
    params,
}: AccountSettingsProps) {
    const { id } = params;

    const account = await getAccount(id);
    if (account != null) {
        return <Setting account={account} />;
    } else {
        return null;
    }
}
