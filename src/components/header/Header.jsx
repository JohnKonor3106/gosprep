import { Box, HStack, Text } from '@chakra-ui/react'
import { useAppStore } from '@/state/stateApp'

export const Header = () => {
  const { setIsOpen } = useAppStore();

  return (
    <Box 
      h="56px" 
      px={{ base: 3, md: 4 }} 
      bg="blue.500" 
      display="flex" 
      alignItems="center" 
      shadow="sm"
    >
      <HStack gap={{ base: 2, md: 3 }} align="center">
        <Box
          as="button"
          onClick={() => setIsOpen(true)}
          aria-label="Открыть меню"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap="4px"
          w="28px"
          h="28px"
          flexShrink={0}
        >
          <Box h="2px" bg="white" rounded="full" />
          <Box h="2px" bg="white" rounded="full" />
          <Box h="2px" bg="white" rounded="full" />
        </Box>
        <Text 
          fontSize={{ base: 'sm', md: 'md' }} 
          fontWeight="bold" 
          color="white"
          whiteSpace="nowrap"
        >
          STUDY-SPACE
          <Text 
            as="span" 
            color="whiteAlpha.900" 
            fontWeight="bold" 
            fontSize={{ base: 'xs', md: 'small' }}
            ml={{ base: 1, md: 2 }}
          >
            2026
          </Text>
        </Text>
      </HStack>
    </Box>
  )
}
