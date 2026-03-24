import { AppShell } from '@/components/layout/AppShell';

export default function RecordReviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
