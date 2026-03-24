import { AppShell } from '@/components/layout/AppShell';

export default function ObservationBoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
