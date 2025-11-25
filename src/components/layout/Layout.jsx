import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { AppDrawer } from '../drawer/Drawer'
import { Header } from '../header/Header'

export const Layout = () => {
  return (
    <>
      <Header />
      <AppDrawer />
      <Box as="main" py={8} px={{ base: 4, md: 8 }}>
        <Outlet />
      </Box>
    </>
  )
}
