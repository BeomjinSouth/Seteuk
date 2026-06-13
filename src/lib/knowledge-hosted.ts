import OpenAI from 'openai';
import { buildKnowledgeUnitId, loadKnowledgeDataset } from '@/lib/knowledge-base';
import { loadKnowledgeGraphLabelMap } from '@/lib/knowledge-labels';
import type { CanonicalKnowledgeEntry, RetrievedKnowledgeEvidence } from '@/types/knowledge';

type SyncParams = {
    year?: string;
    vectorStoreId?: string;
    offset?: number;
    batchSize?: number;
};

type HostedSearchParams = {
    query: string;
    schoolLevel?: string;
    category?: string;
    year?: number;
    limit?: number;
    vectorStoreId?: string;
};

function getClient(): OpenAI {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is required for hosted knowledge operations.');
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getVectorStoreId(override?: string): string | null {
    return override || process.env.OPENAI_VECTOR_STORE_ID || null;
}

/** True when hosted (vector store) semantic search can be used. */
export function isHostedKnowledgeConfigured(): boolean {
    return Boolean(process.env.OPENAI_API_KEY && getVectorStoreId());
}

function buildHostedMarkdown(entry: CanonicalKnowledgeEntry): string {
    const sources = entry.sources
        .map((source) => `- ${source.sourceType}:${source.sourceId} | ${source.url}`)
        .join('\n');

    return [
        `# ${entry.title}`,
        '',
        `question_key: ${entry.questionKey}`,
        `source_type: ${entry.sourceType}`,
        `effective_date: ${entry.effectiveDate ?? 'unknown'}`,
        `school_levels: ${entry.schoolLevels.join(', ')}`,
        `categories: ${entry.categories.join(', ') || '-'}`,
        `resolution: ${entry.resolution}`,
        '',
        '## Question',
        entry.question,
        '',
        '## Answer',
        entry.answer,
        '',
        '## Sources',
        sources,
    ].join('\n');
}

function toFileName(entry: CanonicalKnowledgeEntry, index: number): string {
    const safeTitle = entry.title
        .normalize('NFKC')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
    return `${String(index + 1).padStart(4, '0')}-${safeTitle || 'knowledge'}.md`;
}

function buildAttributeValue(values: string[]): string {
    return values.join('|').slice(0, 500);
}

export async function syncKnowledgeToVectorStore({
    year = '2026',
    vectorStoreId,
    offset = 0,
    batchSize = 20,
}: SyncParams) {
    const client = getClient();
    const dataset = await loadKnowledgeDataset(year);
    const vectorStore =
        getVectorStoreId(vectorStoreId)
            ? { id: getVectorStoreId(vectorStoreId)! }
            : await client.vectorStores.create({
                name: `student-record-knowledge-${year}`,
                description: `STAR FAQ/Q&A knowledge sync for year ${year}`,
                metadata: {
                    year,
                    source: 'student-record-knowledge',
                },
            });

    const batch = dataset.canonicalEntries.slice(offset, offset + batchSize);
    const uploaded: Array<{ title: string; filename: string; fileId: string }> = [];

    for (let index = 0; index < batch.length; index += 1) {
        const entry = batch[index];
        const filename = toFileName(entry, offset + index);
        const content = buildHostedMarkdown(entry);
        const file = new File([content], filename, { type: 'text/markdown' });

        const vectorStoreFile = await client.vectorStores.files.uploadAndPoll(vectorStore.id, file, {
            pollIntervalMs: 1500,
        });

        await client.vectorStores.files.update(vectorStoreFile.id, {
            vector_store_id: vectorStore.id,
            attributes: {
                // Stable join key back to the local dataset (titles get truncated).
                knowledge_unit_id: buildKnowledgeUnitId(entry),
                title: entry.title.slice(0, 120),
                source_type: entry.sourceType,
                school_levels: buildAttributeValue(entry.schoolLevels),
                categories: buildAttributeValue(entry.categories),
                effective_date: entry.effectiveDate ?? 'unknown',
                primary_url: entry.sourceUrls[0] ?? '',
            },
        });

        uploaded.push({
            title: entry.title,
            filename,
            fileId: vectorStoreFile.id,
        });
    }

    return {
        vectorStoreId: vectorStore.id,
        uploadedCount: uploaded.length,
        nextOffset: offset + uploaded.length,
        remaining: Math.max(0, dataset.canonicalEntries.length - (offset + uploaded.length)),
        uploaded,
    };
}

export async function searchHostedKnowledge({
    query,
    schoolLevel,
    category,
    year = 2026,
    limit = 6,
    vectorStoreId,
}: HostedSearchParams): Promise<RetrievedKnowledgeEvidence[]> {
    const client = getClient();
    const activeVectorStoreId = getVectorStoreId(vectorStoreId);
    if (!activeVectorStoreId) {
        throw new Error('OPENAI_VECTOR_STORE_ID is not configured.');
    }

    const dataset = await loadKnowledgeDataset(String(year));
    const labelMap = await loadKnowledgeGraphLabelMap(String(year));
    // Primary join: stable knowledge_unit_id attribute. Title join remains as a
    // fallback for files uploaded before the attribute existed.
    const unitMap = new Map(dataset.canonicalEntries.map((entry) => [buildKnowledgeUnitId(entry), entry]));
    const titleMap = new Map(dataset.canonicalEntries.map((entry) => [entry.title, entry]));
    const queryParts = [
        query,
        schoolLevel ? `학교급: ${schoolLevel}` : '',
        category ? `구분: ${category}` : '',
        year ? `연도: ${year}` : '',
    ].filter(Boolean);

    const page = await client.vectorStores.search(activeVectorStoreId, {
        query: queryParts.join('\n'),
        max_num_results: limit,
        rewrite_query: true,
    });

    return page.data.map((item) => {
        const title = String(item.attributes?.title || item.filename || 'Untitled');
        const attributeUnitId = String(item.attributes?.knowledge_unit_id || '').trim();
        const local = (attributeUnitId ? unitMap.get(attributeUnitId) : undefined) || titleMap.get(title);
        const knowledgeUnitId = attributeUnitId || (local ? buildKnowledgeUnitId(local) : item.file_id);
        const snippet = item.content.map((content) => content.text).join('\n').slice(0, 320);

        return {
            knowledgeUnitId,
            title: local?.title || title,
            question: local?.question || snippet,
            answer: local?.answer || snippet,
            ruleSummary: local?.resolution || null,
            schoolLevels: local?.schoolLevels || String(item.attributes?.school_levels || '').split('|').filter(Boolean),
            categories: local?.categories || String(item.attributes?.categories || '').split('|').filter(Boolean),
            effectiveYear: local?.effectiveDate ? Number(local.effectiveDate.slice(0, 4)) : year,
            sourceBoard: local?.sourceType === 'faq' ? 'faq' : local?.sourceType === 'qna' ? 'qa' : 'mixed',
            resolution: local?.resolution || 'Hosted vector store search result',
            duplicateCount: local?.duplicateCount || 1,
            variantCount: local?.variantCount || 1,
            sourceUrls: local?.sourceUrls || [String(item.attributes?.primary_url || '').trim()].filter(Boolean),
            sources: local?.sources || [],
            policyAnchors: [],
            graphLabels: labelMap.get(knowledgeUnitId),
            score: item.score,
            snippet,
        };
    });
}
