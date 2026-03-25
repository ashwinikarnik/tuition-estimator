# Component Spec: Button

## 1. Component Metadata
- Name: `Button`
- Category: `Components`
- Theme scope: `Base theme only`
- Canonical docs path: `?path=/docs/components-button-buttons--docs`

## 2. Purpose
`Button` triggers user actions such as form submission, navigation intent, or in-page operations.

## 3. API Contract

Confirmed from Storybook compiled sources:
- Docs module: `Button-5419ce74.js`
- Stories module: `Button.stories-ce7553ae.js`
- Story set: `sizes`, `solidVariants`, `outlineVariants`, `disabled`, `block`

### 3.1 Props
No component-level Vue props are documented for `Components/Button/Buttons`.

The docs demonstrate native `<button>` usage with CSS classes:
- Base class: `btn`
- Size classes: `btn-sm`, `btn`, `btn-lg`
- Solid variant classes: `btn-primary`, `btn-secondary`, `btn-light-2`, `btn-dark-3`
- Outline variant classes: `btn-outline-primary`, `btn-outline-secondary`, `btn-outline-light-2`, `btn-outline-dark-3`
- Block layout class: `btn-block`
- Disabled state attribute: `disabled`

### 3.2 Events
No component-specific emitted events are documented on this page.
Use native button behavior (`click`, keyboard activation) from the HTML element.

### 3.3 Slots
No slots are documented for this page.

## 4. Visual Behavior Matrix (Base Theme)

### 4.1 Variants
- Solid: `primary`, `secondary`, `light-2`, `dark-3`
- Outline: `outline-primary`, `outline-secondary`, `outline-light-2`, `outline-dark-3`

### 4.2 Sizes
- Small: `btn-sm`
- Default: `btn`
- Large: `btn-lg`

### 4.3 States
- `default`
- `hover`
- `focus-visible`
- `active`
- `disabled`
- `block` layout example (`btn-block`)

## 5. Accessibility Requirements
- Must be keyboard reachable with `Tab`.
- Activation via `Enter` and `Space`.
- Focus indicator must remain visible in base theme.
- Disabled button must not trigger click handler.
- Icon-only usage must include an accessible name (for example `aria-label`).
- Text and state contrast should meet WCAG 2.1 AA for interactive controls in base theme.

## 6. Usage Guidance
- Use `primary` for a single dominant action per section.
- Use `secondary` for alternate actions.
- Use destructive styling only for irreversible operations.
- Avoid multiple primary buttons in one action group.

## 7. Example Coverage Requirements
- Primary button.
- Disabled secondary button.
- Outline button example.
- Block button example.

## 8. Verification Notes
- This docs page is class-based and does not expose Storybook argTypes for a Vue button component API.
- Treat this page as styling/usage guidance for button classes in base theme.
- If a future `RdsButton` component docs page is introduced, create a separate API spec for that component.
