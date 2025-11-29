import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Input,
  Button,
  Table,
  Flex,
  Separator,
  Avatar,
} from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'

// Цвета для разных действий
const ACTION_COLORS = {
  create: 'green',
  update: 'blue',
  delete: 'red',
}

// Иконки для действий
const ACTION_ICONS = {
  create: '➕',
  update: '✏️',
  delete: '🗑️',
}

// Названия коллекций на русском
const COLLECTION_NAMES = {
  disciplines: 'Дисциплины',
  questions: 'Вопросы',
  answers: 'Ответы',
}

const ActivityLogs = () => {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const perPage = 50

  // Загрузка логов
  const loadLogs = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const allLogs = []
      const collections = ['disciplines', 'questions', 'answers']
      
      for (const collection of collections) {
        try {
          const records = await pb.collection(collection).getFullList({
            sort: '-updated',
          })
          
          records.forEach(record => {
            // Запись о создании
            allLogs.push({
              id: `${collection}-create-${record.id}`,
              action: 'create',
              collection,
              recordId: record.id,
              recordTitle: record.title || `#${record.number}` || record.id,
              timestamp: record.created,
              user: record.created_by_name || record.created_by_email || null,
              userEmail: record.created_by_email,
            })
            
            // Если обновлялась после создания
            if (record.updated !== record.created) {
              allLogs.push({
                id: `${collection}-update-${record.id}-${record.updated}`,
                action: 'update',
                collection,
                recordId: record.id,
                recordTitle: record.title || `#${record.number}` || record.id,
                timestamp: record.modified_at || record.updated,
                user: record.modified_by_name || record.modified_by_email || null,
                userEmail: record.modified_by_email,
              })
            }
          })
        } catch (err) {
          console.error(`Ошибка загрузки ${collection}:`, err)
        }
      }
      
      // Сортируем по времени (новые сверху)
      allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      // Фильтрация
      let filteredLogs = allLogs
      if (filter) {
        const lowerFilter = filter.toLowerCase()
        filteredLogs = allLogs.filter(log => 
          log.recordTitle?.toLowerCase().includes(lowerFilter) ||
          log.collection.toLowerCase().includes(lowerFilter) ||
          log.action.toLowerCase().includes(lowerFilter) ||
          log.user?.toLowerCase().includes(lowerFilter)
        )
      }
      
      // Пагинация
      const total = Math.ceil(filteredLogs.length / perPage)
      setTotalPages(total || 1)
      
      const start = (page - 1) * perPage
      const paginatedLogs = filteredLogs.slice(start, start + perPage)
      
      setLogs(paginatedLogs)
    } catch (err) {
      console.error('Ошибка загрузки логов:', err)
      setError('Не удалось загрузить логи активности')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [page, filter])

  // Форматирование даты
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Относительное время
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'только что'
    if (diffMins < 60) return `${diffMins} мин. назад`
    if (diffHours < 24) return `${diffHours} ч. назад`
    if (diffDays < 7) return `${diffDays} дн. назад`
    return formatDate(dateStr)
  }

  // Описание действия
  const getActionDescription = (log) => {
    const collectionName = COLLECTION_NAMES[log.collection] || log.collection
    
    switch (log.action) {
      case 'create':
        return `Создано в "${collectionName}"`
      case 'update':
        return `Обновлено в "${collectionName}"`
      case 'delete':
        return `Удалено из "${collectionName}"`
      default:
        return log.action
    }
  }

  return (
    <Box>
      <VStack align="stretch" spacing={6}>
        {/* Заголовок */}
        <Box>
          <Heading size="lg" mb={2}>📋 Журнал активности</Heading>
          <Text color="gray.500">
            История изменений контента с информацией о редакторах
          </Text>
        </Box>

        {/* Фильтры */}
        <HStack spacing={4}>
          <Input
            placeholder="Поиск по названию, редактору..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setPage(1)
            }}
            maxW="400px"
            bg="white"
          />
          <Button
            variant="outline"
            onClick={() => {
              setFilter('')
              setPage(1)
            }}
          >
            Сбросить
          </Button>
          <Button
            colorScheme="blue"
            variant="ghost"
            onClick={loadLogs}
          >
            🔄 Обновить
          </Button>
        </HStack>

        {/* Легенда */}
        <HStack spacing={4} flexWrap="wrap">
          <Badge colorScheme="green" px={3} py={1} borderRadius="full">
            ➕ Создание
          </Badge>
          <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
            ✏️ Обновление
          </Badge>
        </HStack>

        <Separator />

        {/* Таблица логов */}
        {isLoading ? (
          <Box py={12} textAlign="center">
            <Spinner size="xl" color="blue.500" />
            <Text mt={4} color="gray.500">Загрузка логов...</Text>
          </Box>
        ) : error ? (
          <Box py={12} textAlign="center">
            <Text color="red.500">{error}</Text>
          </Box>
        ) : logs.length === 0 ? (
          <Box py={12} textAlign="center">
            <Text color="gray.500">Нет записей</Text>
          </Box>
        ) : (
          <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row bg="gray.50">
                  <Table.ColumnHeader w="50px">Тип</Table.ColumnHeader>
                  <Table.ColumnHeader>Действие</Table.ColumnHeader>
                  <Table.ColumnHeader>Запись</Table.ColumnHeader>
                  <Table.ColumnHeader>Редактор</Table.ColumnHeader>
                  <Table.ColumnHeader w="180px">Время</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {logs.map((log) => (
                  <Table.Row key={log.id} _hover={{ bg: 'gray.50' }}>
                    <Table.Cell>
                      <Text fontSize="xl">
                        {ACTION_ICONS[log.action] || '📝'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorScheme={ACTION_COLORS[log.action] || 'gray'}>
                        {getActionDescription(log)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text fontWeight="medium" noOfLines={1}>
                        {log.recordTitle || '—'}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        ID: {log.recordId.slice(0, 8)}...
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      {log.user ? (
                        <HStack spacing={2}>
                          <Avatar.Root size="xs">
                            <Avatar.Fallback>
                              {log.user.charAt(0).toUpperCase()}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="medium">
                              {log.user}
                            </Text>
                            {log.userEmail && log.userEmail !== log.user && (
                              <Text fontSize="xs" color="gray.400">
                                {log.userEmail}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      ) : (
                        <Text fontSize="sm" color="gray.400" fontStyle="italic">
                          Не указан
                        </Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {getRelativeTime(log.timestamp)}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          {formatDate(log.timestamp)}
                        </Text>
                      </VStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}

        {/* Пагинация */}
        {totalPages > 1 && (
          <Flex justify="center" gap={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Назад
            </Button>
            <HStack spacing={1}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={page === pageNum ? 'solid' : 'outline'}
                    colorScheme={page === pageNum ? 'blue' : 'gray'}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </HStack>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Вперёд →
            </Button>
          </Flex>
        )}

        {/* Информация */}
        <Box bg="green.50" p={4} borderRadius="md">
          <Text fontSize="sm" color="green.800">
            ✅ <strong>Отслеживание редакторов включено!</strong> Теперь при сохранении записей 
            автоматически записывается информация о редакторе (имя, email). 
            Старые записи без информации о редакторе будут обновлены при следующем редактировании.
          </Text>
        </Box>

        {/* Инструкция для PocketBase */}
        <Box bg="yellow.50" p={4} borderRadius="md">
          <Text fontSize="sm" color="yellow.800" mb={2}>
            ⚠️ <strong>Важно:</strong> Для работы этой функции нужно добавить поля в PocketBase:
          </Text>
          <Box as="pre" fontSize="xs" bg="white" p={3} borderRadius="md" overflowX="auto">
{`# В каждую коллекцию (disciplines, questions, answers) добавьте поля:

created_by        - Text (необязательное)
created_by_email  - Text (необязательное)  
created_by_name   - Text (необязательное)
modified_by       - Text (необязательное)
modified_by_email - Text (необязательное)
modified_by_name  - Text (необязательное)
modified_at       - Text (необязательное)`}
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}

export default ActivityLogs
