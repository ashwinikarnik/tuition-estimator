# Component Spec: ButtonPlayApollo

## 1. Component Metadata
- Name: `ButtonPlayApollo`
- NPM package: `@rds-vue-ui/button-play-apollo`
- Category: `Components/Button`
- Canonical docs path: `?path=/docs/components-button-buttonplayapollo--docs`
- Story ID: `components-button-buttonplayapollo--primary`

## 2. Purpose
`ButtonPlayApollo` renders a play-style CTA button with optional text and emits a click event for video or media actions.

## 3. API Contract

Confirmed from Storybook compiled modules:
- Docs module: `ButtonPlayApollo-e041ee23.js`
- Stories module: `ButtonPlayApollo.stories-b83351c5.js`

### 3.1 Props
| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `buttonText` | `string` | `undefined` | No | The text to display inside the button. |
| `buttonTextSize` | `"small" \| "medium" \| "large" \| "xl"` | Storybook default `medium` | No | The size of the button text. |
| `buttonTextVariant` | `string` | Storybook default `dark-3` | No | Color variant of the button text. |
| `backgroundVariant` | `string` | `dark-1` | No | Color variant of the button background. |
| `disabled` | `boolean` | `false` | No | Disables the button. |

Notes:
- `backgroundVariant` and `disabled` have explicit component defaults.
- `buttonTextSize` and `buttonTextVariant` defaults are set in Storybook controls; verify runtime defaults in consuming app styles if needed.

### 3.2 Events
| Event | Payload | Description |
|---|---|---|
| `ctaClick` | `void` | Emitted when the play button is clicked. |

### 3.3 Slots
No slots are documented for this component.

## 4. Visual Behavior
- Root classes include `btn modal-play-button`.
- Background variant class pattern: `btn-${backgroundVariant}`.
- Text classes include `fs-${buttonTextSize}` and `text-${buttonTextVariant}` when `buttonText` is present.
- Icon image is always rendered with `alt="videoButton"`.

## 5. Accessibility Requirements
- Button must be keyboard reachable with `Tab`.
- Activation via `Enter` and `Space`.
- `disabled` must block interaction and event emission.
- Keep a visible focus outline for keyboard users.
- If `buttonText` is omitted, consuming page should provide additional accessible context nearby.

## 6. Usage Guidance
- Use `buttonText` for clear CTA intent (example: `Watch Video`).
- Keep `backgroundVariant` and `buttonTextVariant` aligned with base theme contrast.
- Subscribe to `@ctaClick` to open modal/video behavior in parent components.

## 7. Example Coverage Requirements
- Primary enabled usage with `buttonText`.
- Disabled state.
- Event wiring (`@ctaClick` handler).

