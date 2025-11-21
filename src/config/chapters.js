


export const chaptersConfig = {
  'administration-police': {
    id: 'administration-police',
    title: 'Административная деятельность',
    path: {
        parent: '/questions/chapters/administration-police',
        children: ['/questions/chapters/administration-police/:id']
    },
    questions: () => import('@/data/questions/administration-police'),
    answers: () => import('@/data/answers/administration-police'),
  },
/*   'criminal-low': {
    id: 'criminal-low',
    title: 'Уголовное право',
    path: '/questions/chapters/criminal-low',
    questions: () => import('@/data/questions/criminal-low'),
    answers: () => import('@/data/answers/criminal-low'),
  }, */
};