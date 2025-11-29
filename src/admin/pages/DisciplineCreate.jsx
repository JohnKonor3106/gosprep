import { Box, Heading, Text } from '@chakra-ui/react'
import DisciplineForm from '@/admin/components/DisciplineForm'

const DisciplineCreate = () => {
  return (
    <Box>
      <Box mb={6}>
        <Heading size="lg">Новая дисциплина</Heading>
        <Text color="gray.500">Создание новой дисциплины</Text>
      </Box>

      <DisciplineForm />
    </Box>
  )
}

export default DisciplineCreate

