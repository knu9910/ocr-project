import fs from "fs";
import { DocumentProcessorServiceClient } from "@google-cloud/documentai";

// GCP 설정
const projectId = "";
const location = "";
const processorId = "";
const keyFilename = "";

const client = new DocumentProcessorServiceClient({ keyFilename });

async function processLocalDocument(filePath: string) {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  // 파일 불러오기
  const imageFile = fs.readFileSync(filePath);
  const encodedImage = Buffer.from(imageFile).toString("base64");

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: "image/png", // 또는 application/pdf 등
    },
  };

  const [result] = await client.processDocument(request);
  const { document } = result;

  // 예: 추출된 필드 파싱 (Key-Value 기반 텍스트)
  console.log(document.entities);
}

// 예시 실행
processLocalDocument("./test.jpeg");
