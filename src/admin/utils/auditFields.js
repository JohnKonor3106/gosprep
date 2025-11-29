/**
 * Утилиты для аудита изменений
 * 
 * Добавляет информацию о том, кто создал/изменил запись
 */

import { pb } from '@/services/pocketbase'

/**
 * Добавляет поля аудита к данным записи
 * 
 * @param {Object} data - Данные записи
 * @param {boolean} isEdit - Редактирование (true) или создание (false)
 * @returns {Object} - Данные с полями аудита
 */
export const withAuditFields = (data, isEdit = false) => {
  const userId = pb.authStore.model?.id
  const userEmail = pb.authStore.model?.email
  const userName = pb.authStore.model?.name
  
  const now = new Date().toISOString()
  
  if (isEdit) {
    return {
      ...data,
      modified_by: userId || null,
      modified_by_email: userEmail || null,
      modified_by_name: userName || null,
      modified_at: now,
    }
  } else {
    return {
      ...data,
      created_by: userId || null,
      created_by_email: userEmail || null,
      created_by_name: userName || null,
      modified_by: userId || null,
      modified_by_email: userEmail || null,
      modified_by_name: userName || null,
      modified_at: now,
    }
  }
}

/**
 * Получает информацию о редакторе из записи
 * 
 * @param {Object} record - Запись из PocketBase
 * @returns {Object} - Информация о редакторе
 */
export const getEditorInfo = (record) => {
  return {
    createdBy: {
      id: record.created_by,
      email: record.created_by_email,
      name: record.created_by_name || record.created_by_email || 'Неизвестно',
    },
    modifiedBy: {
      id: record.modified_by,
      email: record.modified_by_email,
      name: record.modified_by_name || record.modified_by_email || 'Неизвестно',
    },
    modifiedAt: record.modified_at,
  }
}

