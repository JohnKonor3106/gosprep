import { Box, HStack, Text } from '@chakra-ui/react'

export const Header = ({ onOpenMenu }) => {
  return (
    <Box h="56px" px={4} bg="blue.500" display="flex" alignItems="center" shadow="sm">
      <HStack gap={3} align="center">
        <Box
          as="button"
          onClick={onOpenMenu}
          aria-label="Открыть меню"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap="4px"
          w="28px"
          h="28px"
        >
          <Box h="2px" bg="white" rounded="full" />
          <Box h="2px" bg="white" rounded="full" />
          <Box h="2px" bg="white" rounded="full" />
        </Box>
        <Text>
          САМОПОДГОТОВКА
          <Text p={2} as="span" color="white" fontWeight="bold" fontSize="small">
            2026
          </Text>
        </Text>
      </HStack>
    </Box>
  )
}
