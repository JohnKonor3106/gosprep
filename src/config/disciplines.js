import { administrationPoliceQuestions } from '@/data/questions/administration-police';
import { administrationPoliceAnswer } from '@/data/answers/administration-police';
import { criminalLawQuestions } from '@/data/questions/criminal-law';
import { criminalLawAnswer } from '@/data/answers/criminal-law';
import { theoryStateLawQuestions } from '@/data/questions/theory-state-law';
import { theoryStateLawAnswer } from '@/data/answers/theory-state-law';

export const discipinesConfig = {
  'administration-police': {
    id: 'administration-police',
    title: 'Административная деятельность',
    // path is generated dynamically in the router now
    data: administrationPoliceQuestions, // Store the full data object
    questions: administrationPoliceQuestions.questions, // Shortcut to questions array
    answers: administrationPoliceAnswer
  },
  'criminal-law': {
    id: 'criminal-law',
    title: 'Уголовное право',
    data: criminalLawQuestions,
    questions: criminalLawQuestions.questions,
    answers: criminalLawAnswer
  },
  'theory-state-law': {
    id: 'theory-state-law',
    title: 'Теория государства и права',
    data: theoryStateLawQuestions,
    questions: theoryStateLawQuestions.questions,
    answers: theoryStateLawAnswer
  },
};