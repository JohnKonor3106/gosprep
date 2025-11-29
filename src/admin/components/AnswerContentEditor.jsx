import { useState } from 'react'
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  IconButton,
  Heading,
  Badge,
  SimpleGrid,
  Tabs,
} from '@chakra-ui/react'

// Компонент для списка строк
const StringListEditor = ({ label, value = [], onChange, placeholder }) => {
  const handleAdd = () => {
    onChange([...value, ''])
  }

  const handleRemove = (index) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleChange = (index, newValue) => {
    const updated = [...value]
    updated[index] = newValue
    onChange(updated)
  }

  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="sm" fontWeight="medium">{label}</Text>
        <Button size="xs" colorScheme="blue" variant="ghost" onClick={handleAdd}>
          + Добавить
        </Button>
      </HStack>
      <VStack align="stretch" spacing={2}>
        {value.map((item, index) => (
          <HStack key={index}>
            <Input
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder}
              size="sm"
            />
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => handleRemove(index)}
              aria-label="Удалить"
            >
              ✕
            </IconButton>
          </HStack>
        ))}
        {value.length === 0 && (
          <Text fontSize="sm" color="gray.400" fontStyle="italic">
            Нажмите "+ Добавить" чтобы добавить элемент
          </Text>
        )}
      </VStack>
    </Box>
  )
}

// Компонент для списка объектов с полями
const ObjectListEditor = ({ label, value = [], onChange, fields, emptyText }) => {
  const handleAdd = () => {
    const newItem = {}
    fields.forEach(f => { newItem[f.name] = '' })
    onChange([...value, newItem])
  }

  const handleRemove = (index) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleChange = (index, fieldName, newValue) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [fieldName]: newValue }
    onChange(updated)
  }

  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="sm" fontWeight="medium">{label}</Text>
        <Button size="xs" colorScheme="blue" variant="ghost" onClick={handleAdd}>
          + Добавить
        </Button>
      </HStack>
      <VStack align="stretch" spacing={3}>
        {value.map((item, index) => (
          <Box key={index} p={3} bg="gray.50" borderRadius="md" position="relative">
            <IconButton
              size="xs"
              variant="ghost"
              colorScheme="red"
              position="absolute"
              top={1}
              right={1}
              onClick={() => handleRemove(index)}
              aria-label="Удалить"
            >
              ✕
            </IconButton>
            <SimpleGrid columns={{ base: 1, md: fields.length }} spacing={2} pr={6}>
              {fields.map((field) => (
                <Box key={field.name}>
                  <Text fontSize="xs" color="gray.500" mb={1}>{field.label}</Text>
                  {field.multiline ? (
                    <Textarea
                      value={item[field.name] || ''}
                      onChange={(e) => handleChange(index, field.name, e.target.value)}
                      placeholder={field.placeholder}
                      size="sm"
                      rows={2}
                    />
                  ) : (
                    <Input
                      value={item[field.name] || ''}
                      onChange={(e) => handleChange(index, field.name, e.target.value)}
                      placeholder={field.placeholder}
                      size="sm"
                    />
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ))}
        {value.length === 0 && (
          <Text fontSize="sm" color="gray.400" fontStyle="italic">
            {emptyText || 'Нажмите "+ Добавить" чтобы добавить элемент'}
          </Text>
        )}
      </VStack>
    </Box>
  )
}

// Компонент для простого текстового поля
const TextField = ({ label, value, onChange, placeholder, multiline = false, hint }) => (
  <Box>
    <Text fontSize="sm" fontWeight="medium" mb={1}>{label}</Text>
    {hint && <Text fontSize="xs" color="gray.500" mb={1}>{hint}</Text>}
    {multiline ? (
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    ) : (
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </Box>
)

// ==================== РЕДАКТОРЫ ДЛЯ РАЗНЫХ ТИПОВ ====================

// Системный анализ
const SystemAnalysisEditor = ({ content, onChange }) => {
  const update = (field, value) => {
    onChange({ ...content, [field]: value })
  }

  return (
    <VStack align="stretch" spacing={5}>
      <TextField
        label="Определение"
        value={content.definition}
        onChange={(v) => update('definition', v)}
        placeholder="Что это такое? Дайте определение понятия"
        multiline
        hint="Основное определение термина или понятия"
      />

      <TextField
        label="Сущность"
        value={content.essence}
        onChange={(v) => update('essence', v)}
        placeholder="В чём суть? Краткая характеристика"
        hint="Краткое описание сути явления"
      />

      <TextField
        label="Цель / Назначение"
        value={content.purpose}
        onChange={(v) => update('purpose', v)}
        placeholder="Для чего существует? Какова цель?"
        hint="Основная цель или назначение"
      />

      <StringListEditor
        label="Структура"
        value={content.structure || []}
        onChange={(v) => update('structure', v)}
        placeholder="Элемент структуры"
      />

      <ObjectListEditor
        label="Элементы системы"
        value={content.elements || []}
        onChange={(v) => update('elements', v)}
        fields={[
          { name: 'name', label: 'Название', placeholder: 'Название элемента' },
          { name: 'description', label: 'Описание', placeholder: 'Что это' },
          { name: 'function', label: 'Функция', placeholder: 'Что делает' },
        ]}
      />

      <StringListEditor
        label="Функции"
        value={content.functions || []}
        onChange={(v) => update('functions', v)}
        placeholder="Функция"
      />

      <ObjectListEditor
        label="Правовая основа"
        value={content.legal_basis || []}
        onChange={(v) => update('legal_basis', v)}
        fields={[
          { name: 'name', label: 'Название НПА', placeholder: 'ФЗ, Указ и т.д.' },
          { name: 'regulation', label: 'Что регулирует', placeholder: 'Описание' },
        ]}
      />

      <TextField
        label="Значение / Важность"
        value={content.importance}
        onChange={(v) => update('importance', v)}
        placeholder="Почему это важно?"
      />

      <TextField
        label="Роль"
        value={content.role}
        onChange={(v) => update('role', v)}
        placeholder="Какую роль играет?"
      />

      <StringListEditor
        label="План ответа"
        value={content.answer_outline || []}
        onChange={(v) => update('answer_outline', v)}
        placeholder="Пункт плана"
      />

      <StringListEditor
        label="Источники"
        value={content.sources || []}
        onChange={(v) => update('sources', v)}
        placeholder="Нормативный акт"
      />
    </VStack>
  )
}

// Анализ концепции
const ConceptAnalysisEditor = ({ content, onChange }) => {
  const update = (field, value) => {
    onChange({ ...content, [field]: value })
  }

  return (
    <VStack align="stretch" spacing={5}>
      <TextField
        label="Определение"
        value={content.definition}
        onChange={(v) => update('definition', v)}
        placeholder="Определение понятия"
        multiline
      />

      <StringListEditor
        label="Признаки"
        value={content.signs || []}
        onChange={(v) => update('signs', v)}
        placeholder="Признак понятия"
      />

      <StringListEditor
        label="Виды"
        value={content.types || []}
        onChange={(v) => update('types', v)}
        placeholder="Вид или классификация"
      />

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2}>Состав (элементы)</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <TextField
            label="Объект"
            value={content.elements?.object}
            onChange={(v) => update('elements', { ...content.elements, object: v })}
            placeholder="На что направлено"
          />
          <TextField
            label="Объективная сторона"
            value={content.elements?.objective_side}
            onChange={(v) => update('elements', { ...content.elements, objective_side: v })}
            placeholder="Внешнее проявление"
          />
          <TextField
            label="Субъект"
            value={content.elements?.subject}
            onChange={(v) => update('elements', { ...content.elements, subject: v })}
            placeholder="Кто совершает"
          />
          <TextField
            label="Субъективная сторона"
            value={content.elements?.subjective_side}
            onChange={(v) => update('elements', { ...content.elements, subjective_side: v })}
            placeholder="Психическое отношение"
          />
        </SimpleGrid>
      </Box>

      <StringListEditor
        label="Отличия от смежных понятий"
        value={content.difference_from_crime || []}
        onChange={(v) => update('difference_from_crime', v)}
        placeholder="Отличие"
      />

      <TextField
        label="Значение"
        value={content.significance}
        onChange={(v) => update('significance', v)}
        placeholder="В чём значение понятия"
      />

      <StringListEditor
        label="Источники"
        value={content.sources || []}
        onChange={(v) => update('sources', v)}
        placeholder="Нормативный акт"
      />
    </VStack>
  )
}

// Процедурный
const ProceduralEditor = ({ content, onChange }) => {
  const update = (field, value) => {
    onChange({ ...content, [field]: value })
  }

  return (
    <VStack align="stretch" spacing={5}>
      <TextField
        label="Определение"
        value={content.definition}
        onChange={(v) => update('definition', v)}
        placeholder="Что это за процедура"
        multiline
      />

      <StringListEditor
        label="Основания"
        value={content.grounds || []}
        onChange={(v) => update('grounds', v)}
        placeholder="Основание для процедуры"
      />

      <ObjectListEditor
        label="Этапы процедуры"
        value={content.stages || []}
        onChange={(v) => update('stages', v)}
        fields={[
          { name: 'stage', label: 'Название этапа', placeholder: 'Этап' },
          { name: 'description', label: 'Описание', placeholder: 'Что происходит' },
          { name: 'documents', label: 'Документы', placeholder: 'Какие документы' },
        ]}
        emptyText="Добавьте этапы процедуры по порядку"
      />

      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2}>Сроки</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <TextField
            label="Общий срок"
            value={content.terms?.general}
            onChange={(v) => update('terms', { ...content.terms, general: v })}
            placeholder="Например: До 3 часов"
          />
          <TextField
            label="Продлённый срок"
            value={content.terms?.extended}
            onChange={(v) => update('terms', { ...content.terms, extended: v })}
            placeholder="Например: До 48 часов"
          />
        </SimpleGrid>
      </Box>

      <StringListEditor
        label="Права участников"
        value={content.rights_of_detained || []}
        onChange={(v) => update('rights_of_detained', v)}
        placeholder="Право"
      />

      <StringListEditor
        label="Уполномоченные лица"
        value={content.authorized_persons || []}
        onChange={(v) => update('authorized_persons', v)}
        placeholder="Кто уполномочен"
      />

      <StringListEditor
        label="Источники"
        value={content.sources || []}
        onChange={(v) => update('sources', v)}
        placeholder="Нормативный акт"
      />
    </VStack>
  )
}

// Механизмы контроля
const ControlMechanismsEditor = ({ content, onChange }) => {
  const update = (field, value) => {
    onChange({ ...content, [field]: value })
  }

  return (
    <VStack align="stretch" spacing={5}>
      <TextField
        label="Определение"
        value={content.definition}
        onChange={(v) => update('definition', v)}
        placeholder="Что такое контроль в данном контексте"
        multiline
      />

      <StringListEditor
        label="Виды контроля"
        value={content.types || []}
        onChange={(v) => update('types', v)}
        placeholder="Вид контроля"
      />

      <ObjectListEditor
        label="Субъекты контроля"
        value={content.subjects || []}
        onChange={(v) => update('subjects', v)}
        fields={[
          { name: 'name', label: 'Название', placeholder: 'Кто контролирует' },
          { name: 'powers', label: 'Полномочия', placeholder: 'Какие полномочия' },
        ]}
      />

      <StringListEditor
        label="Методы контроля"
        value={content.methods || []}
        onChange={(v) => update('methods', v)}
        placeholder="Метод"
      />

      <StringListEditor
        label="Формы контроля"
        value={content.forms || []}
        onChange={(v) => update('forms', v)}
        placeholder="Форма"
      />

      <StringListEditor
        label="Последствия"
        value={content.consequences || []}
        onChange={(v) => update('consequences', v)}
        placeholder="Последствие нарушений"
      />

      <StringListEditor
        label="Источники"
        value={content.sources || []}
        onChange={(v) => update('sources', v)}
        placeholder="Нормативный акт"
      />
    </VStack>
  )
}

// Организация деятельности
const ActivityOrganizationEditor = ({ content, onChange }) => {
  const update = (field, value) => {
    onChange({ ...content, [field]: value })
  }

  return (
    <VStack align="stretch" spacing={5}>
      <TextField
        label="Определение"
        value={content.definition}
        onChange={(v) => update('definition', v)}
        placeholder="Что это за деятельность"
        multiline
      />

      <StringListEditor
        label="Принципы организации"
        value={content.principles || []}
        onChange={(v) => update('principles', v)}
        placeholder="Принцип"
      />

      <ObjectListEditor
        label="Этапы деятельности"
        value={content.stages || []}
        onChange={(v) => update('stages', v)}
        fields={[
          { name: 'name', label: 'Этап', placeholder: 'Название этапа' },
          { name: 'description', label: 'Описание', placeholder: 'Что происходит' },
        ]}
      />

      <StringListEditor
        label="Участники"
        value={content.participants || []}
        onChange={(v) => update('participants', v)}
        placeholder="Участник"
      />

      <StringListEditor
        label="Документы"
        value={content.documents || []}
        onChange={(v) => update('documents', v)}
        placeholder="Документ"
      />

      <TextField
        label="Результаты"
        value={content.results}
        onChange={(v) => update('results', v)}
        placeholder="Какие результаты деятельности"
      />

      <StringListEditor
        label="Источники"
        value={content.sources || []}
        onChange={(v) => update('sources', v)}
        placeholder="Нормативный акт"
      />
    </VStack>
  )
}

// Анализ особенностей
const FeatureAnalysisEditor = ({ content, onChange }) => {
  const update = (field, value) => {
    onChange({ ...content, [field]: value })
  }

  return (
    <VStack align="stretch" spacing={5}>
      <TextField
        label="Общая характеристика"
        value={content.general_description}
        onChange={(v) => update('general_description', v)}
        placeholder="Общее описание"
        multiline
      />

      <StringListEditor
        label="Особенности"
        value={content.features || []}
        onChange={(v) => update('features', v)}
        placeholder="Особенность"
      />

      <StringListEditor
        label="Отличительные черты"
        value={content.distinctive_features || []}
        onChange={(v) => update('distinctive_features', v)}
        placeholder="Отличительная черта"
      />

      <StringListEditor
        label="Примеры"
        value={content.examples || []}
        onChange={(v) => update('examples', v)}
        placeholder="Пример"
      />

      <TextField
        label="Значение"
        value={content.significance}
        onChange={(v) => update('significance', v)}
        placeholder="В чём значение"
      />

      <StringListEditor
        label="Источники"
        value={content.sources || []}
        onChange={(v) => update('sources', v)}
        placeholder="Нормативный акт"
      />
    </VStack>
  )
}

// Сравнительный анализ
const ComparativeAnalysisEditor = ({ content, onChange }) => {
  const update = (field, value) => {
    onChange({ ...content, [field]: value })
  }

  return (
    <VStack align="stretch" spacing={5}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <TextField
          label="Первый объект сравнения"
          value={content.object1}
          onChange={(v) => update('object1', v)}
          placeholder="Название первого объекта"
        />
        <TextField
          label="Второй объект сравнения"
          value={content.object2}
          onChange={(v) => update('object2', v)}
          placeholder="Название второго объекта"
        />
      </SimpleGrid>

      <StringListEditor
        label="Критерии сравнения"
        value={content.criteria || []}
        onChange={(v) => update('criteria', v)}
        placeholder="Критерий"
      />

      <StringListEditor
        label="Сходства"
        value={content.similarities || []}
        onChange={(v) => update('similarities', v)}
        placeholder="В чём похожи"
      />

      <StringListEditor
        label="Различия"
        value={content.differences || []}
        onChange={(v) => update('differences', v)}
        placeholder="В чём отличаются"
      />

      <TextField
        label="Выводы"
        value={content.conclusions}
        onChange={(v) => update('conclusions', v)}
        placeholder="Какие выводы можно сделать"
        multiline
      />

      <StringListEditor
        label="Источники"
        value={content.sources || []}
        onChange={(v) => update('sources', v)}
        placeholder="Нормативный акт"
      />
    </VStack>
  )
}

// ==================== ГЛАВНЫЙ КОМПОНЕНТ ====================

const AnswerContentEditor = ({ structureType, content, onChange }) => {
  const [mode, setMode] = useState('visual') // 'visual' или 'json'
  const [jsonError, setJsonError] = useState(null)

  // Конвертация JSON в объект для визуального редактора
  const parseContent = () => {
    if (typeof content === 'object') return content
    try {
      return JSON.parse(content)
    } catch {
      return {}
    }
  }

  const handleVisualChange = (newContent) => {
    setJsonError(null)
    onChange(newContent)
  }

  const handleJsonChange = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)
      setJsonError(null)
      onChange(parsed)
    } catch (e) {
      setJsonError('Некорректный JSON: ' + e.message)
      // Сохраняем как строку для возможности редактирования
    }
  }

  const contentObj = parseContent()

  const renderVisualEditor = () => {
    switch (structureType) {
      case 'system_analysis':
        return <SystemAnalysisEditor content={contentObj} onChange={handleVisualChange} />
      case 'concept_analysis':
        return <ConceptAnalysisEditor content={contentObj} onChange={handleVisualChange} />
      case 'procedural':
        return <ProceduralEditor content={contentObj} onChange={handleVisualChange} />
      case 'control_mechanisms':
        return <ControlMechanismsEditor content={contentObj} onChange={handleVisualChange} />
      case 'activity_organization':
        return <ActivityOrganizationEditor content={contentObj} onChange={handleVisualChange} />
      case 'feature_analysis':
        return <FeatureAnalysisEditor content={contentObj} onChange={handleVisualChange} />
      case 'comparative_analysis':
        return <ComparativeAnalysisEditor content={contentObj} onChange={handleVisualChange} />
      default:
        return <SystemAnalysisEditor content={contentObj} onChange={handleVisualChange} />
    }
  }

  return (
    <Box>
      <Tabs.Root value={mode} onValueChange={(e) => setMode(e.value)} mb={4}>
        <Tabs.List>
          <Tabs.Trigger value="visual">
            📝 Визуальный редактор
          </Tabs.Trigger>
          <Tabs.Trigger value="json">
            💻 JSON (для опытных)
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {mode === 'visual' ? (
        <Box>
          <Box bg="blue.50" p={3} borderRadius="md" mb={4}>
            <Text fontSize="sm" color="blue.800">
              💡 Заполняйте только нужные поля. Пустые поля не будут отображаться.
            </Text>
          </Box>
          {renderVisualEditor()}
        </Box>
      ) : (
        <Box>
          {jsonError && (
            <Box bg="red.50" p={3} borderRadius="md" mb={4}>
              <Text fontSize="sm" color="red.600">{jsonError}</Text>
            </Box>
          )}
          <Textarea
            value={typeof content === 'object' ? JSON.stringify(content, null, 2) : content}
            onChange={(e) => handleJsonChange(e.target.value)}
            fontFamily="monospace"
            fontSize="sm"
            rows={25}
            placeholder='{"definition": "...", "structure": [...], ...}'
          />
        </Box>
      )}
    </Box>
  )
}

export default AnswerContentEditor

