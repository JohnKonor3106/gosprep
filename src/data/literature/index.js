/**
 * Структура данных для учебной литературы по дисциплинам
 * 
 * Варианты хранения файлов:
 * 1. Локальные файлы: положить в /public/books/ и указать путь как '/books/filename.pdf'
 * 2. Внешние ссылки: указать полный URL (Google Drive, Яндекс.Диск и т.д.)
 * 
 * Для Google Drive используйте ссылку формата:
 * https://drive.google.com/uc?export=download&id=FILE_ID
 * 
 * Для Яндекс.Диска используйте публичную ссылку
 */

export const literatureConfig = {
  'administration-police': {
    // Основные учебники
    textbooks: [
      {
        id: 1,
        title: 'Административная деятельность полиции',
        author: 'Иванов И.И.',
        year: 2023,
        pages: 450,
        description: 'Основной учебник по курсу административной деятельности полиции',
        // Для локального файла:
        // downloadUrl: '/books/administration-police/admin-activity.pdf',
        // Для Google Drive:
        downloadUrl: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',
        // Или просто ссылка на внешний ресурс для просмотра:
        viewUrl: 'https://example.com/book-preview',
        fileSize: '15 MB',
        fileType: 'pdf',
      },
      {
        id: 2,
        title: 'Административное право России',
        author: 'Петров П.П.',
        year: 2022,
        pages: 380,
        description: 'Учебное пособие по административному праву',
        downloadUrl: null, // Если файл недоступен для скачивания
        viewUrl: 'https://example.com/book2',
        fileSize: null,
        fileType: null,
      },
    ],

    // Методические материалы
    methodological: [
      {
        id: 1,
        title: 'Методические рекомендации к экзамену',
        author: 'Кафедра административного права',
        year: 2024,
        downloadUrl: '/books/administration-police/methodology.pdf',
        fileSize: '2 MB',
        fileType: 'pdf',
      },
    ],

    // Нормативно-правовые акты
    legalBase: [
      {
        id: 1,
        title: 'Федеральный закон "О полиции"',
        number: '3-ФЗ',
        date: '07.02.2011',
        description: 'Основной закон, регулирующий деятельность полиции',
        url: 'http://www.consultant.ru/document/cons_doc_LAW_110165/',
      },
      {
        id: 2,
        title: 'КоАП РФ',
        number: '195-ФЗ',
        date: '30.12.2001',
        description: 'Кодекс об административных правонарушениях',
        url: 'http://www.consultant.ru/document/cons_doc_LAW_34661/',
      },
    ],

    // Информация о дисциплине
    about: {
      description: `Административная деятельность полиции — это урегулированная нормами административного права 
      деятельность полиции по обеспечению личной безопасности граждан, охране общественного порядка и 
      обеспечению общественной безопасности.`,
      examFormat: 'Устный экзамен по билетам (2 теоретических вопроса)',
      questionsCount: 60,
      hoursTotal: 144,
      credits: 4,
      semester: '5-6',
      department: 'Кафедра административного права и процесса',
    },
  },

  'criminal-law': {
    textbooks: [
      {
        id: 1,
        title: 'Уголовное право России. Общая часть',
        author: 'Сидоров С.С.',
        year: 2023,
        pages: 520,
        description: 'Учебник по общей части уголовного права',
        downloadUrl: null,
        viewUrl: null,
        fileSize: null,
        fileType: null,
      },
    ],
    methodological: [],
    legalBase: [
      {
        id: 1,
        title: 'Уголовный кодекс РФ',
        number: '63-ФЗ',
        date: '13.06.1996',
        description: 'Основной источник уголовного права',
        url: 'http://www.consultant.ru/document/cons_doc_LAW_10699/',
      },
    ],
    about: {
      description: `Уголовное право — отрасль права, регулирующая общественные отношения, 
      связанные с совершением преступных деяний, назначением наказания и применением иных мер 
      уголовно-правового характера.`,
      examFormat: 'Устный экзамен по билетам',
      questionsCount: 80,
      hoursTotal: 216,
      credits: 6,
      semester: '3-4',
      department: 'Кафедра уголовного права',
    },
  },

  'theory-state-law': {
    textbooks: [
      {
        id: 1,
        title: 'Теория государства и права',
        author: 'Матузов Н.И., Малько А.В.',
        year: 2021,
        pages: 640,
        description: 'Классический учебник по ТГП',
        downloadUrl: null,
        viewUrl: null,
        fileSize: null,
        fileType: null,
      },
    ],
    methodological: [],
    legalBase: [
      {
        id: 1,
        title: 'Конституция РФ',
        number: null,
        date: '12.12.1993',
        description: 'Основной закон государства',
        url: 'http://www.consultant.ru/document/cons_doc_LAW_28399/',
      },
    ],
    about: {
      description: `Теория государства и права — фундаментальная юридическая наука, 
      изучающая общие закономерности возникновения, развития и функционирования 
      государства и права.`,
      examFormat: 'Устный экзамен по билетам',
      questionsCount: 70,
      hoursTotal: 180,
      credits: 5,
      semester: '1-2',
      department: 'Кафедра теории и истории государства и права',
    },
  },
};

// Вспомогательная функция для получения литературы по дисциплине
export const getLiteratureByDiscipline = (disciplineId) => {
  return literatureConfig[disciplineId] || null;
};

