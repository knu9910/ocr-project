// index.ts 또는 index.js
import vision from "@google-cloud/vision";
import {
  extractTaggedField,
  extractSimplePattern,
  extractAmount,
  extractDateTime,
  extractReceiptNumber,
  extractApprovalNumber,
} from "./utils/extracts/extracts";

const client = new vision.ImageAnnotatorClient({
  keyFilename: "./key.json",
});

async function detectReceiptInfo() {
  const [result] = await client.documentTextDetection("./test.jpeg");
  const fullText = result.fullTextAnnotation?.text || "";

  if (!fullText) {
    console.log("텍스트를 인식하지 못했습니다.");
    return;
  }

  console.log("📄 추출된 원본 텍스트:");
  console.log("=".repeat(40));
  console.log(fullText);
  console.log("=".repeat(40));

  // [] 태그로 감싸진 필드들 직접 추출
  const 매장명 = extractTaggedField(fullText, "매장명");
  const 사업자번호 = extractTaggedField(fullText, "사업자");
  const 주소 = extractTaggedField(fullText, "주소");
  const 전화번호 = extractTaggedField(fullText, "전화번호");
  const 매출일 = extractTaggedField(fullText, "매출일");
  const 영수증번호 = extractReceiptNumber(fullText);

  // 나머지 필드들은 간단한 패턴 매칭
  const 승인금액 = extractAmount(fullText);
  const 승인번호 = extractApprovalNumber(fullText);
  const 승인일시 = extractDateTime(fullText);
  const 가맹점번호 = extractSimplePattern(fullText, /가맹점.*?(\d{6,})/);

  console.log("\n📋 추출된 영수증 정보:");
  console.log("=".repeat(40));
  console.log("🏪 매장명:", 매장명);
  console.log("🔢 사업자번호:", 사업자번호);
  console.log("📍 주소:", 주소);
  console.log("📞 전화번호:", 전화번호);
  console.log("📅 매출일:", 매출일);
  console.log("🧾 영수증번호:", 영수증번호);
  console.log("💰 승인금액:", 승인금액);
  console.log("🔑 승인번호:", 승인번호);
  console.log("⏰ 승인일시:", 승인일시);
  console.log("🏬 가맹점번호:", 가맹점번호);
  console.log("=".repeat(40));

  console.log("\n✅ 모든 필드 추출 완료!");
}

detectReceiptInfo().catch(console.error);
