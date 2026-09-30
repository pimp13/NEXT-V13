import { QueryProvider } from '../react-query-v2/providers/QueryProvider';

export default function Authorationlayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>{children}</QueryProvider>
    )
}