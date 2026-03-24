import { AppShell } from '@/components/layout/AppShell';

export default function CounselChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
