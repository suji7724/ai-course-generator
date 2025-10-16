## Exports
- `ComponentPreview` - Named export, function component
  - Signature: `function ComponentPreview(): JSX.Element`
  - Export syntax: `export function ComponentPreview()`
- `CourseSuggester` - Named export, function component
  - Signature: `function CourseSuggester({ 'data-id': dataId, apiKey }: CourseSuggesterProps): JSX.Element`
  - Export syntax: `export function CourseSuggester({ 'data-id': dataId, apiKey }: CourseSuggesterProps)`
- `CourseSuggester` - Re-export via src/index.tsx
  - Re-export syntax: `export { CourseSuggester } from './CourseSuggester'`

## Component Props & Types
- `ComponentPreview` - No props
  - Props interface: none (no props defined)

- `CourseSuggester` - Props interface
  - Interface:
    ```ts
    interface CourseSuggesterProps {
      'data-id'?: string
      apiKey?: string
    }
    ```
  - Props description:
    - `'data-id'` is optional and is rendered as a data attribute on the top-level container:
      `<div data-id={dataId} ...>` so you can tag instances for testing.
  - Required vs Optional:
    - Optional: `'data-id'?: string`
    - Optional: `apiKey?: string`
  - Default values:
    - No default props defined for this component
  - Special prop behaviors:
    - `'data-id'` is applied to the root wrapper element; used for querying in tests or debugging
  - Callback signatures:
    - None exposed via props
  - Complex type explanations:
    - The prop key is a string literal with a dash in the name; TypeScript supports string literal prop names in interfaces

- Internal types used by the component (not exported)
  - `Course`:
    ```ts
    interface Course {
      title: string
      channel: string
      description: string
      url: string
      duration: string
      level: string
    }
    ```

## Import Patterns
For named exports:
```typescript
import { ComponentPreview } from './ComponentPreview'
import { CourseSuggester } from './src'
import type { CourseSuggesterProps } from './src' // (not applicable here since CourseSuggesterProps is not exported)
```

For default exports:
```typescript
// No default exports in these files
```

For mixed exports:
```typescript
import DefaultComponent, { namedExport, type NamedType } from './component-file'
```

- EXACT file paths:
  - Named exports from ComponentPreview: `./ComponentPreview`
  - Re-exported CourseSuggester: `./src`
- Type-only imports:
  - Not applicable here since `CourseSuggesterProps` is not exported

## Usage Requirements
- No special React context providers are required.
- No external state management or wrappers are required.
- The component manages its own internal state (steps, user input, and suggestions) and renders its UI accordingly.
- There are no ref exposures or public methods to be wired by parent components.
- No error boundaries or HOCs are required.
- Browser APIs used are standard React DOM rendering; no special feature flags or polyfills are mandated.

## Component Behavior
- Initialization:
  - The component maintains internal state: `step` ('input' | 'results'), `userInput` (string), `suggestions` (Course[]), and `isAnalyzing` (boolean).
- Props:
  - Optional `data-id` is forwarded to the root container as a data attribute.
- User flow:
  - When in the "input" step:
    - Renders a form asking for user interests.
    - Submitting the form triggers analysis if the input is non-empty.
  - When in the "results" step:
    - Displays a grid of suggested courses based on the analyzed input or a default set if no input was provided.
    - Each course item links to its URL and displays title, channel, description, duration, and a level badge.
- Data flow and side effects:
  - On submit, `analyzeInterest` simulates work with a 1500ms timeout, computes a set of matches from a local in-file database, updates `suggestions`, and switches to the "results" view.
  - `handleReset` returns the component to the initial input state.
  - Each instance maintains independent state; unmounting cleans up with React’s standard cleanup.
- Rendering behavior:
  - The UI uses Tailwind classes for styling, with a gradient background, card-like panels, and responsive grid for results.
  - The root container includes `data-id` if provided.

## Layout & Visual Behavior
- Overall structure:
  - Root: full-width, minimum height of the viewport, gradient background
  - Centered content area with max width constraint
  - Header section with an icon, title, and subtitle
  - Two main steps:
    - Input step: a white rounded card with a form (label, input, and action buttons)
    - Results step: a header area with a reset button and a responsive grid of course cards
- Cards and grid:
  - Each course card is a white rounded element with drop shadow and border, containing:
    - Icon block on the left
    - Level badge indicating Beginner/Intermediate/Other-like status
    - Title, provider channel, description, duration, and a trailing arrow
- Responsiveness:
  - Grid adapts from single-column on small screens to multiple columns on medium and larger screens
  - Typography scales with viewport size through Tailwind responsive classes
- Spacing and alignment:
  - Consistent padding and outer margins via Tailwind utilities
  - Section dividers and subtle borders for separation

## Styling & Theming
- Styling system:
  - Tailwind CSS utility classes dominate, defining layout, colors, spacing, borders, radii, and typography
  - Iconography uses lucide-react icons for visual cues
- Theming:
  - Uses gradient background and indigo-based color tokens to create a cohesive visual theme
  - Level badges vary color by level (Beginner/Intermediate/other) using conditional classNames
- className prop behavior:
  - The components themselves do not expose a className prop; styling is controlled via internal Tailwind classes
- CSS variables or theme hooks:
  - None exposed by these components
- Tailwind config notes:
  - The code relies on Tailwind utility classes; no custom theme values are defined within the components themselves
- Animations:
  - A small spinner is used during analysis (CSS-based; simple border spinner)

## Code Examples

### Example 1: Basic Usage
```typescript
// Show the absolute minimum required to use the component
// Include the import statement
import { CourseSuggester } from './src'

function App() {
  return (
    <CourseSuggester data-id="basic-usage" />
  )
}
```

### Example 2: Embedded in a Page Layout
```typescript
import { CourseSuggester } from './src'

function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Course Suggestions</h2>
        <CourseSuggester data-id="layout-demo" />
      </div>
    </div>
  )
}
```

### Example 3: Data-ID for Testing
```typescript
import { CourseSuggester } from './src'

function TestHarness() {
  return (
    <div className="p-4">
      <CourseSuggester data-id="test-suggester" />
    </div>
  )
}
```

### Example 4: Using ComponentPreview to Render the Suggester
```typescript
import { ComponentPreview } from './ComponentPreview'

export default function DemoPage() {
  return <ComponentPreview />
}
```