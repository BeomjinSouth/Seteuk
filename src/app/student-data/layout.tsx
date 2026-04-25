import { AppShell } from '@/components/layout/AppShell';

export default function StudentDataLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
