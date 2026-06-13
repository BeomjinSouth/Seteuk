import { readFile } from 'node:fs/promises';
import path from 'node:path';
import domainRuleData from '@/data/knowledge-domain-rules.json';
import { normalizeKnowledgeText as normalizeText } from '@/lib/knowledge-text';
import type { KnowledgeGraphLabels } from '@/types/knowledge';

/**
 * Runtime access to the offline graph-rag-labels dataset
 * (`npm run label:graph-rag` output). Fails open: if the label file is
 * missing or malformed, search continues without label signals.
 */

type RawGraphLabelEntry = {
    knowledgeUnitId?: string;
    graphLabels?: Partial<KnowledgeGraphLabels>;
};

type CachedLabelMap = {
    key: string;
    loadedAt: number;
    map: Map<string, KnowledgeGraphLabels>;
};

let labelCache: CachedLabelMap | null = null;

const CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_YEAR = process.env.KNOWLEDGE_YEAR || '2026';

const QUERY_DOMAIN_RULES: Array<[string, string[]]> = domainRuleData.domainRules.map((rule) => [
    rule.tag,
    rule.keywords,
]);

function getLabelCandidatePaths(year: string): string[] {
    const filename = `graph-rag-labels-${year}.json`;
    const override = process.env.GRAPH_RAG_LABELS_PATH;
    const candidates = override
        ? [override]
        : [path.resolve(process.cwd(), 'output', 'graph-rag-labels', filename)];
    return [...new Set(candidates)];
}

function normalizeLabels(raw: RawGraphLabelEntry['graphLabels']): KnowledgeGraphLabels {
    return {
        domainTags: Array.isArray(raw?.domainTags) ? raw.domainTags.filter((tag): tag is string => typeof tag === 'string') : [],
        policyTags: Array.isArray(raw?.policyTags) ? raw.policyTags.filter((tag): tag is string => typeof tag === 'string') : [],
        riskTags: Array.isArray(raw?.riskTags) ? raw.riskTags.filter((tag): tag is string => typeof tag === 'string') : [],
        workflowTags: Array.isArray(raw?.workflowTags) ? raw.workflowTags.filter((tag): tag is string => typeof tag === 'string') : [],
    };
}

export function clearKnowledgeLabelCache() {
    labelCache = null;
}

/**
 * Loads the graph label map keyed by knowledgeUnitId. Returns an empty map
 * when the label file is unavailable so callers never have to special-case it.
 */
export async function loadKnowledgeGraphLabelMap(
    year: string = DEFAULT_YEAR,
): Promise<Map<string, KnowledgeGraphLabels>> {
    const cacheKey = getLabelCandidatePaths(year).join('|');
    if (labelCache && labelCache.key === cacheKey && Date.now() - labelCache.loadedAt < CACHE_TTL_MS) {
        return labelCache.map;
    }

    const map = new Map<string, KnowledgeGraphLabels>();

    for (const filePath of getLabelCandidatePaths(year)) {
        try {
            const text = await readFile(filePath, 'utf8');
            const parsed = JSON.parse(text) as { labels?: RawGraphLabelEntry[] };
            for (const entry of parsed.labels ?? []) {
                if (!entry.knowledgeUnitId) continue;
                map.set(entry.knowledgeUnitId, normalizeLabels(entry.graphLabels));
            }
            break;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
                console.warn(`Failed to load graph rag labels from ${filePath}:`, error);
            }
        }
    }

    labelCache = { key: cacheKey, loadedAt: Date.now(), map };
    return map;
}

/** Detects which knowledge domains a free-text query touches. */
export function detectQueryDomainTags(query: string): string[] {
    const normalized = normalizeText(query);
    if (!normalized) return [];

    return QUERY_DOMAIN_RULES
        .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(normalizeText(keyword))))
        .map(([tag]) => tag);
}

/** Formats labels as a compact one-line summary for prompt evidence blocks. */
export function formatGraphLabelsForPrompt(labels: KnowledgeGraphLabels | undefined): string {
    if (!labels) return '';
    const tags = [...labels.domainTags, ...labels.policyTags, ...labels.riskTags];
    return tags.length > 0 ? tags.join(', ') : '';
}
