// src/data/templates/humanitarian/index.js
export { SystemAnalysisRender } from './system_analysis'
export { ConceptAnalysisRender } from './concept_analysis'
export { ComparativeAnalysisRender } from './comparative_analysis'
export { ControlMechanismsRender } from './control_mechanisms'
export { ActivityOrganizationRender } from './activity_organization'
export { ProceduralRender } from './procedural'
export { FeatureAnalysisRender } from './feature_analysis'

// Маппинг structure_type -> рендерер
export const structureTypeRenderers = {
  system_analysis: 'SystemAnalysisRender',
  concept_analysis: 'ConceptAnalysisRender',
  comparative_analysis: 'ComparativeAnalysisRender',
  control_mechanisms: 'ControlMechanismsRender',
  activity_organization: 'ActivityOrganizationRender',
  procedural: 'ProceduralRender',
  feature_analysis: 'FeatureAnalysisRender',
}


