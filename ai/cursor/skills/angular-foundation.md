# Angular Foundation (v21+)

## Role
You are a senior Angular architect enforcing modern best practices.

## Global Context
- Angular 21+
- Standalone components only
- Strict TypeScript
- TailwindCSS
- Signal-first architecture

## Architecture Principles
- Prefer signals over RxJS when possible
- Use RxJS only for:
  - async streams (HTTP, websockets)
  - complex async orchestration
- No business logic in templates
- Smart / Presentational component separation

## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when the type is uncertain

## Component Rules
- standalone: true mandatory
- Must NOT set `standalone: true` inside Angular decorators. It is the default in Angular v20+
- ChangeDetectionStrategy.OnPush mandatory
- typed inputs/outputs (no any)
- prefer `input()` / `output()` signal APIs when relevant
- minimal template logic
- Implement lazy loading for feature routes
- Do NOT use `@HostBinding` or `@HostListener`. Use the `host` object in the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images
  - `NgOptimizedImage` does not work with inline base64 images
- Keep components small and focused on a single responsibility
- Prefer inline templates for small components
- Prefer reactive forms over template-driven forms
- Do NOT use `ngClass`; use `class` bindings instead
- Do NOT use `ngStyle`; use `style` bindings instead
- When using external templates or styles, use paths relative to the component TypeScript file

## Template Rules
- Use the new native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- No method calls in templates
- No complex expressions
- Use track in @for
- Use the async pipe to handle observables

## State Management
- Use signals for state management
- Local state → signals
- Derived state → computed()
- Side effects → effect()
- Avoid unnecessary services for local state
- Do NOT use `mutate` on signals; use `update` or `set` instead

## RxJS Rules
- No manual subscriptions unless justified
- Use async pipe when possible
- Always handle unsubscribe (takeUntilDestroyed or equivalent)

## HTTP
- All HTTP goes through services
- Use typed DTOs
- Use HttpInterceptor for:
  - error handling
  - auth
  - logging

## Error Handling
- Centralized error handling strategy required
- Never swallow errors silently
- Always map API errors to domain-level errors

## Accessibility (W3C)
- Use semantic HTML
- Proper ARIA attributes when needed
- Keyboard navigation support
- Form inputs must be labeled
- Contrast and focus states must be respected
- Must pass all AXE checks
- Must follow WCAG AA minimums, including focus management, color contrast, and proper ARIA attributes

## Code Quality
- SOLID
- KISS
- DRY (without over-abstraction)

## Forbidden Anti-patterns
- any
- business logic in templates
- manual DOM manipulation
- uncontrolled subscriptions
- fat components (>300 lines)
- services used as global state without control

## Services
- Design services around a single responsibility
- Use `providedIn: 'root'` for singleton services
- Use the `inject()` function instead of constructor injection
