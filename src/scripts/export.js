/**
 * Скрипт экспорта данных из PocketBase в статические файлы
 * 
 * Запуск: node src/scripts/export.js
 * 
 * Требования:
 * - PocketBase запущен
 * - Переменные окружения в .env:
 *   - PB_URL (опционально, по умолчанию http://127.0.0.1:8090)
 *   - PB_ADMIN_EMAIL
 *   - PB_ADMIN_PASSWORD
 */

import PocketBase from 'pocketbase';
import 'dotenv/config';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

// ============================================
// Конфигурация
// ============================================

const CONFIG = {
  pocketbase: {
    url: process.env.PB_URL || process.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090',
    email: process.env.PB_ADMIN_EMAIL,
    password: process.env.PB_ADMIN_PASSWORD,
  },
  collections: {
    disciplines: 'disciplines',
    questions: 'questions',
    answers: 'answers',
  },
  output: {
    questionsDir: join(PROJECT_ROOT, 'src/data/questions'),
    answersDir: join(PROJECT_ROOT, 'src/data/answers'),
  },
};

// ============================================
// Утилиты
// ============================================

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  section: (msg) => console.log(`\n📦 ${msg}\n${'─'.repeat(50)}`),
};

// ============================================
// Функции экспорта
// ============================================

/**
 * Авторизация в PocketBase
 */
async function authenticate(pb) {
  log.section('Авторизация');
  
  if (!CONFIG.pocketbase.email || !CONFIG.pocketbase.password) {
    throw new Error('Не указаны PB_ADMIN_EMAIL и PB_ADMIN_PASSWORD в .env');
  }

  await pb.collection('_superusers').authWithPassword(
    CONFIG.pocketbase.email,
    CONFIG.pocketbase.password
  );
  
  log.success(`Авторизован как ${CONFIG.pocketbase.email}`);
}

/**
 * Преобразование вопроса из PocketBase в формат статического файла
 */
function formatQuestion(pbQuestion) {
  return {
    id: pbQuestion.number || pbQuestion.id,
    structure_type: pbQuestion.structure_type || '',
    question_type: pbQuestion.question_type || 'theory',
    title: pbQuestion.title || '',
    topic: pbQuestion.topic || '',
    key_aspects: pbQuestion.key_aspects || [],
    prompt: pbQuestion.prompt || '',
    difficulty: pbQuestion.difficulty || 'medium',
    importance: pbQuestion.importance || 'core',
    estimated_time_minutes: pbQuestion.estimated_time_minutes || 0,
    tags: pbQuestion.tags || [],
    sources: pbQuestion.sources || [],
    learning_goals: pbQuestion.learning_goals || [],
    prerequisites: pbQuestion.prerequisites || [],
    ai_instructions: pbQuestion.ai_instructions || '',
    ai_answer_format: pbQuestion.ai_answer_format || 'markdown',
    language: pbQuestion.language || 'ru',
  };
}

/**
 * Преобразование ответа из PocketBase в формат статического файла
 */
function formatAnswer(pbAnswer) {
  return {
    id: pbAnswer.number || pbAnswer.id,
    structure_type: pbAnswer.structure_type || '',
    title: pbAnswer.decription || pbAnswer.title || '', // decription - опечатка в PB
    content: pbAnswer.content || {},
  };
}

/**
 * Генерация имени файла из slug дисциплины
 */
function getFileName(slug) {
  return slug.replace(/-/g, '-');
}

/**
 * Генерация имени переменной из slug (camelCase)
 */
function getVariableName(slug) {
  const parts = slug.split('-');
  return parts[0] + parts.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

/**
 * Экранирование строки для JavaScript
 */
function escapeString(str) {
  if (str.includes('\n') || str.includes('`')) {
    // Используем template literal для многострочных строк
    return '`' + str.replace(/`/g, '\\`').replace(/\${/g, '\\${') + '`';
  }
  return "'" + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
}

/**
 * Форматирование объекта в строку для экспорта
 */
function formatExportObject(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  const nextSpaces = '  '.repeat(indent + 1);
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => {
      if (typeof item === 'string') {
        return `${nextSpaces}${escapeString(item)}`;
      } else if (typeof item === 'object' && item !== null) {
        return `${nextSpaces}${formatExportObject(item, indent + 1)}`;
      } else {
        return `${nextSpaces}${JSON.stringify(item)}`;
      }
    }).join(',\n');
    return `[\n${items}\n${spaces}]`;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    
    const props = entries.map(([key, value]) => {
      const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      
      if (typeof value === 'string') {
        return `${formattedKey}: ${escapeString(value)}`;
      } else if (typeof value === 'object' && value !== null) {
        return `${formattedKey}: ${formatExportObject(value, indent + 1)}`;
      } else {
        return `${formattedKey}: ${JSON.stringify(value)}`;
      }
    }).join(',\n' + nextSpaces);
    
    return `{\n${nextSpaces}${props}\n${spaces}}`;
  }
  
  return JSON.stringify(obj);
}

/**
 * Сохранение вопросов в файл
 */
function saveQuestionsFile(discipline, questions) {
  const fileName = getFileName(discipline.slug);
  const varName = getVariableName(discipline.slug);
  const filePath = join(CONFIG.output.questionsDir, `${fileName}.js`);
  
  const exportData = {
    discipline: discipline.category || 'humanitarian',
    title: `${discipline.title}: учебные схемы анализа`,
    id: discipline.slug,
    questions: questions.map(formatQuestion),
  };
  
  const content = `export const ${varName}Questions = ${formatExportObject(exportData, 0)};\n`;
  
  // Создаём директорию если её нет
  mkdirSync(CONFIG.output.questionsDir, { recursive: true });
  
  writeFileSync(filePath, content, 'utf-8');
  log.success(`Сохранено: ${filePath} (${questions.length} вопросов)`);
  
  return filePath;
}

/**
 * Сохранение ответов в файл
 */
function saveAnswersFile(discipline, answers) {
  const fileName = getFileName(discipline.slug);
  const varName = getVariableName(discipline.slug);
  const filePath = join(CONFIG.output.answersDir, `${fileName}.js`);
  
  const exportData = {
    answers: answers.map(formatAnswer),
  };
  
  const content = `export const ${varName}Answer = ${formatExportObject(exportData, 0)};\n`;
  
  // Создаём директорию если её нет
  mkdirSync(CONFIG.output.answersDir, { recursive: true });
  
  writeFileSync(filePath, content, 'utf-8');
  log.success(`Сохранено: ${filePath} (${answers.length} ответов)`);
  
  return filePath;
}

/**
 * Экспорт дисциплины
 */
async function exportDiscipline(pb, discipline) {
  log.section(`Экспорт: ${discipline.title}`);
  
  try {
    // Загружаем вопросы
    const questions = await pb.collection(CONFIG.collections.questions).getFullList({
      filter: `discipline = "${discipline.id}"`,
      sort: 'number',
    });
    
    log.info(`Загружено вопросов: ${questions.length}`);
    
    // Загружаем ответы
    const questionIds = questions.map(q => q.id);
    let answers = [];
    
    if (questionIds.length > 0) {
      // Разбиваем на чанки по 30 (PocketBase ограничение фильтра)
      const chunks = [];
      for (let i = 0; i < questionIds.length; i += 30) {
        chunks.push(questionIds.slice(i, i + 30));
      }
      
      for (const chunk of chunks) {
        try {
          const filter = chunk.map(id => `question = "${id}"`).join(' || ');
          const chunkAnswers = await pb.collection(CONFIG.collections.answers).getFullList({
            filter,
          });
          answers = answers.concat(chunkAnswers);
        } catch (error) {
          log.warn(`Ошибка загрузки ответов для чанка: ${error.message}`);
          // Fallback: загружаем по одному
          for (const id of chunk) {
            try {
              const singleAnswer = await pb.collection(CONFIG.collections.answers).getFirstListItem(
                `question = "${id}"`,
                { $autoCancel: false }
              );
              if (singleAnswer) {
                answers.push(singleAnswer);
              }
            } catch (err) {
              // Ответа может не быть - это нормально
            }
          }
        }
      }
    }
    
    log.info(`Загружено ответов: ${answers.length}`);
    
    // Сортируем ответы по number (соответствует question.id)
    answers.sort((a, b) => (a.number || 0) - (b.number || 0));
    
    // Сохраняем файлы
    saveQuestionsFile(discipline, questions);
    saveAnswersFile(discipline, answers);
    
    return {
      questions: questions.length,
      answers: answers.length,
    };
  } catch (error) {
    log.error(`Ошибка экспорта ${discipline.slug}: ${error.message}`);
    throw error;
  }
}

/**
 * Основная функция экспорта
 */
async function exportData() {
  console.log('\n📥 ЭКСПОРТ ДАННЫХ ИЗ POCKETBASE');
  console.log('═'.repeat(50));
  console.log(`URL: ${CONFIG.pocketbase.url}\n`);

  const pb = new PocketBase(CONFIG.pocketbase.url);

  // 1. Авторизация
  await authenticate(pb);

  // 2. Загрузка дисциплин
  log.section('Загрузка дисциплин');
  const disciplines = await pb.collection(CONFIG.collections.disciplines).getFullList({
    sort: 'order',
  });
  
  log.success(`Найдено дисциплин: ${disciplines.length}`);
  
  if (disciplines.length === 0) {
    log.warn('Нет дисциплин для экспорта');
    return;
  }

  // 3. Экспорт каждой дисциплины
  log.section('Экспорт данных');
  
  const stats = {
    disciplines: 0,
    questions: 0,
    answers: 0,
    errors: 0,
  };
  
  for (const discipline of disciplines) {
    try {
      const result = await exportDiscipline(pb, discipline);
      stats.disciplines++;
      stats.questions += result.questions;
      stats.answers += result.answers;
    } catch (error) {
      stats.errors++;
      log.error(`Не удалось экспортировать ${discipline.slug}: ${error.message}`);
    }
  }

  // 4. Статистика
  log.section('Статистика экспорта');
  console.log(`
  Дисциплины:  ${stats.disciplines} экспортировано
  Вопросы:     ${stats.questions} экспортировано
  Ответы:       ${stats.answers} экспортировано
  Ошибки:       ${stats.errors}
  `);

  console.log('🎉 Экспорт завершён!\n');
  console.log(`📁 Файлы сохранены в:`);
  console.log(`   ${CONFIG.output.questionsDir}`);
  console.log(`   ${CONFIG.output.answersDir}\n`);
}

// ============================================
// Запуск
// ============================================

exportData().catch((err) => {
  console.error('\n💥 Критическая ошибка:', err.message);
  console.error(err.stack);
  process.exit(1);
});

