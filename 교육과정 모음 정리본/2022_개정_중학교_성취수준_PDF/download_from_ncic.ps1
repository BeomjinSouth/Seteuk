$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$cwd = Get-Location
$root = Join-Path $cwd '2022_개정_중학교_성취수준_PDF'
$levelDir = Join-Path $root '성취수준'
$reportDir = Join-Path $root '연구보고서'
New-Item -ItemType Directory -Force -Path $levelDir, $reportDir | Out-Null

$articles = @(
  [pscustomobject]@{ Seq = '01'; ArticleId = 773; Page = 4; Subject = '국어'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_국어과' },
  [pscustomobject]@{ Seq = '02'; ArticleId = 772; Page = 4; Subject = '수학'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_수학과' },
  [pscustomobject]@{ Seq = '03'; ArticleId = 771; Page = 4; Subject = '영어'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_영어과' },
  [pscustomobject]@{ Seq = '04'; ArticleId = 770; Page = 4; Subject = '사회'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_사회과' },
  [pscustomobject]@{ Seq = '05'; ArticleId = 769; Page = 4; Subject = '도덕'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_도덕과' },
  [pscustomobject]@{ Seq = '06'; ArticleId = 768; Page = 4; Subject = '역사'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_역사과' },
  [pscustomobject]@{ Seq = '07'; ArticleId = 767; Page = 5; Subject = '과학'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_과학과' },
  [pscustomobject]@{ Seq = '08'; ArticleId = 764; Page = 5; Subject = '체육'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_체육과' },
  [pscustomobject]@{ Seq = '09'; ArticleId = 765; Page = 5; Subject = '음악'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_음악과' },
  [pscustomobject]@{ Seq = '10'; ArticleId = 766; Page = 5; Subject = '미술'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_미술과' },
  [pscustomobject]@{ Seq = '11'; ArticleId = 763; Page = 5; Subject = '기술·가정'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_기술 가정' },
  [pscustomobject]@{ Seq = '12'; ArticleId = 774; Page = 4; Subject = '정보'; Scope = '중·고 공용 게시글 중 중학교 자료'; PostTitle = '(중고) 2022 개정 교육과정에 따른 성취수준 및 연구보고서_정보과' },
  [pscustomobject]@{ Seq = '13'; ArticleId = 762; Page = 5; Subject = '생활 외국어'; Scope = '중학교'; PostTitle = '(중) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_ 생활 외국어' },
  [pscustomobject]@{ Seq = '14'; ArticleId = 775; Page = 4; Subject = '한문'; Scope = '중·고 공용 게시글 중 중학교 자료'; PostTitle = '(중고) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_한문과' },
  [pscustomobject]@{ Seq = '15'; ArticleId = 777; Page = 4; Subject = '환경'; Scope = '중·고 공용 게시글 중 중학교 자료'; PostTitle = '(중고) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_환경과' },
  [pscustomobject]@{ Seq = '16'; ArticleId = 776; Page = 4; Subject = '보건'; Scope = '중·고 공용 게시글 중 중학교 자료'; PostTitle = '(중고) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_보건과' },
  [pscustomobject]@{ Seq = '17'; ArticleId = 778; Page = 4; Subject = '진로와 직업'; Scope = '중·고 공용 게시글 중 중학교 자료'; PostTitle = '(중고) 2022 개정 교육과정에 따른 성취수준 및 연구 보고서_진로와 직업' }
)

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
foreach ($page in ($articles.Page | Sort-Object -Unique)) {
  Invoke-WebRequest -Uri "https://ncic.re.kr/bbs/standard/list.do?page=$page" -WebSession $session -UseBasicParsing | Out-Null
}

$metadata = New-Object System.Collections.Generic.List[object]
$attachmentPattern = '<li>\s*<i[^>]+file_(?<icon>[^"\s]+)[^>]*></i>\s*<p class="tit">(?<title>.*?)</p>.*?<a href="(?<href>/bbs/download\.do\?articleIdx=\d+&fileName=[^"]+)"'

foreach ($article in $articles) {
  $viewUrl = "https://ncic.re.kr/bbs/standard/view/$($article.ArticleId).do?searchword=&searchkey=&page=$($article.Page)"
  $referer = "https://ncic.re.kr/bbs/standard/list.do?page=$($article.Page)"
  $html = (Invoke-WebRequest -Uri $viewUrl -WebSession $session -UseBasicParsing -Headers @{ Referer = $referer }).Content
  $plain = [System.Net.WebUtility]::HtmlDecode(($html -replace '<[^>]+>', ' ' -replace '\s+', ' ')).Trim()
  $postedAt = $null
  if ($plain -match '작성일\s+(?<dt>\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})') {
    $postedAt = $Matches.dt
  }

  $attachmentMatches = [regex]::Matches($html, $attachmentPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $selected = @()

  foreach ($match in $attachmentMatches) {
    $display = [System.Net.WebUtility]::HtmlDecode(($match.Groups['title'].Value -replace '<.*?>', '')).Trim()
    $originalName = ($display -replace '\s*\[[^\]]+\]\s*$', '').Trim()
    $type = $null
    if ($display -match '\[(?<type>[^,\]]+)') {
      $type = $Matches.type.Trim().ToLowerInvariant()
    }
    if ($type -ne 'pdf') {
      continue
    }

    $isReport = $originalName -match '연구|보고서|최종보고서'
    $isMiddleSubject = ($originalName -match '중학교|중등') -and ($originalName -notmatch '고등학교')
    if (-not ($isReport -or $isMiddleSubject)) {
      continue
    }

    $category = if ($isReport) { '연구보고서' } else { '성취수준' }
    $targetFile = if ($category -eq '성취수준') {
      "$($article.Seq)_$($article.Subject)_성취수준.pdf"
    } else {
      "$($article.Seq)_$($article.Subject)_성취수준_개발_연구보고서.pdf"
    }
    $targetDir = if ($category -eq '성취수준') { $levelDir } else { $reportDir }
    $targetPath = Join-Path $targetDir $targetFile
    $href = [System.Net.WebUtility]::HtmlDecode($match.Groups['href'].Value)
    $downloadUrl = "https://ncic.re.kr$href"

    Invoke-WebRequest -Uri $downloadUrl -WebSession $session -UseBasicParsing -Headers @{ Referer = $viewUrl } -OutFile $targetPath

    $bytes = (Get-Item -LiteralPath $targetPath).Length
    $stream = [System.IO.File]::OpenRead($targetPath)
    try {
      $buffer = New-Object byte[] 5
      [void]$stream.Read($buffer, 0, 5)
      $header = [System.Text.Encoding]::ASCII.GetString($buffer)
    } finally {
      $stream.Dispose()
    }
    if ($header -ne '%PDF-') {
      throw "Invalid PDF header for ${targetPath}: $header"
    }

    $hash = (Get-FileHash -LiteralPath $targetPath -Algorithm SHA256).Hash.ToLowerInvariant()
    $fileParam = ([uri]$downloadUrl).Query.TrimStart('?') -split '&' | Where-Object { $_ -like 'fileName=*' } | Select-Object -First 1
    $fileNameParam = if ($fileParam) { [uri]::UnescapeDataString(($fileParam -split '=', 2)[1]) } else { $null }

    $metadata.Add([pscustomobject]@{
      sequence = $article.Seq
      subject = $article.Subject
      scope = $article.Scope
      category = $category
      articleId = $article.ArticleId
      postTitle = $article.PostTitle
      postedAt = $postedAt
      sourcePageUrl = $viewUrl
      downloadUrl = $downloadUrl
      ncicFileName = $fileNameParam
      originalFileName = $originalName
      savedPath = ($targetPath.Substring($cwd.Path.Length + 1) -replace '\\', '/')
      bytes = $bytes
      sha256 = $hash
      pdfHeader = $header
    })
    $selected += $category
  }

  $missing = @('성취수준', '연구보고서') | Where-Object { $selected -notcontains $_ }
  if ($missing.Count -gt 0) {
    throw "Missing PDF category for article $($article.ArticleId) $($article.Subject): $($missing -join ', ')"
  }
}

if ($metadata.Count -ne 34) {
  throw "Expected 34 PDFs, downloaded $($metadata.Count)"
}

$generatedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
$jsonObject = [pscustomobject]@{
  generatedAt = $generatedAt
  source = 'NCIC 국가교육과정정보센터 성취수준 게시판'
  sourceListUrl = 'https://ncic.re.kr/bbs/standard/list.do'
  selectionRule = '2022 개정 교육과정 성취수준 게시글 중 제목이 (중) 또는 (중고)인 중학교 교과 자료 17건. PDF가 있는 경우 PDF를 우선 저장하고, 중·고 공용 게시글에서는 고등학교 전용 성취수준 PDF를 제외함.'
  subjectCount = 17
  pdfCount = $metadata.Count
  items = $metadata
}
$jsonObject | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $root 'manifest.json') -Encoding UTF8

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('# 중학교 성취수준 PDF 다운로드 매니페스트')
[void]$sb.AppendLine('')
[void]$sb.AppendLine("- 생성 시각: $generatedAt")
[void]$sb.AppendLine('- 출처: [NCIC 국가교육과정정보센터 성취수준 게시판](https://ncic.re.kr/bbs/standard/list.do)')
[void]$sb.AppendLine('- 기준: 2022 개정 교육과정 / 중학교 교과 성취수준')
[void]$sb.AppendLine('- 수집 범위: `(중)` 게시글과 중학교 자료가 포함된 `(중고)` 게시글 17건')
[void]$sb.AppendLine('- 선택 규칙: PDF가 있으면 PDF만 저장, `(중고)` 게시글의 고등학교 전용 성취수준 PDF는 제외, 연구보고서는 공용 자료로 저장')
[void]$sb.AppendLine('- HWP 처리: 모든 대상 과목에 PDF가 있어 HWP는 내려받지 않음')
[void]$sb.AppendLine("- 과목 수: 17개")
[void]$sb.AppendLine("- PDF 수: $($metadata.Count)개")
[void]$sb.AppendLine('- 기계 판독용 목록: `manifest.json`')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('## 파일 목록')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('| 순번 | 교과 | 분류 | 원본 파일명 | NCIC 게시글 | NCIC 첨부 파일명 | 바이트 | SHA-256 |')
[void]$sb.AppendLine('| --- | --- | --- | --- | ---: | --- | ---: | --- |')
foreach ($item in ($metadata | Sort-Object sequence, category)) {
  $orig = $item.originalFileName.Replace('|', '\|')
  $hashCell = "``$($item.sha256)``"
  [void]$sb.AppendLine("| $($item.sequence) | $($item.subject) | $($item.category) | $orig | $($item.articleId) | $($item.ncicFileName) | $($item.bytes) | $hashCell |")
}
[void]$sb.AppendLine('')
[void]$sb.AppendLine('## 검증')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('- 모든 저장 PDF의 첫 5바이트가 `%PDF-`임을 확인함.')
[void]$sb.AppendLine('- 저장된 PDF 수 34개가 수집 범위(17개 과목 x 성취수준/연구보고서 2종)와 일치함을 확인함.')
[void]$sb.AppendLine('- SHA-256 해시는 다운로드 직후 로컬 파일 기준으로 산출함.')
$sb.ToString() | Set-Content -LiteralPath (Join-Path $root 'DOWNLOAD_MANIFEST.md') -Encoding UTF8

$readme = @'
# 2022 개정 중학교 성취수준 PDF

NCIC 국가교육과정정보센터 성취수준 게시판에서 내려받은 2022 개정 교육과정 중학교 교과 성취수준 PDF 모음입니다.

## 구성

- `성취수준/`: 과목별 성취수준 본문 PDF 17개
- `연구보고서/`: 과목별 성취수준 개발 연구보고서 PDF 17개
- `DOWNLOAD_MANIFEST.md`: 사람이 읽기 위한 다운로드 출처, 선택 기준, 해시 목록
- `manifest.json`: 기계 판독용 다운로드 목록

## 수집 범위

NCIC 성취수준 게시판에서 제목이 `(중)`인 2022 개정 교육과정 중학교 교과 자료와, 중학교 자료가 포함된 `(중고)` 공용 자료를 수집했습니다. 정보, 한문, 보건, 환경, 진로와 직업은 NCIC에서 중·고 공용 게시글로 제공되며, 이 묶음에는 중학교 성취수준 PDF와 공용 연구보고서 PDF만 저장했습니다.

## 포함 교과

국어, 수학, 영어, 사회, 도덕, 역사, 과학, 체육, 음악, 미술, 기술·가정, 정보, 생활 외국어, 한문, 환경, 보건, 진로와 직업.

## 참고

성취기준 원문은 같은 상위 폴더의 `2022_개정_중학교_교육과정_PDF/교과/`에 있는 2022 개정 교육과정 고시 PDF에 포함되어 있습니다. 이 폴더의 성취수준 PDF는 성취기준별 성취수준과 관련 연구보고서를 함께 확인하기 위한 보조 묶음입니다.
'@
$readme | Set-Content -LiteralPath (Join-Path $root 'README.md') -Encoding UTF8

"Downloaded $($metadata.Count) PDFs for $($articles.Count) subjects to $root"



