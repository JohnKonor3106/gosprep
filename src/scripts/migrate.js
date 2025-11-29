
//  * Скрипт миграции данных в PocketBase
//  * 
//  * Запуск: node src/scripts/migrate.js
//  * 
//  * Требования:
//  * - PocketBase запущен
//  * - Переменные окружения в .env:


import PocketBase from 'pocketbase';
import 'dotenv/config';

// ============================================
// Импорт данных
// ============================================

import { administrationPoliceQuestions } from '../data/questions/administration-police.js';
import { administrationPoliceAnswer } from '../data/answers/administration-police.js';
import { criminalLawQuestions } from '../data/questions/criminal-law.js';
import { criminalLawAnswer } from '../data/answers/criminal-law.js';
import { theoryStateLawQuestions } from '../data/questions/theory-state-law.js';
import { theoryStateLawAnswer } from '../data/answers/theory-state-law.js';

// ============================================
// Конфигурация
// ============================================

const CONFIG = {
  pocketbase: {
    url: process.env.PB_URL || 'http://127.0.0.1:8090',
    email: process.env.PB_ADMIN_EMAIL,
    password: process.env.PB_ADMIN_PASSWORD,
  },
  collections: {
    disciplines: 'disciplines',
    questions: 'questions',
    answers: 'answers',
  },
};

const DISCIPLINES = [
  {
    slug: 'administration-police',
    title: 'Административная деятельность',
    description: 'Административная деятельность полиции: учебные схемы анализа',
    category: 'humanitarian',
    questions: administrationPoliceQuestions.questions,
    answers: administrationPoliceAnswer.answers,
  },
  {
    slug: 'criminal-law',
    title: 'Уголовное право',
    description: 'Уголовное право: учебные схемы анализа',
    category: 'humanitarian',
    questions: criminalLawQuestions.questions,
    answers: criminalLawAnswer.answers,
  },
  {
    slug: 'theory-state-law',
    title: 'Теория государства и права',
    description: 'Теория государства и права: учебные схемы анализа',
    category: 'humanitarian',
    questions: theoryStateLawQuestions.questions,
    answers: theoryStateLawAnswer.answers,
  },
];

// ============================================
// Утилиты
// ============================================

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  section: (msg) => console.log(`\n📦 ${msg}\n${'─'.repeat(40)}`),
};

const stats = {
  disciplines: { created: 0, failed: 0 },
  questions: { created: 0, failed: 0 },
  answers: { created: 0, failed: 0 },
};

// ============================================
// Функции миграции
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
 * Создание дисциплины
 */
async function createDiscipline(pb, discipline, order) {
  try {
    const record = await pb.collection(CONFIG.collections.disciplines).create({
      slug: discipline.slug,
      title: discipline.title,
      description: discipline.description,
      category: discipline.category,
      order: order,
    });
    
    stats.disciplines.created++;
    log.success(`Дисциплина: ${discipline.title}`);
    return record.id;
  } catch (err) {
    stats.disciplines.failed++;
    log.error(`Дисциплина ${discipline.slug}: ${err.message}`);
    return null;
  }
}

/**
 * Создание вопроса
 */
async function createQuestion(pb, disciplineId, question) {
  const record = await pb.collection(CONFIG.collections.questions).create({
    discipline: disciplineId,
    number: question.id,
    structure_type: question.structure_type || '',
    question_type: question.question_type || 'theory',
    title: question.title,
    topic: question.topic || '',
    prompt: question.prompt || '',
    key_aspects: question.key_aspects || [],
    difficulty: question.difficulty || 'medium',
    importance: question.importance || 'core',
    estimated_time_minutes: question.estimated_time_minutes || 0,
    tags: question.tags || [],
    sources: question.sources || [],
    learning_goals: question.learning_goals || [],
    prerequisites: question.prerequisites || [],
    ai_instructions: question.ai_instructions || '',
  });
  
  stats.questions.created++;
  return record;
}

/**
 * Создание ответа
 */
async function createAnswer(pb, questionId, answer, disciplineTitle) {
  await pb.collection(CONFIG.collections.answers).create({
    question: questionId,
    number: answer.id,
    structure_type: answer.structure_type || '',
    title: disciplineTitle,
    decription: answer.title || '',  // Внимание: опечатка в PocketBase (без 's')
    content: answer.content || {},
  });
  
  stats.answers.created++;
}

/**
 * Миграция вопросов и ответов для дисциплины
 */
async function migrateQuestionsAndAnswers(pb, disciplineId, discipline) {
  const questions = discipline.questions || [];
  const answers = discipline.answers || [];
  
  for (const question of questions) {
    try {
      // Создаём вопрос
      const questionRecord = await createQuestion(pb, disciplineId, question);
      
      // Ищем и создаём ответ
      const answer = answers.find(a => a.id === question.id);
      if (answer) {
        await createAnswer(pb, questionRecord.id, answer, discipline.title);
        console.log(`   ✅ Вопрос ${question.id} + ответ`);
      } else {
        console.log(`   ✅ Вопрос ${question.id} (без ответа)`);
      }
    } catch (err) {
      stats.questions.failed++;
      console.error(`   ❌ Вопрос ${question.id}: ${err.message}`);
      
      if (err.data) {
        console.error(`      Детали:`, JSON.stringify(err.data, null, 2));
      }
    }
  }
}

/**
 * Основная функция миграции
 */
async function migrate() {
  console.log('\n🚀 МИГРАЦИЯ ДАННЫХ В POCKETBASE');
  console.log('═'.repeat(40));
  console.log(`URL: ${CONFIG.pocketbase.url}\n`);

  const pb = new PocketBase(CONFIG.pocketbase.url);

  // 1. Авторизация
  await authenticate(pb);

  // 2. Создание дисциплин
  log.section('Создание дисциплин');
  
  const disciplineIds = {};
  
  for (let i = 0; i < DISCIPLINES.length; i++) {
    const discipline = DISCIPLINES[i];
    const id = await createDiscipline(pb, discipline, i);
    if (id) {
      disciplineIds[discipline.slug] = id;
    }
  }

  // 3. Создание вопросов и ответов
  log.section('Создание вопросов и ответов');
  
  for (const discipline of DISCIPLINES) {
    const disciplineId = disciplineIds[discipline.slug];
    
    if (!disciplineId) {
      log.warn(`Пропуск ${discipline.slug} (дисциплина не создана)`);
      continue;
    }
    
    console.log(`\n📖 ${discipline.title}:`);
    await migrateQuestionsAndAnswers(pb, disciplineId, discipline);
  }

  // 4. Статистика
  log.section('Статистика');
  console.log(`
  Дисциплины:  ${stats.disciplines.created} создано, ${stats.disciplines.failed} ошибок
  Вопросы:     ${stats.questions.created} создано, ${stats.questions.failed} ошибок
  Ответы:      ${stats.answers.created} создано, ${stats.answers.failed} ошибок
  `);

  console.log('🎉 Миграция завершена!\n');
}

// ============================================
// Запуск
// ============================================

migrate().catch((err) => {
  console.error('\n💥 Критическая ошибка:', err.message);
  process.exit(1);
});
