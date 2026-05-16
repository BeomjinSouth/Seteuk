import GroupSurveyPageClient from './GroupSurveyPageClient';

export default async function GroupSurveyPage({
    params,
}: {
    params: Promise<{ accessCode: string }>;
}) {
    const { accessCode } = await params;
    return <GroupSurveyPageClient accessCode={accessCode} />;
}
