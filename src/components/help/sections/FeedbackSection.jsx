import { useState } from 'react'
import { 
  Box, Text, Heading, VStack, HStack, Card, Stack, 
  Button, Input, Textarea, Badge
} from '@chakra-ui/react'
import { FEEDBACK_TYPES, CONTACTS } from '@/constants'

/**
 * Раздел "Обратная связь" — форма для отправки сообщений
 */
export const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'suggestion',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error'

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSubmitStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.message.trim()) {
      return
    }

    setIsSubmitting(true)
    
    // Симуляция отправки (заменить на реальный API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Здесь можно добавить реальную отправку:
      // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(formData) })
      
      console.log('Feedback submitted:', formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', type: 'suggestion', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading size="xl" color="blue.700" mb={2}>
          💬 Обратная связь
        </Heading>
        <Text color="gray.600">
          Сообщите об ошибке, предложите улучшение или задайте вопрос
        </Text>
      </Box>

      {/* Форма обратной связи */}
      <Card.Root variant="outline">
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              {/* Тип обращения */}
              <Box>
                <Text fontWeight="medium" mb={2}>Тип обращения</Text>
                <HStack gap={2} flexWrap="wrap">
                  {FEEDBACK_TYPES.map(type => (
                    <Button
                      key={type.value}
                      size="sm"
                      variant={formData.type === type.value ? 'solid' : 'outline'}
                      colorPalette={formData.type === type.value ? type.color : 'gray'}
                      onClick={() => handleChange('type', type.value)}
                      type="button"
                    >
                      {type.label}
                    </Button>
                  ))}
                </HStack>
              </Box>

              {/* Имя (опционально) */}
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Ваше имя <Badge size="sm" colorPalette="gray">необязательно</Badge>
                </Text>
                <Input
                  placeholder="Как к вам обращаться?"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </Box>

              {/* Email (опционально) */}
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Email <Badge size="sm" colorPalette="gray">необязательно</Badge>
                </Text>
                <Input
                  type="email"
                  placeholder="Для ответа на ваше обращение"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Box>

              {/* Сообщение */}
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Сообщение <Badge size="sm" colorPalette="red">обязательно</Badge>
                </Text>
                <Textarea
                  placeholder="Опишите проблему или предложение..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={5}
                  required
                />
              </Box>

              {/* Статус отправки */}
              {submitStatus === 'success' && (
                <Box p={3} bg="green.50" borderRadius="md" borderLeft="4px solid" borderColor="green.400">
                  <Text color="green.700" fontWeight="medium">
                    ✅ Сообщение отправлено! Спасибо за обратную связь.
                  </Text>
                </Box>
              )}

              {submitStatus === 'error' && (
                <Box p={3} bg="red.50" borderRadius="md" borderLeft="4px solid" borderColor="red.400">
                  <Text color="red.700" fontWeight="medium">
                    ❌ Ошибка отправки. Попробуйте позже.
                  </Text>
                </Box>
              )}

              {/* Кнопка отправки */}
              <Button 
                type="submit" 
                colorPalette="blue" 
                size="lg"
                loading={isSubmitting}
                disabled={!formData.message.trim()}
              >
                📤 Отправить сообщение
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>

      {/* Альтернативные способы связи */}
      <Card.Root variant="subtle" bg="gray.50">
        <Card.Body>
          <Heading size="sm" color="gray.700" mb={3}>📮 Другие способы связи</Heading>
          <Stack gap={2}>
            <ContactItem 
              icon="📧" 
              label="Email" 
              value={CONTACTS.EMAIL} 
              href={`mailto:${CONTACTS.EMAIL}`}
            />
            <ContactItem 
              icon="💻" 
              label="GitHub" 
              value="github.com/JohnKonor3106/study-space" 
              href={CONTACTS.GITHUB}
            />
            <ContactItem 
              icon="📱" 
              label="Telegram" 
              value="@gosprep_bot" 
              href={CONTACTS.TELEGRAM}
            />
          </Stack>
        </Card.Body>
      </Card.Root>
    </VStack>
  )
}

// Контакт
const ContactItem = ({ icon, label, value, href }) => (
  <Box>
    {/* Мобильный layout (вертикальный) */}
    <VStack 
      gap={2} 
      align="flex-start"
      display={{ base: 'flex', md: 'none' }}
    >
      <HStack gap={2}>
        <Text>{icon}</Text>
        <Text fontSize="sm" color="gray.600" fontWeight="medium">{label}</Text>
      </HStack>
      <Button 
        as="a" 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        size="sm" 
        variant="ghost" 
        colorPalette="blue"
        whiteSpace="normal"
        wordBreak="break-all"
        textAlign="left"
        w="full"
        justifyContent="flex-start"
      >
        {value}
      </Button>
    </VStack>

    {/* Десктопный layout (горизонтальный) */}
    <HStack 
      justify="space-between"
      display={{ base: 'none', md: 'flex' }}
    >
      <HStack gap={2}>
        <Text>{icon}</Text>
        <Text fontSize="sm" color="gray.600">{label}</Text>
      </HStack>
      <Button 
        as="a" 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        size="sm" 
        variant="ghost" 
        colorPalette="blue"
        whiteSpace="nowrap"
        minW={0}
        maxW="100%"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {value}
      </Button>
    </HStack>
  </Box>
)

