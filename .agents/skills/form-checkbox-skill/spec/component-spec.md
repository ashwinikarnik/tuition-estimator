# Component Spec: FormCheckbox

## 1. Metadata
- Name: `FormCheckbox`
- Package: `@rds-vue-ui/form-checkbox`
- Version (registry): `0.2.0`
- Storybook docs path: `?path=/story/components-forms-formcheckbox--primary`
- IDs:
  - `components-forms-formcheckbox--docs`
  - `components-forms-formcheckbox--primary`
  - `components-forms-formcheckbox--examples`

## 2. Purpose
Configurable checkbox component with v-model support, visual variants, bounded mode, and slot/custom label usage.

## 3. API Contract

### 3.1 Props
Core behavior props:
- `id: string` (required)
- `name?: string`
- `label?: string`
- `size?: "xs" | "sm" | "lg" | "xl" | "xxl"` (default component value: `sm`)
- `modelValue?: boolean`
- `checked?: boolean`
- `required?: boolean`
- `disabled?: boolean` (default: `false`)
- `iconPosition?: "left" | "right"` (default: `left`)
- `bounded?: boolean` (default: `false`)
- `variant?: "filled" | "outline"` (default: `filled`)
- `tickColor?: string`
- `indeterminate?: boolean` (default: `false`)

Style variant props:
- `checkedVariant?: string`
- `uncheckedVariant?: string`
- `focusedVariant?: string`
- `boundedActiveVariant?: string`
- `boundedActiveTextVariant?: string`
- `boundedVariant?: string`
- `labelVariant?: string`
- `labelWeight?: string`
- `labelSize?: string`
- `checkboxBgVariant?: string`

### 3.2 Events
- `update:modelValue` (boolean payload)
- `changed` (event + current checked state in story implementation)

### 3.3 Slots
- `default` slot for custom label content.

## 4. Behavioral Notes
- Supports both controlled (`v-model`) and initial-state (`checked`) patterns.
- Supports indeterminate visual state.
- Disabled state should block user interaction.
- Size affects checkbox icon and label scale.

## 5. Accessibility
- Checkbox input must remain keyboard focusable unless disabled.
- Label text and focus ring should remain visible against theme background.
- `id` should be unique and linked to label semantics.

