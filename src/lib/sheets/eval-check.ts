import { readSheet, appendRow, updateRow, deleteRow, deleteRows, SHEETS } from './base';

export interface EvalCheckSettingsRow {
    key: string;
    value: string;
    description: string;
    updatedAt: string;
}

export interface EvalCheckDocumentRow {
    documentId: string;
    uploadedAt: string;
    originalFileName: string;
    fileHash: string;
    driveFolderId: string;
    driveOriginalFileId: string;
    status: 'pending' | 'extracting' | 'structuring' | 'analyzing' | 'completed' | 'error';
    progress: number;
    highRiskCount: number;
    manifestJsonFileId: string;
    memo: string;
    sharedResourcesJson: string;
    analysisVersion: string;
    resourcesExtracted: number;
    taskTypeDistributionJson: string;
    consistencyReportJson: string;
    errorMessage: string;
}

export interface EvalCheckLogRow {
    logId: string;
    documentId: string;
    taskType: string;
    status: 'pending' | 'running' | 'completed' | 'error';
    progress: number;
    startedAt: string;
    completedAt: string;
    checkpoints: string;
    memo: string;
}

export interface EvalCheckResourceRow {
    documentId: string;
    resourceId: string;
    type: string;
    title: string;
    content: string;
    itemsJson: string;
    pageRange: string;
    rawJson: string;
}

export interface EvalCheckQuestionRow {
    documentId: string;
    questionId: string;
    displayName: string;
    pageRange: string;
    passageGroupId: string;
    hasImage: boolean;
    isHighRisk: boolean;
    highRiskReason: string;
    answerSummary: string;
    reasoningSummary: string;
    detailJsonFileId: string;
    imageDescriptionAI: string;
    imageDescriptionTeacher: string;
    imageDescriptionFinal: string;
    suggestionMinimal: string;
    suggestionImproved: string;
    taskType: string;
    answerType: string;
    resourceRefsJson: string;
    analysisJson: string;
}

export interface EvalCheckIssueRow {
    documentId: string;
    questionId: string;
    issueId: string;
    issueType: string;
    issueSummary: string;
    suggestionSummary: string;
    detailJsonFileId: string;
    issueLocation: string;
    riskLevel: 'low' | 'medium' | 'high';
    originalText: string;
    suggestedFix: string;
}

// ============ Settings Operations ============

export async function getEvalCheckSettings(): Promise<Record<string, string>> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_SETTINGS);
    const settings: Record<string, string> = {};
    if (rows.length > 1) {
        rows.slice(1).forEach(row => {
            if (row[0]) settings[row[0]] = row[1] || '';
        });
    }
    return settings;
}

export async function saveEvalCheckSettings(settings: Record<string, string>): Promise<void> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_SETTINGS);
    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(settings)) {
        const rowIndex = rows.findIndex(row => row[0] === key);
        if (rowIndex > 0) {
            await updateRow(SHEETS.EVAL_CHECK_SETTINGS, rowIndex + 1, [key, value, rows[rowIndex][2] || '', now]);
        } else {
            await appendRow(SHEETS.EVAL_CHECK_SETTINGS, [key, value, '', now]);
        }
    }
}

// ============ Document Operations ============

export async function getEvalCheckDocuments(): Promise<EvalCheckDocumentRow[]> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_DOCUMENTS);
    if (rows.length <= 1) return [];

    return rows.slice(1).map(row => ({
        documentId: row[0],
        uploadedAt: row[1],
        originalFileName: row[2],
        fileHash: row[3],
        driveFolderId: row[4],
        driveOriginalFileId: row[5],
        status: (row[6] as any) || 'pending',
        progress: parseInt(row[7] || '0'),
        highRiskCount: parseInt(row[8] || '0'),
        manifestJsonFileId: row[9],
        memo: row[10],
        sharedResourcesJson: row[11] || '[]',
        analysisVersion: row[12],
        resourcesExtracted: parseInt(row[13] || '0'),
        taskTypeDistributionJson: row[14] || '{}',
        consistencyReportJson: row[15] || '{}',
        errorMessage: row[16] || '',
    }));
}

export async function getEvalCheckDocumentById(documentId: string): Promise<EvalCheckDocumentRow | null> {
    const documents = await getEvalCheckDocuments();
    return documents.find(doc => doc.documentId === documentId) || null;
}

export async function getEvalCheckDocumentByHash(fileHash: string): Promise<EvalCheckDocumentRow | null> {
    const documents = await getEvalCheckDocuments();
    return documents.find(doc => doc.fileHash === fileHash) || null;
}

export async function addEvalCheckDocument(doc: Omit<EvalCheckDocumentRow, 'documentId'> & { documentId?: string }): Promise<string> {
    const documentId = doc.documentId || `doc-${Date.now()}`;
    await appendRow(SHEETS.EVAL_CHECK_DOCUMENTS, [
        documentId,
        doc.uploadedAt,
        doc.originalFileName,
        doc.fileHash,
        doc.driveFolderId,
        doc.driveOriginalFileId,
        doc.status,
        String(doc.progress),
        String(doc.highRiskCount),
        doc.manifestJsonFileId,
        doc.memo,
        doc.sharedResourcesJson,
        doc.analysisVersion,
        String(doc.resourcesExtracted),
        doc.taskTypeDistributionJson,
        doc.consistencyReportJson,
        doc.errorMessage,
    ]);
    return documentId;
}

export async function updateEvalCheckDocument(documentId: string, updates: Partial<EvalCheckDocumentRow>): Promise<void> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_DOCUMENTS);
    const rowIndex = rows.findIndex(row => row[0] === documentId);
    if (rowIndex > 0) {
        const current = rows[rowIndex];
        const updated = [
            documentId,
            updates.uploadedAt ?? current[1],
            updates.originalFileName ?? current[2],
            updates.fileHash ?? current[3],
            updates.driveFolderId ?? current[4],
            updates.driveOriginalFileId ?? current[5],
            updates.status ?? current[6],
            updates.progress !== undefined ? String(updates.progress) : current[7],
            updates.highRiskCount !== undefined ? String(updates.highRiskCount) : current[8],
            updates.manifestJsonFileId ?? current[9],
            updates.memo ?? current[10],
            updates.sharedResourcesJson ?? current[11],
            updates.analysisVersion ?? current[12],
            updates.resourcesExtracted !== undefined ? String(updates.resourcesExtracted) : current[13],
            updates.taskTypeDistributionJson ?? current[14],
            updates.consistencyReportJson ?? current[15],
            updates.errorMessage ?? current[16],
        ];
        await updateRow(SHEETS.EVAL_CHECK_DOCUMENTS, rowIndex + 1, updated);
    }
}

export async function deleteEvalCheckDocument(documentId: string): Promise<void> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_DOCUMENTS);
    const rowIndex = rows.findIndex(row => row[0] === documentId);
    if (rowIndex > 0) {
        await deleteRow(SHEETS.EVAL_CHECK_DOCUMENTS, rowIndex + 1);
    }
}

// ============ Log Operations ============

export async function addEvalCheckLog(log: Omit<EvalCheckLogRow, 'logId'>): Promise<string> {
    const logId = `log-${Date.now()}`;
    await appendRow(SHEETS.EVAL_CHECK_LOGS, [
        logId,
        log.documentId,
        log.taskType,
        log.status,
        String(log.progress),
        log.startedAt,
        log.completedAt,
        log.checkpoints,
        log.memo,
    ]);
    return logId;
}

export async function updateEvalCheckLog(logId: string, updates: Partial<EvalCheckLogRow>): Promise<void> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_LOGS);
    const rowIndex = rows.findIndex(row => row[0] === logId);
    if (rowIndex > 0) {
        const current = rows[rowIndex];
        await updateRow(SHEETS.EVAL_CHECK_LOGS, rowIndex + 1, [
            logId,
            updates.documentId ?? current[1],
            updates.taskType ?? current[2],
            updates.status ?? current[3],
            updates.progress !== undefined ? String(updates.progress) : current[4],
            updates.startedAt ?? current[5],
            updates.completedAt ?? current[6],
            updates.checkpoints ?? current[7],
            updates.memo ?? current[8],
        ]);
    }
}

export async function deleteEvalCheckLogsByDocument(documentId: string): Promise<void> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_LOGS);
    // Deleting multiple rows is tricky with current helpers. 
    // Ideally, we should iterate backwards or use batch delete if supported.
    // For simplicity with basic API: find all indices and delete from bottom up.
    const indicesToDelete: number[] = [];
    rows.forEach((row, idx) => {
        if (idx > 0 && row[1] === documentId) indicesToDelete.push(idx + 1);
    });

    await deleteRows(SHEETS.EVAL_CHECK_LOGS, indicesToDelete);
}


// ============ Resource Operations ============

export async function getEvalCheckResources(documentId?: string): Promise<EvalCheckResourceRow[]> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_RESOURCES);
    if (rows.length <= 1) return [];

    const resources = rows.slice(1).map(row => ({
        documentId: row[0],
        resourceId: row[1],
        type: row[2],
        title: row[3],
        content: row[4],
        itemsJson: row[5],
        pageRange: row[6],
        rawJson: row[7] || '',
    }));

    if (documentId) {
        return resources.filter(res => res.documentId === documentId);
    }
    return resources;
}

export async function addEvalCheckResource(res: EvalCheckResourceRow): Promise<void> {
    await appendRow(SHEETS.EVAL_CHECK_RESOURCES, [
        res.documentId,
        res.resourceId,
        res.type,
        res.title,
        res.content,
        res.itemsJson,
        res.pageRange,
        res.rawJson,
    ]);
}

export async function deleteEvalCheckResourcesByDocument(documentId: string): Promise<void> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_RESOURCES);
    const indicesToDelete: number[] = [];
    rows.forEach((row, idx) => {
        if (idx > 0 && row[0] === documentId) indicesToDelete.push(idx + 1);
    });
    await deleteRows(SHEETS.EVAL_CHECK_RESOURCES, indicesToDelete);
}

// ============ Question Operations ============

export async function getEvalCheckQuestions(documentId?: string): Promise<EvalCheckQuestionRow[]> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_QUESTIONS);
    if (rows.length <= 1) return [];

    const questions = rows.slice(1).map(row => ({
        documentId: row[0],
        questionId: row[1],
        displayName: row[2],
        pageRange: row[3],
        passageGroupId: row[4],
        hasImage: row[5] === 'true',
        isHighRisk: row[6] === 'true',
        highRiskReason: row[7],
        answerSummary: row[8],
        reasoningSummary: row[9],
        detailJsonFileId: row[10],
        imageDescriptionAI: row[11],
        imageDescriptionTeacher: row[12],
        imageDescriptionFinal: row[13],
        suggestionMinimal: row[14],
        suggestionImproved: row[15],
        taskType: row[16],
        answerType: row[17],
        resourceRefsJson: row[18],
        analysisJson: row[19],
    }));

    if (documentId) {
        return questions.filter(q => q.documentId === documentId);
    }
    return questions;
}

export async function addEvalCheckQuestion(q: EvalCheckQuestionRow): Promise<void> {
    await appendRow(SHEETS.EVAL_CHECK_QUESTIONS, [
        q.documentId,
        q.questionId,
        q.displayName,
        q.pageRange,
        q.passageGroupId,
        String(q.hasImage),
        String(q.isHighRisk),
        q.highRiskReason,
        q.answerSummary,
        q.reasoningSummary,
        q.detailJsonFileId,
        q.imageDescriptionAI,
        q.imageDescriptionTeacher,
        q.imageDescriptionFinal,
        q.suggestionMinimal,
        q.suggestionImproved,
        q.taskType,
        q.answerType,
        q.resourceRefsJson,
        q.analysisJson,
    ]);
}

export async function deleteEvalCheckQuestionsByDocument(documentId: string): Promise<void> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_QUESTIONS);
    const indicesToDelete: number[] = [];
    rows.forEach((row, idx) => {
        if (idx > 0 && row[0] === documentId) indicesToDelete.push(idx + 1);
    });
    await deleteRows(SHEETS.EVAL_CHECK_QUESTIONS, indicesToDelete);
}

// ============ Issue Operations ============

const parseRiskLevel = (value?: string): EvalCheckIssueRow['riskLevel'] =>
    value === 'high' || value === 'medium' || value === 'low' ? value : 'low';

export async function getEvalCheckIssues(documentId?: string): Promise<EvalCheckIssueRow[]> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_ISSUES);
    if (rows.length <= 1) return [];

    const issues = rows.slice(1).map(row => ({
        documentId: row[0],
        questionId: row[1],
        issueId: row[2],
        issueType: row[3],
        issueSummary: row[4],
        suggestionSummary: row[5],
        detailJsonFileId: row[6],
        issueLocation: row[7],
        riskLevel: parseRiskLevel(row[8]),
        originalText: row[9] || '',
        suggestedFix: row[10] || '',
    }));

    if (documentId) {
        return issues.filter(issue => issue.documentId === documentId);
    }
    return issues;
}

export async function addEvalCheckIssue(issue: EvalCheckIssueRow): Promise<void> {
    await appendRow(SHEETS.EVAL_CHECK_ISSUES, [
        issue.documentId,
        issue.questionId,
        issue.issueId,
        issue.issueType,
        issue.issueSummary,
        issue.suggestionSummary,
        issue.detailJsonFileId,
        issue.issueLocation,
        issue.riskLevel,
        issue.originalText,
        issue.suggestedFix,
    ]);
}

export async function deleteEvalCheckIssuesByDocument(documentId: string): Promise<void> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_ISSUES);
    const indicesToDelete: number[] = [];
    rows.forEach((row, idx) => {
        if (idx > 0 && row[0] === documentId) indicesToDelete.push(idx + 1);
    });
    await deleteRows(SHEETS.EVAL_CHECK_ISSUES, indicesToDelete);
}

// ============ Rule Operations ============

export interface EvalCheckRuleRow {
    ruleId: string;
    name: string;
    enabled: boolean;
    target: string;
    condition: string;
    correctionGuide: string;
    exampleWrong: string;
    exampleCorrect: string;
    updatedAt: string;
}

export async function getEvalCheckRules(): Promise<EvalCheckRuleRow[]> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_RULES);
    if (rows.length <= 1) return [];

    return rows.slice(1).map(row => ({
        ruleId: row[0],
        name: row[1],
        enabled: row[2] === 'TRUE',
        target: row[3] || 'all',
        condition: row[4],
        correctionGuide: row[5],
        exampleWrong: row[6],
        exampleCorrect: row[7],
        updatedAt: row[8],
    }));
}

export async function addEvalCheckRule(rule: Omit<EvalCheckRuleRow, 'ruleId' | 'updatedAt'>): Promise<string> {
    const ruleId = `rule-${Date.now()}`;
    const now = new Date().toISOString();
    await appendRow(SHEETS.EVAL_CHECK_RULES, [
        ruleId,
        rule.name,
        rule.enabled ? 'TRUE' : 'FALSE',
        rule.target,
        rule.condition,
        rule.correctionGuide,
        rule.exampleWrong,
        rule.exampleCorrect,
        now,
    ]);
    return ruleId;
}

export async function updateEvalCheckRule(ruleId: string, updates: Partial<EvalCheckRuleRow>): Promise<boolean> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_RULES);
    const rowIndex = rows.findIndex(row => row[0] === ruleId);
    if (rowIndex <= 0) return false;

    const current = rows[rowIndex];
    const now = new Date().toISOString();
    await updateRow(SHEETS.EVAL_CHECK_RULES, rowIndex + 1, [
        ruleId,
        updates.name ?? current[1],
        updates.enabled !== undefined ? (updates.enabled ? 'TRUE' : 'FALSE') : current[2],
        updates.target ?? current[3],
        updates.condition ?? current[4],
        updates.correctionGuide ?? current[5],
        updates.exampleWrong ?? current[6],
        updates.exampleCorrect ?? current[7],
        now,
    ]);

    return true;
}

export async function deleteEvalCheckRule(ruleId: string): Promise<boolean> {
    const rows = await readSheet(SHEETS.EVAL_CHECK_RULES);
    const rowIndex = rows.findIndex(row => row[0] === ruleId);
    if (rowIndex <= 0) return false;

    await deleteRow(SHEETS.EVAL_CHECK_RULES, rowIndex + 1);
    return true;
}
