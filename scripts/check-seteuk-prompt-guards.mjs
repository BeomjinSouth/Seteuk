import { readFileSync } from 'node:fs';

const source = readFileSync('src/lib/prompts/seteuk.ts', 'utf8');

const requiredSnippets = [
  "SETEUK_DEFAULT_SYSTEM_PROMPT_VERSION = 'cross-curricular-seteuk-v2.7'",
  '“열심히 함”만 제시된 경우',
  '관찰 가능한 활동이나 과제가 함께 제시되지 않았으면 안전 문장만 출력함',
  '매체명이나 산출물 형식도 입력에 없으면 새로 붙이지 않음',
  '“빠짐없이”, “체계적으로”, “꼼꼼히”, “충실히”',
  '친구 의견을 들었다는 정보만으로 수정함, 보완함, 반영함으로 바꾸지 않음',
  '교육과정 맥락은 학생 행동의 배경일 뿐, 입력에 없는 발화, 의견, 성취를 만들지 않음',
  '“자신의 의견을 말함”, “의견을 제시함”은 입력에 실제 발화나 의견 내용이 있을 때만 사용함',
  '형식이 깨진 입력은 읽을 수 있는 사실만 복구함',
  '“표현 방향”, “작품 의도”, “모습이 관찰됨” 같은 상위 해석 표현은 입력에 직접 근거가 있을 때만 사용함',
  '교육과정 문구를 최종 문장의 마무리 요약처럼 복사하지 않음',
  '“과제 수행함”은 입력에 과제 수행, 과제 제출, 과제 완료가 직접 제시된 경우에만 사용함',
  '입력이 “질문함”이면 질문 행동만 쓰고, 의견 제시나 의견 말하기로 바꾸지 않음',
];

const missing = requiredSnippets.filter((snippet) => !source.includes(snippet));

if (missing.length > 0) {
  console.error('Missing seteuk prompt guard snippets:');
  for (const snippet of missing) {
    console.error(`- ${snippet}`);
  }
  process.exit(1);
}

console.log('Seteuk prompt guard snippets are present.');
