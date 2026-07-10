import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import ts from 'typescript';

const sourceUrl = new URL('../src/lib/observation-board-ai-context.ts', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
    },
});
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const { formatObservationBoardContextForPrompt } = await import(moduleUrl);

const detailedObservationBoardContext = {
    source: 'observation-board-2',
    sessionMarks: [
        {
            sessionId: 'session-1',
            label: '1차시',
            date: '4/9',
            topic: '관계 형성',
            mark: 'excellent',
            markLabel: '매우 잘함',
            roleContext: {
                role: 'mentor',
                roleLabel: '멘토',
                groupTitle: '11조',
                classId: 'teach-school-teacher-subject-3-1',
            },
        },
    ],
    derivedSummary: {
        totalSessions: 1,
        markedSessions: 1,
        participatedCount: 0,
        excellentCount: 1,
        participationRate: 1,
        trend: 'limited',
        summaryLines: [
            '총 1차시 중 1차시에 활동 참여 신호가 기록되었습니다.',
            '11조에서 멘토 역할로 관계 형성 활동에 참여했습니다.',
        ],
        writingGuidance: ['멘토·멘티 활동 기록을 태도 근거로 활용합니다.'],
        roleContext: {
            role: 'mentor',
            roleLabel: '멘토',
            groupTitle: '11조',
            classId: 'teach-school-teacher-subject-3-1',
        },
        roleContexts: [],
    },
    roleContext: {
        role: 'mentor',
        roleLabel: '멘토',
        groupTitle: '11조',
        classId: 'teach-school-teacher-subject-3-1',
    },
};

const identifyingActivityDetails = /11조|멘토|관계 형성|4\/9|1차시|차시별 기록/;

test('활동판만 있으면 식별 가능한 상세 대신 일반적인 참여 태도만 전달한다', () => {
    const promptContext = formatObservationBoardContextForPrompt(detailedObservationBoardContext, {
        observationsText: '',
        learningData: {},
    });

    assert.doesNotMatch(promptContext, identifyingActivityDetails);
    assert.match(promptContext, /일반적인 수업 참여 태도/);
    assert.ok(promptContext.length < 500);
});

test('관찰 메모가 있으면 활동판을 짧은 태도 보조 근거로만 전달한다', () => {
    const promptContext = formatObservationBoardContextForPrompt(detailedObservationBoardContext, {
        observationsText: '풀이 과정을 칠판에 적고 계산 순서를 설명함.',
        learningData: {},
    });

    assert.doesNotMatch(promptContext, identifyingActivityDetails);
    assert.match(promptContext, /짧은 보조 근거/);
    assert.ok(promptContext.length < 500);
});

test('공백뿐인 학습 데이터는 상위 근거로 취급하지 않는다', () => {
    const promptContext = formatObservationBoardContextForPrompt(detailedObservationBoardContext, {
        learningData: { memo: '   ', activity: '\n\t' },
    });

    assert.match(promptContext, /일반적인 수업 참여 태도/);
    assert.doesNotMatch(promptContext, /짧은 보조 근거/);
});
