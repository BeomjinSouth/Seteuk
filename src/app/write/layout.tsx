import { AppShell } from '@/components/layout/AppShell';

export default function WriteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
