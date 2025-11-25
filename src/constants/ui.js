/**
 * UI константы — размеры, отступы, z-index
 */

// Размеры хедера
export const HEADER_HEIGHT_PX = 56
export const HEADER_HEIGHT = `${HEADER_HEIGHT_PX}px`

// Ширина бокового меню
export const SIDEBAR_WIDTH = {
  COLLAPSED: 60,
  EXPANDED: 280,
  HELP_PAGE: 400,
}

// Z-index слои
export const Z_INDEX = {
  HEADER: 100,
  DRAWER: 200,
  OVERLAY: 150,
  MODAL: 300,
  TOOLTIP: 400,
}

// Брейкпоинты (соответствуют Chakra UI)
export const BREAKPOINTS = {
  SM: '30em',   // 480px
  MD: '48em',   // 768px
  LG: '62em',   // 992px
  XL: '80em',   // 1280px
  '2XL': '96em', // 1536px
}

// Максимальная ширина контента
export const MAX_CONTENT_WIDTH = {
  DEFAULT: '1200px',
  NARROW: '800px',
  WIDE: '1400px',
}

