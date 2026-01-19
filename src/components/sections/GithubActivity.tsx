import { getGithubData } from '@/lib/github';
import GithubActivityClient from './GithubActivityClient';

export default async function GithubActivity() {
    const user = await getGithubData();

    if (!user) {
        return null; // Or render a fallback UI
    }

    return <GithubActivityClient user={user} />;
}
