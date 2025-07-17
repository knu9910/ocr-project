// [] 태그로 감싸진 필드 추출 함수
export function extractTaggedField(text: string, fieldName: string): string {
  const pattern = new RegExp(
    `\\[${fieldName}\\]\\s*([^\\[]+?)(?:\\s*\\[|$)`,
    "i"
  );
  const match = text.match(pattern);

  if (match) {
    let value = match[1].trim();

    // 필드별 특별 처리
    if (fieldName === "매장명") {
      // 매장명: 숫자 제거하지 않음 (원본 그대로)
      return value;
    } else if (
      fieldName === "사업자" ||
      fieldName === "전화번호" ||
      fieldName === "매출일"
    ) {
      // 숫자로 시작하는 필드들: 숫자 제거하지 않음
      // 그대로 반환
    } else {
      // 기타 필드: 앞의 숫자와 공백 제거
      value = value.replace(/^[\d\s]+/, "").trim();
    }

    return value;
  }

  return "미발견";
}

// 간단한 패턴 매칭 함수 (영수증번호 패턴 개선)
export function extractSimplePattern(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  return match ? match[1] : "미발견";
}

// 승인금액 전용 추출 함수 (3,000원 형태 우선)
export function extractAmount(text: string): string {
  // 3,000원 같은 패턴 우선 검색
  const commaPattern = text.match(/(\d{1,3}(?:,\d{3})+)/);
  if (commaPattern) return commaPattern[1];

  // 3000원 같은 패턴
  const numberPattern = text.match(/(\d{4,})/);
  if (numberPattern) return numberPattern[1];

  return "미발견";
}

// 승인일시 전용 추출 함수 (년월일 시:분:초)
export function extractDateTime(text: string): string {
  // 2025-07-06 13:12:07 형태
  const fullPattern = text.match(
    /(20\d{2}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}:\d{2})/
  );
  if (fullPattern) return fullPattern[1];

  // 시:분:초만
  const timePattern = text.match(/(\d{2}:\d{2}:\d{2})/);
  if (timePattern) return timePattern[1];

  return "미발견";
}

// 영수증번호 전용 추출 함수 (더 구체적인 패턴)
export function extractReceiptNumber(text: string): string {
  // 20XXXXXX-XX-XXXX 패턴
  const pattern1 = text.match(/(20\d{6}-\d{2}-\d{4})/);
  if (pattern1) return pattern1[1];

  // 긴 숫자 조합 (12자리 이상)
  const pattern2 = text.match(/(\d{12,})/);
  if (pattern2) return pattern2[1];

  return "미발견";
}

// 승인번호 전용 추출 함수 (날짜 등 제외)
export function extractApprovalNumber(text: string): string {
  // 8자리 숫자들을 모두 찾기
  const matches = text.match(/\b(\d{8})\b/g);
  if (!matches) return "미발견";

  for (const match of matches) {
    // 날짜 패턴 제외 (20XXXXXX 형태)
    if (match.startsWith("202")) continue;

    // 영수증번호에 포함된 숫자 제외
    if (
      text.includes(
        `${match.slice(0, 4)}-${match.slice(4, 6)}-${match.slice(6)}`
      )
    )
      continue;

    // 사업자번호에 포함된 숫자 제외
    if (
      text.includes(
        `${match.slice(0, 3)}-${match.slice(3, 5)}-${match.slice(5)}`
      )
    )
      continue;

    return match;
  }

  return matches[0] || "미발견";
}
