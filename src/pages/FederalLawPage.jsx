import { Box, Heading, Text, VStack, Card } from '@chakra-ui/react'

const FederalLawPage = () => {
  return (
    <Box maxW="800px" mx="auto" px={{ base: 4, md: 6 }}>
      <VStack spacing={8} align="center" py={{ base: 8, md: 12 }}>
        {/* Иконка */}
        <Box
          w={{ base: '80px', md: '100px' }}
          h={{ base: '80px', md: '100px' }}
          borderRadius="full"
          bg="blue.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={{ base: '40px', md: '50px' }}
        >
          ⚖️
        </Box>

        {/* Заголовок */}
        <VStack spacing={4} textAlign="center">
          <Heading 
            size={{ base: 'xl', md: '2xl' }} 
            color="blue.700"
            fontWeight="bold"
          >
            ⚖️ Федеральные законы
          </Heading>
          <Text 
            fontSize={{ base: 'md', md: 'lg' }} 
            color="gray.600"
            maxW="600px"
          >
            Раздел находится в разработке
          </Text>
        </VStack>

        {/* Информационная карточка */}
        <Card.Root 
          p={{ base: 6, md: 8 }} 
          bg="blue.50" 
          borderColor="blue.200"
          maxW="600px"
          w="full"
        >
          <Card.Body>
            <VStack spacing={4} align="center" textAlign="center">
              <Text fontSize="4xl">🚧</Text>
              <Heading size="md" color="blue.700">
                Скоро здесь будет
              </Heading>
              <VStack spacing={2} align="flex-start" w="full" mt={4}>
                <Text fontSize="sm" color="gray.600">
                  • Полный каталог федеральных законов
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Поиск по названию и содержанию
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Актуальные редакции документов
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Ссылки на официальные источники
                </Text>
              </VStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Дополнительная информация */}
        <Text 
          fontSize="sm" 
          color="gray.500" 
          textAlign="center"
          maxW="500px"
        >
          Мы работаем над добавлением этого раздела. 
          Следите за обновлениями!
        </Text>
      </VStack>
    </Box>
  )
}

export default FederalLawPage

