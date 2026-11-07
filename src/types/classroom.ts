export type RepresentationType = 'diagram' | 'comparison' | 'process' | 'relation_schema' | 'chart';

export interface ConceptLabel {
  id: string;
  name: string;
  description: string;
  color?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  detail: string;
}

export interface ComparisonColumn {
  columnTitle: string;
  items: string[];
}

export interface ConceptRepresentation {
  title: string;
  questionAnswered: string;
  svgCode: string;
  labels: ConceptLabel[];
  processSteps?: ProcessStep[];
  comparisonColumns?: ComparisonColumn[];
}

export interface Concept {
  id: string;
  title: string;
  category: string;
  pageOrSectionRef: string;
  summary: string;
  keyTakeaway: string;
  representationType: RepresentationType;
  representation: ConceptRepresentation;
  openQuestion: string;
  referenceQuotes?: string[];
}

export interface DocumentSection {
  id: string;
  title: string;
  reference: string;
  summary: string;
}

export interface DocumentData {
  id: string;
  title: string;
  summary: string;
  sourceType: 'sample' | 'pdf' | 'notes';
  sourceName: string;
  originalContent: string;
  pageCount?: number;
  sections: DocumentSection[];
  concepts: Concept[];
}

export type LiveStatus = 'disconnected' | 'connecting' | 'listening' | 'speaking' | 'error';

export interface EvaluationResult {
  masteryLevel: 'compreensao_solida' | 'em_progresso' | 'iniciando';
  whatUnderstood: string;
  whatMissingOrConfused: string;
  specificCorrection: string;
  encouragement: string;
}

export interface InfographicData {
  imageUrl: string;
  topic: string;
  conceptTitle: string;
  model: string;
  aspectRatio: string;
  resolution: string;
  visualDirection?: {
    titlePt: string;
    mainQuestionPt: string;
    conclusionPt: string;
    englishImagePrompt?: string;
  };
  review?: {
    scientificCoherence: string;
    labelsAndSpelling: string;
    recommendations: string[];
    overallAccuracyNote: string;
  };
}
