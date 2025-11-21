// components/Chapter.jsx
// components/Card/Chapter.jsx
import { Box, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/state/stateApp'

// Маппинг для человекочитаемых названий (опционально, но удобно)
const chapterTitles = {
  'administration-police': 'Административная деятельность',
  'criminal-low': 'Уголовное право',
  // добавь остальные
}

const Chapter = ({ list, toggleChapter }) => {
  const navigate = useNavigate()

  const handleClick = (chapterId) => {
    toggleChapter(chapterId)
    navigate(`/questions/chapters/${chapterId}`)
  }

  return (
    <>
      {list.map((chapterId) => (
        <Box
          key={chapterId}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          bg="gray.50"
          _hover={{ bg: 'gray.100', cursor: 'pointer' }}
          transition="background 0.2s"
          onClick={() => handleClick(chapterId)}
        >
          <Text fontWeight="bold" fontSize="lg">
            {chapterTitles[chapterId] || chapterId}
          </Text>
        </Box>
      ))}
    </>
  )
}

export default Chapter
