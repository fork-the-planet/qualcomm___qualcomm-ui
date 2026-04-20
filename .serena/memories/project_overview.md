# Qualcomm UI (@qualcomm-ui)

## Purpose
A multi-framework component library (design system) for Qualcomm. Provides headless, accessible UI components with framework-specific adapters for React and Angular, branded with the Qualcomm Design System (QDS).

## Architecture
Multi-layer architecture with a framework-agnostic headless core:

1. **Headless Layer** (framework-agnostic):
   - `@qualcomm-ui/utils` — Generic utilities, zero dependencies
   - `@qualcomm-ui/dom` — DOM abstractions, cross-browser compatibility
   - `@qualcomm-ui/core` — State machines, business logic, accessibility (inspired by zag.js)

2. **Framework Adapters** (no styling):
   - `@qualcomm-ui/react-core` — React hooks, context, data binding
   - `@qualcomm-ui/angular-core` — Angular services, directives, data binding

3. **Design System**:
   - `@qualcomm-ui/qds-core` — Design tokens, theme specs, brand guidelines
   - `@qualcomm-ui/tailwind-plugin` — Tailwind CSS integration

4. **Styled Implementations**:
   - `@qualcomm-ui/react` — React + QDS themed components
   - `@qualcomm-ui/angular` — Angular + QDS themed components

5. **Documentation**:
   - `@qualcomm-ui/react-docs`, `@qualcomm-ui/angular-docs`, `@qualcomm-ui/qui-docs`

6. **Debug/Test Apps**:
   - `angular-csr`, `angular-ssr`, `react-ssr`

## Key Design Decisions
- Business logic lives in headless core (state machines), NOT in framework-specific code
- Multiple framework implementations share the same behavior
- Web components were explicitly rejected in favor of native framework implementations
- Deep framework integration is prioritized over universal portability