import { SystemAnalysisRender } from '@/data/templates/humanitarian/system_analysis'
import { ControlMechanismsRender } from '@/data/templates/humanitarian/control_mechanisms'
import { ActivityOrganizationRender } from '@/data/templates/humanitarian/activity_organization'
import { ConceptAnalysisRender } from '@/data/templates/humanitarian/concept_analysis'
import { ProceduralRender } from '@/data/templates/humanitarian/procedural'
import { FeatureAnalysisRender } from '@/data/templates/humanitarian/feature_analysis'
import { ComparativeAnalysisRender } from '@/data/templates/humanitarian/comparative_analysis'
import { Text } from '@chakra-ui/react'

export const AnswerRenderer = (answer) => {
  if (!answer) return <Text>Ответ не найден</Text>

  switch (answer.structure_type) {
    case 'system_analysis':
      return <SystemAnalysisRender title={answer.title} {...answer.content} />
    case 'control_mechanisms':
      return <ControlMechanismsRender title={answer.title} {...answer.content} />
    case 'activity_organization':
      return <ActivityOrganizationRender title={answer.title} {...answer.content} />
    case 'concept_analysis':
      return <ConceptAnalysisRender title={answer.title} {...answer.content} />
    case 'procedural':
      return <ProceduralRender title={answer.title} {...answer.content} />
    case 'feature_analysis':
      return <FeatureAnalysisRender title={answer.title} {...answer.content} />
    case 'comparative_analysis':
      return <ComparativeAnalysisRender title={answer.title} {...answer.content} />
    default:
      return <Text>Тип ответа не поддерживается</Text>
  }
}
