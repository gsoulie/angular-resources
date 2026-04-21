# Angular Smart Component

## Context
Follow Angular Foundation

## Goal
Create a container component responsible for:
- orchestrating data
- calling services
- managing state

## Requirements
- business logic allowed (but structured)
- state handled with signals
- no heavy logic in template

## Patterns
- data = signal()
- derived = computed()
- side effects = effect()

## Constraints
- no direct HTTP in component (use service)
- no manual subscription unless necessary

## Output
- component.ts
- component.html
- clear separation between UI and logic
