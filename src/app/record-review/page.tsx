import { redirect } from 'next/navigation';

type RecordReviewPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeQueryValue(value: string | string[] | undefined) {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export default async function RecordReviewPage({ searchParams }: RecordReviewPageProps) {
    const resolvedSearchParams = await searchParams;
    const nextParams = new URLSearchParams();

    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
        const normalizedValue = normalizeQueryValue(value);
        if (normalizedValue) {
            nextParams.set(key, normalizedValue);
        }
    });

    nextParams.set('mode', 'review');

    redirect(`/counsel-chat?${nextParams.toString()}`);
}
