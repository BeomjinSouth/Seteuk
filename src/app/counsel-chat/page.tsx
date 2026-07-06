'use client';

import { type CSSProperties, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    BrainCircuit,
    Bot,
    CalendarRange,
    CheckCircle2,
    ChevronDown,
    FileText,
    GraduationCap,
    Link2,
    ListChecks,
    MessageSquareQuote,
    Network,
    PanelRightOpen,
    Quote,
    Route,
    SearchCheck,
    ShieldCheck,
    SlidersHorizontal,
    Tag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type {
    CounselChatResponse,
    GraphRagAnswerSpan,
    GraphRagEdge,
    GraphRagNode,
    GraphRagResponse,
    KnowledgeMeta,
    RecordReviewIssue,
    RecordReviewResponse,
} from '@/types/knowledge';
import styles from './page.module.css';

type AssistantMode = 'counsel' | 'review' | 'graph';

type GraphMapNodeType = GraphRagNode['type'] | 'keyword';

type GraphMapNode = {
    id: string;
    type: GraphMapNodeType;
    label: string;
    sublabel: string | null;
    x: number;
    y: number;
    radius: number;
    opacity: number;
    isCore: boolean;
    matchId?: string;
    sourceUrl?: string | null;
};

type GraphMapEdge = {
    id: string;
    from: string;
    to: string;
    strength: number;
    kind: 'primary' | 'satellite';
    matchId?: string;
};

type GraphMap = {
    nodes: GraphMapNode[];
    edges: GraphMapEdge[];
};

const GRAPH_MAP_WIDTH = 1000;
const GRAPH_MAP_HEIGHT = 1000;
const GRAPH_MAP_CENTER_X = GRAPH_MAP_WIDTH / 2;
const GRAPH_MAP_CENTER_Y = GRAPH_MAP_HEIGHT / 2;
const GRAPH_MAP_PADDING = 30;

const SAMPLE_QUESTIONS = [
    '출석인정 결석의 증빙 서류는 어디까지 필요한가요?',
    '세특에 학생 이름을 직접 써도 되나요?',
    '창의적 체험활동 누가기록은 어떻게 관리해야 하나요?',
];

const SAMPLE_RECORD_TEXTS = [
    '학생은 지역 대학 탐방 활동에서 우수한 태도를 보였으며 최고 수준의 발표 역량을 바탕으로 진로 설계 내용을 구체적으로 정리함.',
    '학생은 교내 활동 전반에서 성실하였고 모든 분야에서 뛰어난 리더십을 보였으며 항상 모범적인 태도를 유지함.',
];

const REVIEW_STATUS_LABELS: Record<RecordReviewResponse['status'], string> = {
    pass: '통과',
    caution: '주의',
    revise: '수정 권장',
    needs_manual_review: '수동 확인',
};

const SEVERITY_LABELS: Record<RecordReviewIssue['severity'], string> = {
    low: '낮음',
    medium: '중간',
    high: '높음',
};

const ISSUE_TYPE_LABELS: Record<RecordReviewIssue['issueType'], string> = {
    prohibited_named_entity: '금지 인명·고유명사',
    certificate_fact_out_of_scope: '자격증 기재 범위 점검',
    award_scope_violation: '수상 기재 범위 점검',
    attendance_note_rule_risk: '출결 관련 문구 점검',
    subject_detail_style_risk: '교과 세특 문체 점검',
    objectivity_risk: '객관성 부족 위험',
    unsupported_claim_risk: '근거 부족 표현 위험',
    year_mismatch_risk: '연도 기준 불일치 위험',
    needs_manual_review: '수동 확인 필요',
};

const GRAPH_NODE_LABELS: Record<GraphMapNodeType, string> = {
    query: '질문',
    ontology: '기준',
    knowledge: '지식',
    source: '출처',
    answer: '답변',
    keyword: '연결어',
};

function clampNumber(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function hashString(value: string): number {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function hashUnit(value: string, salt: string | number): number {
    return (hashString(`${value}:${salt}`) % 10000) / 10000;
}


function extractKeywordLabels(value: string, fallback: string | null, limit: number): string[] {
    const raw = `${value} ${fallback ?? ''}`
        .normalize('NFKC')
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .map((item) => item.trim())
        .filter((item) => item.length >= 2 && !['FAQ', 'QNA', 'QA'].includes(item.toUpperCase()));
    const seen = new Set<string>();
    const keywords: string[] = [];

    for (const item of raw) {
        const label = item.length > 8 ? item.slice(0, 8) : item;
        if (seen.has(label)) continue;
        seen.add(label);
        keywords.push(label);
        if (keywords.length >= limit) return keywords;
    }

    return keywords.length > 0 ? keywords : [fallback ?? value];
}

function graphNodeRadius(node: GraphRagNode): number {
    if (node.type === 'query') return 10.5;
    if (node.type === 'answer') return 9.2;
    if (node.type === 'ontology') return 6.8;
    if (node.type === 'knowledge') return 5.8;
    return 5;
}

function addGraphMapNode(
    nodeMap: Map<string, GraphMapNode>,
    node: GraphRagNode,
    x: number,
    y: number,
): GraphMapNode {
    const nextNode: GraphMapNode = {
        id: node.id,
        type: node.type,
        label: node.label,
        sublabel: node.sublabel,
        x: clampNumber(x, 48, GRAPH_MAP_WIDTH - 48),
        y: clampNumber(y, 48, GRAPH_MAP_HEIGHT - 48),
        radius: graphNodeRadius(node),
        opacity: 1,
        isCore: true,
        matchId: node.matchId,
        sourceUrl: node.sourceUrl,
    };
    nodeMap.set(nextNode.id, nextNode);
    return nextNode;
}

function getGraphMapBounds(nodes: GraphMapNode[]) {
    return {
        minX: Math.min(...nodes.map((node) => node.x - node.radius)),
        maxX: Math.max(...nodes.map((node) => node.x + node.radius)),
        minY: Math.min(...nodes.map((node) => node.y - node.radius)),
        maxY: Math.max(...nodes.map((node) => node.y + node.radius)),
    };
}

function expandGraphMapToCanvas(nodeMap: Map<string, GraphMapNode>) {
    const nodes = [...nodeMap.values()];
    if (nodes.length === 0) return;

    const bounds = getGraphMapBounds(nodes);
    const currentWidth = Math.max(1, bounds.maxX - bounds.minX);
    const currentHeight = Math.max(1, bounds.maxY - bounds.minY);
    const targetWidth = GRAPH_MAP_WIDTH * 0.9;
    const targetHeight = GRAPH_MAP_HEIGHT * 0.9;
    const scaleX = clampNumber(targetWidth / currentWidth, 1, 1.85);
    const scaleY = clampNumber(targetHeight / currentHeight, 1, 1.85);

    for (const node of nodes) {
        node.x = clampNumber(
            GRAPH_MAP_CENTER_X + (node.x - GRAPH_MAP_CENTER_X) * scaleX,
            GRAPH_MAP_PADDING + node.radius,
            GRAPH_MAP_WIDTH - GRAPH_MAP_PADDING - node.radius,
        );
        node.y = clampNumber(
            GRAPH_MAP_CENTER_Y + (node.y - GRAPH_MAP_CENTER_Y) * scaleY,
            GRAPH_MAP_PADDING + node.radius,
            GRAPH_MAP_HEIGHT - GRAPH_MAP_PADDING - node.radius,
        );
    }

    const expandedBounds = getGraphMapBounds(nodes);
    const offsetX = clampNumber(
        GRAPH_MAP_CENTER_X - (expandedBounds.minX + expandedBounds.maxX) / 2,
        GRAPH_MAP_PADDING - expandedBounds.minX,
        GRAPH_MAP_WIDTH - GRAPH_MAP_PADDING - expandedBounds.maxX,
    );
    const offsetY = clampNumber(
        GRAPH_MAP_CENTER_Y - (expandedBounds.minY + expandedBounds.maxY) / 2,
        GRAPH_MAP_PADDING - expandedBounds.minY,
        GRAPH_MAP_HEIGHT - GRAPH_MAP_PADDING - expandedBounds.maxY,
    );

    for (const node of nodes) {
        node.x = clampNumber(
            node.x + offsetX,
            GRAPH_MAP_PADDING + node.radius,
            GRAPH_MAP_WIDTH - GRAPH_MAP_PADDING - node.radius,
        );
        node.y = clampNumber(
            node.y + offsetY,
            GRAPH_MAP_PADDING + node.radius,
            GRAPH_MAP_HEIGHT - GRAPH_MAP_PADDING - node.radius,
        );
    }
}

function buildObsidianGraphMap(nodes: GraphRagNode[], edges: GraphRagEdge[]): GraphMap {
    const nodeMap = new Map<string, GraphMapNode>();
    const query = nodes.find((node) => node.type === 'query');
    const answer = nodes.find((node) => node.type === 'answer');
    const ontologyNodes = nodes.filter((node) => node.type === 'ontology');
    const knowledgeNodes = nodes.filter((node) => node.type === 'knowledge');
    const sourceNodes = nodes.filter((node) => node.type === 'source');
    const otherNodes = nodes.filter((node) => !['query', 'answer', 'ontology', 'knowledge', 'source'].includes(node.type));

    if (query) addGraphMapNode(nodeMap, query, GRAPH_MAP_CENTER_X, GRAPH_MAP_CENTER_Y);
    if (answer) addGraphMapNode(nodeMap, answer, GRAPH_MAP_CENTER_X + 84, GRAPH_MAP_CENTER_Y + 52);

    ontologyNodes.forEach((node, index) => {
        const total = Math.max(ontologyNodes.length, 1);
        const angle = -Math.PI / 2 + (index / total) * Math.PI * 2 + (hashUnit(node.id, 'angle') - 0.5) * 0.4;
        const radius = 190 + hashUnit(node.id, 'radius') * 74;
        addGraphMapNode(
            nodeMap,
            node,
            GRAPH_MAP_CENTER_X + Math.cos(angle) * radius,
            GRAPH_MAP_CENTER_Y + Math.sin(angle) * radius,
        );
    });

    knowledgeNodes.forEach((node, index) => {
        const linkedOntology = edges
            .filter((edge) => edge.to === node.id)
            .map((edge) => nodeMap.get(edge.from))
            .filter((item): item is GraphMapNode => Boolean(item));
        const anchor = linkedOntology[0];
        const total = Math.max(knowledgeNodes.length, 1);
        const fallbackAngle = -0.4 + (index / total) * Math.PI * 2 + (hashUnit(node.id, 'angle') - 0.5) * 0.5;
        const angle = anchor
            ? Math.atan2(anchor.y - GRAPH_MAP_CENTER_Y, anchor.x - GRAPH_MAP_CENTER_X) + (hashUnit(node.id, 'spread') - 0.5) * 0.85
            : fallbackAngle;
        const radius = 330 + hashUnit(node.id, 'radius') * 126;
        addGraphMapNode(
            nodeMap,
            node,
            GRAPH_MAP_CENTER_X + Math.cos(angle) * radius,
            GRAPH_MAP_CENTER_Y + Math.sin(angle) * radius,
        );
    });

    sourceNodes.forEach((node, index) => {
        const linkedKnowledge = knowledgeNodes.find((knowledge) => knowledge.matchId === node.matchId);
        const anchor = linkedKnowledge ? nodeMap.get(linkedKnowledge.id) : undefined;
        const total = Math.max(sourceNodes.length, 1);
        const fallbackAngle = 0.35 + (index / total) * Math.PI * 2 + (hashUnit(node.id, 'angle') - 0.5) * 0.55;
        const angle = anchor
            ? Math.atan2(anchor.y - GRAPH_MAP_CENTER_Y, anchor.x - GRAPH_MAP_CENTER_X) + (hashUnit(node.id, 'spread') - 0.5) * 0.75
            : fallbackAngle;
        const radius = anchor ? 122 + hashUnit(node.id, 'radius') * 76 : 410 + hashUnit(node.id, 'radius') * 116;
        addGraphMapNode(
            nodeMap,
            node,
            (anchor?.x ?? GRAPH_MAP_CENTER_X) + Math.cos(angle) * radius,
            (anchor?.y ?? GRAPH_MAP_CENTER_Y) + Math.sin(angle) * radius,
        );
    });

    otherNodes.forEach((node, index) => {
        const total = Math.max(otherNodes.length, 1);
        const angle = (index / total) * Math.PI * 2 + hashUnit(node.id, 'angle') * 0.6;
        const radius = 390 + hashUnit(node.id, 'radius') * 150;
        addGraphMapNode(
            nodeMap,
            node,
            GRAPH_MAP_CENTER_X + Math.cos(angle) * radius,
            GRAPH_MAP_CENTER_Y + Math.sin(angle) * radius,
        );
    });

    const graphEdges: GraphMapEdge[] = edges
        .filter((edge) => nodeMap.has(edge.from) && nodeMap.has(edge.to))
        .map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            return {
                id: edge.id,
                from: edge.from,
                to: edge.to,
                strength: edge.strength,
                kind: 'primary',
                matchId: from?.matchId ?? to?.matchId,
            };
        });

    const satelliteParents = [...nodeMap.values()].filter((node) => node.type !== 'query' && node.type !== 'answer');
    for (const parent of satelliteParents) {
        const satelliteCount = parent.type === 'ontology' ? 5 : parent.type === 'knowledge' ? 6 : 4;
        const labels = extractKeywordLabels(parent.label, parent.sublabel, satelliteCount);
        let previousSatelliteId = '';

        labels.forEach((label, index) => {
            const angle = hashUnit(parent.id, `satellite-angle-${index}`) * Math.PI * 2;
            const radius = 58 + hashUnit(parent.id, `satellite-radius-${index}`) * (parent.type === 'knowledge' ? 138 : 106);
            const satelliteId = `${parent.id}:keyword:${index}`;
            const satellite: GraphMapNode = {
                id: satelliteId,
                type: 'keyword',
                label,
                sublabel: parent.label,
                x: clampNumber(parent.x + Math.cos(angle) * radius, 20, GRAPH_MAP_WIDTH - 20),
                y: clampNumber(parent.y + Math.sin(angle) * radius, 20, GRAPH_MAP_HEIGHT - 20),
                radius: 2.1 + hashUnit(parent.id, `satellite-size-${index}`) * 1.5,
                opacity: 0.52 + hashUnit(parent.id, `satellite-opacity-${index}`) * 0.3,
                isCore: false,
                matchId: parent.matchId,
                sourceUrl: parent.sourceUrl,
            };
            nodeMap.set(satelliteId, satellite);
            graphEdges.push({
                id: `${parent.id}:to:${satelliteId}`,
                from: parent.id,
                to: satelliteId,
                strength: 0.62,
                kind: 'satellite',
                matchId: parent.matchId,
            });
            if (previousSatelliteId && hashUnit(satelliteId, 'chain') > 0.42) {
                graphEdges.push({
                    id: `${previousSatelliteId}:to:${satelliteId}`,
                    from: previousSatelliteId,
                    to: satelliteId,
                    strength: 0.38,
                    kind: 'satellite',
                    matchId: parent.matchId,
                });
            }
            previousSatelliteId = satelliteId;
        });
    }

    expandGraphMapToCanvas(nodeMap);

    return {
        nodes: [...nodeMap.values()],
        edges: graphEdges,
    };
}

function getSourceViewerTitle(span: GraphRagAnswerSpan | undefined): string {
    if (!span) return '근거 없음';
    return span.sourceTitle || span.evidenceLabel;
}

function isGroundedSpan(span: GraphRagAnswerSpan): boolean {
    return Boolean(span.knowledgeUnitId && span.sourceTitle && span.excerpt);
}

function GraphRagResultView({
    result,
    answerFontSize,
    onAnswerFontSizeChange,
}: {
    result: GraphRagResponse;
    answerFontSize: number;
    onAnswerFontSizeChange: (size: number) => void;
}) {
    const groundedSpans = useMemo(
        () => result.answerSpans.filter(isGroundedSpan),
        [result.answerSpans],
    );
    const citationIndexBySpan = useMemo(() => {
        const indexes = new Map<string, number>();
        groundedSpans.forEach((span, index) => indexes.set(span.id, index + 1));
        return indexes;
    }, [groundedSpans]);
    const uniqueSourceCount = useMemo(
        () => new Set(groundedSpans.map((span) => span.knowledgeUnitId).filter(Boolean)).size,
        [groundedSpans],
    );
    const [selectedSpanId, setSelectedSpanId] = useState(groundedSpans[0]?.id ?? '');
    const graphMap = useMemo(
        () => buildObsidianGraphMap(result.graph.nodes, result.graph.edges),
        [result.graph.edges, result.graph.nodes],
    );
    const graphMapNodeById = useMemo(
        () => new Map(graphMap.nodes.map((node) => [node.id, node])),
        [graphMap.nodes],
    );
    const selectedSpan = groundedSpans.find((span) => span.id === selectedSpanId) ?? groundedSpans[0];
    const selectedCitationIndex = selectedSpan ? citationIndexBySpan.get(selectedSpan.id) : undefined;
    const plainSpanCount = result.answerSpans.length - groundedSpans.length;
    const selectedMatchId = selectedSpan?.knowledgeUnitId ?? null;

    useEffect(() => {
        setSelectedSpanId(groundedSpans[0]?.id ?? '');
    }, [groundedSpans]);

    const selectLinkedSpan = (matchId: string | undefined) => {
        if (!matchId) return;
        const nextSpan = groundedSpans.find((span) => span.knowledgeUnitId === matchId);
        if (nextSpan) setSelectedSpanId(nextSpan.id);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.graphResultShell}
        >
            <div className={styles.graphMainColumn}>
                <article className={styles.graphCard}>
                    <div className={styles.graphCardHeader}>
                        <div>
                            <span className={styles.panelKicker}>출처 주석 답변</span>
                            <h2>답변을 먼저 읽고, 근거는 문장 옆에서 확인</h2>
                        </div>
                        <label className={styles.fontControl}>
                            <SlidersHorizontal size={16} />
                            <input
                                type="range"
                                min={14}
                                max={24}
                                value={answerFontSize}
                                onChange={(event) => onAnswerFontSizeChange(Number(event.target.value))}
                                aria-label="답변 글자 크기"
                            />
                            <span>{answerFontSize}px</span>
                        </label>
                    </div>

                    <div className={styles.groundingOverview}>
                        <div className={styles.groundingMetric}>
                            <ShieldCheck size={16} />
                            <strong>{groundedSpans.length}</strong>
                            <span>근거 표시 문장</span>
                        </div>
                        <div className={styles.groundingMetric}>
                            <FileText size={16} />
                            <strong>{uniqueSourceCount}</strong>
                            <span>직접 연결 출처</span>
                        </div>
                        <div className={styles.groundingMetric}>
                            <Quote size={16} />
                            <strong>{plainSpanCount}</strong>
                            <span>일반 답변 문장</span>
                        </div>
                    </div>

                    {result.conflictNote && (
                        <div className={styles.noticeBox}>
                            <strong>주의</strong>
                            <p>{result.conflictNote}</p>
                        </div>
                    )}

                    <div className={styles.highlightedAnswer} style={{ fontSize: `${answerFontSize}px` }}>
                        {result.answerSpans.map((span, index) => {
                            const grounded = isGroundedSpan(span);
                            const citationIndex = grounded ? citationIndexBySpan.get(span.id) : undefined;

                            return (
                                <span key={span.id} className={styles.answerSegment}>
                                    {index > 0 ? ' ' : ''}
                                    {grounded ? (
                                        <button
                                            type="button"
                                            className={`${styles.highlightSpan} ${styles[`confidence_${span.confidence}`]} ${selectedSpan?.id === span.id ? styles.highlightSpanActive : ''}`}
                                            onClick={() => setSelectedSpanId(span.id)}
                                        >
                                            <span className={styles.highlightText}>{span.text}</span>
                                            {citationIndex && (
                                                <sup className={styles.citationMark}>[{citationIndex}]</sup>
                                            )}
                                        </button>
                                    ) : (
                                        <span className={styles.plainAnswerSpan}>{span.text}</span>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </article>

                <article className={styles.graphCard}>
                    <div className={styles.graphCardHeader}>
                        <div>
                            <span className={styles.panelKicker}>근거 지도</span>
                            <h2>옵시디언형 지식 맵</h2>
                        </div>
                        <Network size={20} />
                    </div>

                    <div className={styles.flowStrip}>
                        {result.graph.flow.map((step) => (
                            <div key={step.id} className={styles.flowStep}>
                                <span className={styles.flowCount}>{step.count}</span>
                                <strong>{step.label}</strong>
                                <p>{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.graphCanvas}>
                        <div className={styles.graphStage}>
                            <svg
                                className={styles.graphMap}
                                viewBox={`0 0 ${GRAPH_MAP_WIDTH} ${GRAPH_MAP_HEIGHT}`}
                                preserveAspectRatio="xMidYMid meet"
                                role="img"
                                aria-label="Graph RAG 근거 연결 지도"
                            >
                                {graphMap.edges.map((edge) => {
                                    const from = graphMapNodeById.get(edge.from);
                                    const to = graphMapNodeById.get(edge.to);
                                    if (!from || !to) return null;
                                    const isActive = Boolean(selectedMatchId && edge.matchId === selectedMatchId);
                                    const edgeStyle = {
                                        '--edge-opacity': edge.kind === 'satellite'
                                            ? Math.min(0.34, 0.16 + edge.strength * 0.08)
                                            : Math.min(0.72, 0.28 + edge.strength * 0.1),
                                    } as CSSProperties;
                                    return (
                                        <line
                                            key={edge.id}
                                            x1={from.x}
                                            y1={from.y}
                                            x2={to.x}
                                            y2={to.y}
                                            className={`${styles.graphMapEdge} ${edge.kind === 'satellite' ? styles.graphMapEdgeSatellite : ''} ${isActive ? styles.graphMapEdgeActive : ''}`}
                                            strokeWidth={edge.kind === 'satellite' ? 0.7 : Math.min(1.55, 0.52 + edge.strength * 0.14)}
                                            style={edgeStyle}
                                        />
                                    );
                                })}
                                {graphMap.nodes.map((node) => {
                                    const isActive = Boolean(selectedMatchId && node.matchId === selectedMatchId);
                                    const isInteractive = Boolean(node.matchId);
                                    const label = `${GRAPH_NODE_LABELS[node.type]} · ${node.label}`;
                                    const nodeStyle = {
                                        '--node-opacity': node.opacity,
                                    } as CSSProperties;

                                    return (
                                        <g
                                            key={node.id}
                                            className={`${styles.graphMapNode} ${styles[`graphMapNode_${node.type}`]} ${isActive ? styles.graphMapNodeActive : ''} ${isInteractive ? styles.graphMapNodeInteractive : ''}`}
                                            tabIndex={node.isCore && isInteractive ? 0 : undefined}
                                            role={node.isCore && isInteractive ? 'button' : undefined}
                                            aria-label={label}
                                            style={nodeStyle}
                                            onClick={() => selectLinkedSpan(node.matchId)}
                                            onKeyDown={(event) => {
                                                if (!node.matchId || (event.key !== 'Enter' && event.key !== ' ')) return;
                                                event.preventDefault();
                                                selectLinkedSpan(node.matchId);
                                            }}
                                        >
                                            <title>{node.sublabel ? `${label} · ${node.sublabel}` : label}</title>
                                            <circle cx={node.x} cy={node.y} r={node.radius} />
                                            {node.isCore && (node.type === 'query' || node.type === 'answer') && (
                                                <text
                                                    className={styles.graphMapNodeLabel}
                                                    x={node.x}
                                                    y={node.y + node.radius + 20}
                                                >
                                                    {GRAPH_NODE_LABELS[node.type]}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                            <div className={styles.graphMapHud}>
                                <span>노드 {graphMap.nodes.length}</span>
                                <span>연결 {graphMap.edges.length}</span>
                            </div>
                            <div className={styles.graphMapLegend}>
                                {(['query', 'ontology', 'knowledge', 'source', 'answer'] as GraphMapNodeType[]).map((type) => (
                                    <span key={type} className={styles.graphMapLegendItem}>
                                        <i className={`${styles.graphMapLegendDot} ${styles[`graphMapLegendDot_${type}`]}`} />
                                        {GRAPH_NODE_LABELS[type]}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <aside className={`${styles.citationPanel} ${styles.sourceViewer}`}>
                <div className={styles.citationHeader}>
                    <h3>선택한 근거</h3>
                    <PanelRightOpen size={16} />
                </div>

                <div className={styles.sourceViewerBody}>
                    {selectedCitationIndex && (
                        <span className={styles.selectedCitationBadge}>근거 {selectedCitationIndex}</span>
                    )}
                    <div className={styles.sourceViewerTitle}>
                        <FileText size={18} />
                        <strong>{getSourceViewerTitle(selectedSpan)}</strong>
                    </div>
                    {selectedSpan ? (
                        <>
                            <div className={styles.sourceMetaGrid}>
                                <span>{selectedSpan.evidenceLabel}</span>
                                <span>신뢰도 {selectedSpan.confidence}</span>
                            </div>
                            <strong className={styles.excerptLabel}>원문 발췌</strong>
                            <blockquote>
                                <span className={styles.sourceExcerptText}>{selectedSpan.excerpt}</span>
                            </blockquote>
                            {selectedSpan.sourceUrl && (
                                <a
                                    className={styles.sourceLink}
                                    href={selectedSpan.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Link2 size={14} /> 원문 출처 열기
                                </a>
                            )}
                        </>
                    ) : (
                        <div className={styles.sourceViewerEmpty}>
                            직접 연결된 공개 근거가 있는 문장이 없습니다.
                        </div>
                    )}
                </div>

                {groundedSpans.length > 0 && (
                    <div className={styles.groundedList}>
                        <div className={styles.groundedListHeader}>
                            <ListChecks size={16} />
                            <h4>답변 주석</h4>
                        </div>
                        {groundedSpans.map((span) => {
                            const citationIndex = citationIndexBySpan.get(span.id);
                            return (
                                <button
                                    key={span.id}
                                    type="button"
                                    className={`${styles.groundedItem} ${selectedSpan?.id === span.id ? styles.groundedItemActive : ''}`}
                                    onClick={() => setSelectedSpanId(span.id)}
                                >
                                    <span>근거 {citationIndex}</span>
                                    <strong>{span.text}</strong>
                                </button>
                            );
                        })}
                    </div>
                )}

                {result.matches.length > 0 && (
                    <details className={styles.matchPanel}>
                        <summary>
                            <span>검색 후보 {result.matches.length}개</span>
                            <ChevronDown size={16} />
                        </summary>
                        <div className={styles.matchList}>
                            {result.matches.map((match) => (
                                <button
                                    key={match.knowledgeUnitId}
                                    type="button"
                                    className={`${styles.matchCardButton} ${selectedSpan?.knowledgeUnitId === match.knowledgeUnitId ? styles.matchCardButtonActive : ''}`}
                                    onClick={() => selectLinkedSpan(match.knowledgeUnitId)}
                                >
                                    <span>{match.title}</span>
                                    <strong>{match.score} pts</strong>
                                </button>
                            ))}
                        </div>
                    </details>
                )}
            </aside>
        </motion.section>
    );
}

function CounselChatPageContent() {
    const [mode, setMode] = useState<AssistantMode>('counsel');
    const [meta, setMeta] = useState<KnowledgeMeta | null>(null);
    const [schoolLevel, setSchoolLevel] = useState('고등학교');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('2026');
    const [question, setQuestion] = useState(SAMPLE_QUESTIONS[0]);
    const [recordText, setRecordText] = useState(SAMPLE_RECORD_TEXTS[0]);
    const [counselResult, setCounselResult] = useState<CounselChatResponse | null>(null);
    const [reviewResult, setReviewResult] = useState<RecordReviewResponse | null>(null);
    const [graphResult, setGraphResult] = useState<GraphRagResponse | null>(null);
    const [answerFontSize, setAnswerFontSize] = useState(16);
    const [error, setError] = useState<string | null>(null);
    const [isCounselPending, startCounselTransition] = useTransition();
    const [isReviewPending, startReviewTransition] = useTransition();
    const [isGraphPending, startGraphTransition] = useTransition();
    const graphResultRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const presetMode = searchParams.get('mode');
        const presetQuestion = searchParams.get('q');
        const presetText = searchParams.get('text');
        const presetSchoolLevel = searchParams.get('schoolLevel');
        const presetCategory = searchParams.get('category');
        const presetYear = searchParams.get('year');

        if (presetMode === 'review') setMode('review');
        else if (presetMode === 'graph') setMode('graph');
        else if (presetMode === 'counsel') setMode('counsel');
        else if (presetText) setMode('review');
        else setMode('counsel');

        if (presetQuestion) setQuestion(presetQuestion);
        if (presetText) setRecordText(presetText);
        if (presetSchoolLevel) setSchoolLevel(presetSchoolLevel);
        if (presetCategory) setCategory(presetCategory);
        if (presetYear) setYear(presetYear);
    }, []);

    useEffect(() => {
        const loadMeta = async () => {
            const response = await fetch('/api/knowledge/meta');
            const data = await response.json();
            if (data.success) {
                setMeta(data);
                setYear((current) => current || data.year);
            }
        };

        void loadMeta();
    }, []);

    useEffect(() => {
        if (!graphResult || mode !== 'graph') return;
        const timer = window.setTimeout(() => {
            graphResultRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 50);
        return () => window.clearTimeout(timer);
    }, [graphResult, mode]);

    const handleCounselSubmit = () => {
        setError(null);
        startCounselTransition(async () => {
            try {
                const response = await fetch('/api/counsel-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question,
                        schoolLevel,
                        category: category || undefined,
                        year: Number(year),
                    }),
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || '답변 생성에 실패했습니다.');
                }
                setCounselResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '답변 생성에 실패했습니다.');
            }
        });
    };

    const handleReviewSubmit = () => {
        setError(null);
        startReviewTransition(async () => {
            try {
                const response = await fetch('/api/record-review', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recordText,
                        schoolLevel,
                        category: category || undefined,
                        year: Number(year),
                    }),
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || '점검에 실패했습니다.');
                }
                setReviewResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '점검에 실패했습니다.');
            }
        });
    };

    const handleGraphSubmit = () => {
        setError(null);
        setGraphResult(null);
        startGraphTransition(async () => {
            try {
                const response = await fetch('/api/counsel-chat/graph', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question,
                        schoolLevel,
                        category: category || undefined,
                        year: Number(year),
                    }),
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Graph RAG 답변 생성에 실패했습니다.');
                }
                setGraphResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Graph RAG 답변 생성에 실패했습니다.');
            }
        });
    };

    const isCounselMode = mode === 'counsel';
    const isReviewMode = mode === 'review';
    const isGraphMode = mode === 'graph';

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <span className={styles.kicker}>학생부 상담 Q&A</span>
                    <h1 className={styles.title}>생기부 상담 점검</h1>
                    <p className={styles.subtitle}>
                        질문 답변과 문장 점검을 한 화면에서 처리합니다.
                    </p>

                    <div className={styles.modeSwitch}>
                        <button
                            type="button"
                            className={`${styles.modeButton} ${isCounselMode ? styles.modeButtonActive : ''}`}
                            onClick={() => setMode('counsel')}
                        >
                            <MessageSquareQuote size={18} />
                            <span className={styles.modeButtonCopy}>
                                <strong>질문 답변</strong>
                                <span>규정·FAQ 근거 답변</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.modeButton} ${isReviewMode ? styles.modeButtonActive : ''}`}
                            onClick={() => setMode('review')}
                        >
                            <SearchCheck size={18} />
                            <span className={styles.modeButtonCopy}>
                                <strong>문구 점검</strong>
                                <span>위험 요소와 수정 방향</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.modeButton} ${isGraphMode ? styles.modeButtonActive : ''}`}
                            onClick={() => setMode('graph')}
                        >
                            <BrainCircuit size={18} />
                            <span className={styles.modeButtonCopy}>
                                <strong>출처 주석 답변</strong>
                                <span>하이라이트·원문 발췌</span>
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            <section className={styles.workspacePanel}>
                <div className={styles.filterRow}>
                    <label className={styles.filterField}>
                        <span><GraduationCap size={14} /> 학교급</span>
                        <select value={schoolLevel} onChange={(event) => setSchoolLevel(event.target.value)}>
                            {(meta?.schoolLevels ?? ['초등학교', '중학교', '고등학교']).map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span><Tag size={14} /> 구분</span>
                        <select value={category} onChange={(event) => setCategory(event.target.value)}>
                            <option value="">전체</option>
                            {(meta?.categories ?? []).map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span><CalendarRange size={14} /> 연도</span>
                        <input value={year} onChange={(event) => setYear(event.target.value)} />
                    </label>
                </div>

                {isCounselMode ? (
                    <>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelKicker}>Question</span>
                                <h2>학생부 관련 질문</h2>
                            </div>
                        </div>

                        <textarea
                            className={styles.inputArea}
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            placeholder="학생부 관련 질문을 입력하세요."
                            rows={6}
                        />

                        <div className={styles.sampleRow}>
                            {SAMPLE_QUESTIONS.map((sample) => (
                                <button key={sample} className={styles.sampleChip} onClick={() => setQuestion(sample)}>
                                    {sample}
                                </button>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleCounselSubmit} isLoading={isCounselPending}>
                                <Bot size={16} /> 근거 기반 답변 생성
                            </Button>
                        </div>
                    </>
                ) : isReviewMode ? (
                    <>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelKicker}>Review</span>
                                <h2>점검할 생기부 문장</h2>
                            </div>
                        </div>

                        <textarea
                            className={styles.inputArea}
                            value={recordText}
                            onChange={(event) => setRecordText(event.target.value)}
                            placeholder="점검할 생기부 문장을 입력하세요."
                            rows={10}
                        />

                        <div className={styles.sampleRow}>
                            {SAMPLE_RECORD_TEXTS.map((sample) => (
                                <button key={sample} className={styles.sampleChip} onClick={() => setRecordText(sample)}>
                                    {sample}
                                </button>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleReviewSubmit} isLoading={isReviewPending}>
                                <SearchCheck size={16} /> 근거 기반 점검 실행
                            </Button>
                        </div>
                    </>
                ) : isGraphMode && graphResult ? (
                    <div className={styles.submittedQuestionBar}>
                        <div>
                            <span className={styles.submittedQuestionLabel}>현재 질문</span>
                            <strong>{question}</strong>
                        </div>
                        <button
                            type="button"
                            className={styles.secondaryAction}
                            onClick={() => setGraphResult(null)}
                        >
                            질문 수정
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelKicker}>출처 연결</span>
                                <h2>출처 주석 답변 질문</h2>
                            </div>
                        </div>

                        <textarea
                            className={`${styles.inputArea} ${styles.compactQuestionArea}`}
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            placeholder="질문을 입력하면 근거가 확인된 답변 문장에만 출처 주석을 붙입니다."
                            rows={6}
                        />

                        <div className={styles.sampleRow}>
                            {SAMPLE_QUESTIONS.map((sample) => (
                                <button key={sample} className={styles.sampleChip} onClick={() => setQuestion(sample)}>
                                    {sample}
                                </button>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleGraphSubmit} isLoading={isGraphPending}>
                                <Route size={16} /> 출처 주석 답변 생성
                            </Button>
                        </div>
                    </>
                )}
            </section>

            {error && <div className={styles.errorBox}>{error}</div>}

            {isCounselMode && counselResult && (
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.resultShell}
                >
                    <article className={styles.primaryCard}>
                        <div className={styles.answerHeader}>
                            <h2>답변</h2>
                            {counselResult.fallback && <span className={styles.badge}>Fallback</span>}
                        </div>
                        <p className={styles.answerText}>{counselResult.answer}</p>
                        {counselResult.conflictNote && (
                            <div className={styles.noticeBox}>
                                <strong>주의</strong>
                                <p>{counselResult.conflictNote}</p>
                            </div>
                        )}
                    </article>

                    <aside className={styles.citationPanel}>
                        <h3>근거 출처</h3>
                        <div className={styles.citationList}>
                            {counselResult.citations.map((citation) => (
                                <a
                                    key={`${citation.url}-${citation.title}`}
                                    className={styles.citationCard}
                                    href={citation.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className={styles.citationHeader}>
                                        <span className={styles.sourceType}>{citation.sourceBoard.toUpperCase()}</span>
                                        <Link2 size={14} />
                                    </div>
                                    <strong>{citation.title}</strong>
                                    <p>{citation.snippet}</p>
                                </a>
                            ))}
                        </div>

                        {counselResult.matches.length > 0 && (
                            <div className={styles.matchPanel}>
                                <h4>검색된 지식</h4>
                                <div className={styles.matchList}>
                                    {counselResult.matches.map((match) => (
                                        <div key={match.knowledgeUnitId} className={styles.matchCard}>
                                            <strong>{match.title}</strong>
                                            <span>{match.score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </motion.section>
            )}

            {isReviewMode && reviewResult && (
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.resultShell}
                >
                    <div className={styles.primaryCard}>
                        <div className={styles.answerHeader}>
                            <h2>점검 요약</h2>
                            <span className={`${styles.statusBadge} ${styles[reviewResult.status]}`}>
                                {REVIEW_STATUS_LABELS[reviewResult.status]}
                            </span>
                        </div>
                        <p className={styles.answerText}>{reviewResult.summary}</p>

                        {reviewResult.recommendedRewrite && (
                            <div className={styles.rewriteBox}>
                                <strong>수정 방향</strong>
                                <p>{reviewResult.recommendedRewrite}</p>
                            </div>
                        )}

                        <div className={styles.issueList}>
                            {reviewResult.issues.length === 0 ? (
                                <div className={styles.passBox}>
                                    <CheckCircle2 size={18} />
                                    <span>즉시 수정이 필요한 신호는 크지 않습니다.</span>
                                </div>
                            ) : (
                                reviewResult.issues.map((issue, index) => (
                                    <div key={`${issue.issueType}-${index}`} className={styles.issueCard}>
                                        <div className={styles.issueHeader}>
                                            <span className={`${styles.severity} ${styles[issue.severity]}`}>
                                                {SEVERITY_LABELS[issue.severity]}
                                            </span>
                                            <strong>{ISSUE_TYPE_LABELS[issue.issueType]}</strong>
                                        </div>
                                        <p className={styles.issueMessage}>{issue.message}</p>
                                        {issue.evidence.length > 0 && (
                                            <ul className={styles.issueEvidence}>
                                                {issue.evidence.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {issue.rewriteGuidance && (
                                            <p className={styles.issueGuidance}>{issue.rewriteGuidance}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <aside className={styles.citationPanel}>
                        <div className={styles.citationHeader}>
                            <h3>관련 공개 근거</h3>
                            <AlertTriangle size={16} />
                        </div>
                        <div className={styles.citationList}>
                            {reviewResult.citations.map((citation) => (
                                <a
                                    key={`${citation.url}-${citation.title}`}
                                    href={citation.url}
                                    className={styles.citationCard}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className={styles.citationHeader}>
                                        <strong>{citation.title}</strong>
                                        <Link2 size={14} />
                                    </div>
                                    <p>{citation.snippet}</p>
                                </a>
                            ))}
                        </div>

                        {reviewResult.matches.length > 0 && (
                            <div className={styles.matchPanel}>
                                <h4>검색된 지식</h4>
                                <div className={styles.matchList}>
                                    {reviewResult.matches.map((match) => (
                                        <div key={match.knowledgeUnitId} className={styles.matchCard}>
                                            <strong>{match.title}</strong>
                                            <span>{match.score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </motion.section>
            )}

            {isGraphMode && graphResult && (
                <div ref={graphResultRef} className={styles.resultAnchor}>
                    <GraphRagResultView
                        result={graphResult}
                        answerFontSize={answerFontSize}
                        onAnswerFontSizeChange={setAnswerFontSize}
                    />
                </div>
            )}
        </div>
    );
}

export default function CounselChatPage() {
    return <CounselChatPageContent />;
}
