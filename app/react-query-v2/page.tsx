import { Header } from '@/components/Header';
import { UserPageTab } from './components/Tabs/PageTab';

export default function Page() {
    return (
        <>
            <section className="flex min-h-screen items-center justify-center">
                <UserPageTab />
            </section>
        </>
    )
}