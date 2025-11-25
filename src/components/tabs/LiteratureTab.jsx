import { Box, Text, Heading, VStack, HStack, Badge, Button, Card, Stack } from '@chakra-ui/react'
import { DownloadIcon, ExternalLinkIcon, BookIcon } from './icons'

// Карточка книги
const BookCard = ({ book, variant = 'textbook' }) => {
  const borderColor = variant === 'methodological' ? 'green.200' : 'blue.200'
  const bgColor = variant === 'methodological' ? 'green.50' : 'blue.50'
  const accentColor = variant === 'methodological' ? 'green.600' : 'blue.600'

  const handleDownload = () => {
    if (!book.downloadUrl) return
    
    if (book.isExternal) {
      // Внешние ссылки — просто открываем
      window.open(book.downloadUrl, '_blank')
    } else {
      // Локальные файлы — принудительное скачивание
      const link = document.createElement('a')
      link.href = book.downloadUrl
      link.download = book.fileName || `${book.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleView = () => {
    if (book.viewUrl) {
      window.open(book.viewUrl, '_blank')
    }
  }

  return (
    <Card.Root 
      variant="outline" 
      borderColor={borderColor}
      bg={bgColor}
      _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
      transition="all 0.2s"
    >
      <Card.Body>
        <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={3}>
          <VStack align="start" gap={1} flex={1} minW="200px">
            <Text fontWeight="bold" color={accentColor} fontSize="md">
              {book.title}
            </Text>
            {book.author && (
              <Text fontSize="sm" color="gray.600">
                {book.author}
              </Text>
            )}
            <HStack gap={2} flexWrap="wrap">
              {book.year && (
                <Badge colorPalette="gray" size="sm">{book.year} г.</Badge>
              )}
              {book.pages && (
                <Badge colorPalette="gray" size="sm">{book.pages} стр.</Badge>
              )}
              {book.fileSize && (
                <Badge colorPalette="blue" size="sm">{book.fileSize}</Badge>
              )}
              {book.fileType && (
                <Badge colorPalette="purple" size="sm">{book.fileType.toUpperCase()}</Badge>
              )}
            </HStack>
            {book.description && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {book.description}
              </Text>
            )}
          </VStack>

          <HStack gap={2}>
            {book.downloadUrl && (
              <Button 
                size="sm" 
                colorPalette="blue" 
                onClick={handleDownload}
              >
                <DownloadIcon />
                Скачать
              </Button>
            )}
            {book.viewUrl && (
              <Button 
                size="sm" 
                variant="outline" 
                colorPalette="blue"
                onClick={handleView}
              >
                <ExternalLinkIcon />
                Просмотр
              </Button>
            )}
            {!book.downloadUrl && !book.viewUrl && (
              <Badge colorPalette="orange" size="sm">Нет ссылки</Badge>
            )}
          </HStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  )
}

export const LiteratureTab = ({ literature }) => {
  const textbooks = literature?.textbooks || []
  const methodological = literature?.methodological || []

  const hasContent = textbooks.length > 0 || methodological.length > 0

  if (!hasContent) {
    return (
      <Box p={6} bg="gray.50" borderRadius="lg" textAlign="center">
        <HStack justify="center" mb={2}>
          <BookIcon />
        </HStack>
        <Text color="gray.500">Учебная литература пока не добавлена</Text>
      </Box>
    )
  }

  return (
    <VStack gap={6} align="stretch">
      {textbooks.length > 0 && (
        <Box>
          <Heading size="md" mb={4} color="blue.600">
            📖 Основные учебники
          </Heading>
          <Stack gap={3}>
            {textbooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </Stack>
        </Box>
      )}

      {methodological.length > 0 && (
        <Box>
          <Heading size="md" mb={4} color="green.600">
            📋 Методические материалы
          </Heading>
          <Stack gap={3}>
            {methodological.map((item) => (
              <BookCard key={item.id} book={item} variant="methodological" />
            ))}
          </Stack>
        </Box>
      )}
    </VStack>
  )
}

