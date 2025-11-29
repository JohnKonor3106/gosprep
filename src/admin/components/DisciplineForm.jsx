import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  Alert,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react'
import { pb } from '@/services/pocketbase'
import { ADMIN_ROUTES } from '@/admin/constants/routes'
import { withAuditFields } from '@/admin/utils/auditFields'

const CATEGORY_OPTIONS = [
  { value: 'humanitarian', label: 'Гуманитарные' },
  { value: 'technical', label: 'Технические' },
  { value: 'legal', label: 'Юридические' },
]

const DisciplineForm = ({ discipline = null, isEdit = false }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    title: discipline?.title || '',
    slug: discipline?.slug || '',
    description: discipline?.description || '',
    category: discipline?.category || 'humanitarian',
    order: discipline?.order ?? 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)

    // Автогенерация slug из title
    if (name === 'title' && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[а-яё]/g, (char) => {
          const map = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
            'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
          }
          return map[char] || char
        })
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .slice(0, 50)
      
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const baseData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        order: parseInt(formData.order, 10) || 0,
      }

      // Добавляем поля аудита (кто изменил)
      const data = withAuditFields(baseData, isEdit)

      if (isEdit && discipline?.id) {
        await pb.collection('disciplines').update(discipline.id, data)
      } else {
        await pb.collection('disciplines').create(data)
      }

      navigate(ADMIN_ROUTES.DISCIPLINES)
    } catch (err) {
      console.error('Ошибка сохранения:', err)
      
      let errorMsg = 'Ошибка сохранения дисциплины'
      if (err.data?.data?.slug?.code === 'validation_not_unique') {
        errorMsg = 'Такой slug уже существует'
      }
      
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        {error && (
          <Alert.Root status="error" borderRadius="md">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
          <Heading size="md" mb={4}>Основная информация</Heading>
          
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Название *
              </Text>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Административная деятельность полиции"
                required
              />
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Slug (URL) *
              </Text>
              <Input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="administration-police"
                required
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Будет использоваться в URL: /disciplines/{formData.slug || 'slug'}
              </Text>
            </Box>

            <Box>
              <Text mb={1} fontSize="sm" fontWeight="medium">
                Описание
              </Text>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Краткое описание дисциплины..."
                rows={3}
              />
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text mb={1} fontSize="sm" fontWeight="medium">
                  Категория
                </Text>
                <Box
                  as="select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  w="full"
                  p={2}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Box>
              </Box>

              <Box>
                <Text mb={1} fontSize="sm" fontWeight="medium">
                  Порядок сортировки
                </Text>
                <Input
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="0"
                />
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        <HStack spacing={4} justify="flex-end">
          <Button
            variant="outline"
            onClick={() => navigate(ADMIN_ROUTES.DISCIPLINES)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            loading={isLoading}
            loadingText="Сохранение..."
          >
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default DisciplineForm

