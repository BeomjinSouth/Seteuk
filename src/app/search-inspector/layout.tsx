import { AppShell } from '@/components/layout/AppShell';

export default function SearchInspectorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
