// // src/services/textService.js
// import fs from 'fs';
// import pdfParse from 'pdf-parse';
// import mammoth from 'mammoth';
// import PPTXParser from 'pptx2json';
// import path from 'path';
// import PPTX2Json from 'pptx2json';


// export const extractText = async (filePath) => {
//   const ext = path.extname(filePath).toLowerCase();

//   if (ext === '.pdf') {
//     return await extractPdfText(filePath);
//   } else if (ext === '.docx') {
//     return await extractDocxText(filePath);
//   } else if (ext === '.pptx') {
//     return await extractPptxText(filePath);
//   } else {
//     throw new Error('Unsupported file format');
//   }
// };

// const extractPdfText = async (filePath) => {
//   const dataBuffer = fs.readFileSync(filePath);
//   const data = await pdfParse(dataBuffer);
//   return data.text;
// };

// const extractDocxText = async (filePath) => {
//   const data = await mammoth.extractRawText({ path: filePath });
//   return data.value;
// };

// const extractPptxText = async (filePath) => {
//   const parser = new PPTX2Json();
//   const slides = await parser.toJson(filePath);
//   console.log(slides,'slidess')
//   let text = "";
//   slides.forEach(slide => {
//     if (slide.texts) {
//       slide.texts.forEach(t => {
//         text += t + " ";
//       });
//     }
//   });
//   return text.trim();
// };

// src/services/textService.js
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import AdmZip from 'adm-zip';
import { parseStringPromise } from 'xml2js';

/**
 * Extract text from a file (PDF, DOCX, PPTX)
 * @param {string} filePath
 * @returns {Promise<string>}
 */
export const extractText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') return await extractPdfText(filePath);
  if (ext === '.docx') return await extractDocxText(filePath);
  if (ext === '.pptx') return await extractPptxText(filePath);

  throw new Error('Unsupported file format');
};

// ---------------- PDF ----------------
const extractPdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text.trim();
};

// ---------------- DOCX ----------------
const extractDocxText = async (filePath) => {
  const data = await mammoth.extractRawText({ path: filePath });
  return data.value.trim();
};

// ---------------- PPTX ----------------
const extractPptxText = async (filePath) => {
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries();

  let text = '';

  // Recursively extract text from XML object
  const extractTextFromObject = (obj) => {
    if (!obj) return '';
    let t = '';

    if (Array.isArray(obj)) {
      obj.forEach(item => { t += extractTextFromObject(item) + ' '; });
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        if ((key === '$t' || key === 'a:t') && typeof obj[key] === 'string') {
          t += obj[key] + ' ';
        } else {
          t += extractTextFromObject(obj[key]) + ' ';
        }
      }
    }
    return t.trim();
  };

  // Loop through slide XML files
  for (const entry of zipEntries) {
    if (entry.entryName.match(/ppt\/slides\/slide\d+\.xml$/)) {
      try {
        const xml = entry.getData().toString('utf8');
        const parsed = await parseStringPromise(xml, { explicitArray: false, mergeAttrs: true });
        text += ' ' + extractTextFromObject(parsed);
      } catch (err) {
        console.warn(`Failed to parse ${entry.entryName}:`, err.message);
      }
    }
  }

  return text.trim();
};
