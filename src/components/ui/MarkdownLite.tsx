import { Fragment, type ReactNode } from 'react';

/**
 * AI 답변용 경량 마크다운 렌더러.
 *
 * 지원 범위는 답변 텍스트에 실제로 나타나는 최소 문법(굵게, 불릿 목록, 문단)으로
 * 한정한다. HTML 문자열을 만들지 않고 React 엘리먼트만 생성하므로 원문에 어떤
 * 마크업이 섞여 있어도 스크립트 실행 여지가 없다.
 */

function renderInline(text: string, keyPrefix: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    const pattern = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let index = 0;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }
        nodes.push(<strong key={`${keyPrefix}-b${index}`}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
        index += 1;
    }
    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes;
}

function isBulletLine(line: string): boolean {
    return /^\s*[-•]\s+/.test(line);
}

function stripBullet(line: string): string {
    return line.replace(/^\s*[-•]\s+/, '');
}

export function MarkdownLite({ text, className }: { text: string; className?: string }) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const blocks: ReactNode[] = [];
    let paragraph: string[] = [];
    let bullets: string[] = [];

    const flushParagraph = () => {
        if (paragraph.length === 0) return;
        const key = `p${blocks.length}`;
        blocks.push(
            <p key={key}>
                {paragraph.map((line, i) => (
                    <Fragment key={`${key}-l${i}`}>
                        {i > 0 && <br />}
                        {renderInline(line, `${key}-l${i}`)}
                    </Fragment>
                ))}
            </p>
        );
        paragraph = [];
    };

    const flushBullets = () => {
        if (bullets.length === 0) return;
        const key = `ul${blocks.length}`;
        blocks.push(
            <ul key={key}>
                {bullets.map((item, i) => (
                    <li key={`${key}-i${i}`}>{renderInline(item, `${key}-i${i}`)}</li>
                ))}
            </ul>
        );
        bullets = [];
    };

    for (const line of lines) {
        if (isBulletLine(line)) {
            flushParagraph();
            bullets.push(stripBullet(line));
        } else if (line.trim() === '') {
            flushParagraph();
            flushBullets();
        } else {
            flushBullets();
            paragraph.push(line);
        }
    }
    flushParagraph();
    flushBullets();

    return <div className={className}>{blocks}</div>;
}
