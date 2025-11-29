import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { AppDrawer } from '../drawer/Drawer'
import { Header } from '../header/Header'

export const Layout = () => {
  return (
    <>
      <Header />
      <AppDrawer />
      <Box 
        as="main" 
        py={8} 
        px={{ base: 4, md: 8 }}
        bg="gray.50"
        minH="calc(100vh - 56px)"
      >
        <Outlet />
      </Box>
    </>
  )
}
