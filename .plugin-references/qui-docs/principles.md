# QUI Docs Authoring Principles

## Effective Documentation

A good page answers the reader's next practical question:

- What can I do with this feature?
- When should I use it?
- What access, setup, or data do I need first?
- What exact steps or calls complete the task?
- What changes after I do it?
- How do I know it worked?
- What can fail, and how do I fix it?
- Where do I go next?

If the reader cannot answer those questions after reading, the page is not done.

## Page Types

Every page has one primary type. Split the page if it does not fit one type cleanly.

- **Task Guide**: complete one concrete action.
- **Workflow Guide**: move through multiple pages, tools, or systems to finish real work.
- **Capability Reference**: explain what a feature controls and how fields, actions, states, and side effects work.
- **Troubleshooting Guide**: start from a symptom or error and give checks, fixes, and escalation guidance.
- **Concept Page**: build the mental model a reader needs before following tasks.
- **Field or State Reference**: define dense columns, statuses, filters, fields, or actions.
- **Recipe Collection**: short, repeatable operations that do not need full workflow treatment.
- **Decision Guide**: choose between valid options and understand tradeoffs.

## Page Value

Open with what the page helps the reader do. Do not start with `This page contains...`, `The below sections...`, or `This document explains...`.

Prefer:

```md
Use Device Status to investigate why a device is unavailable for job execution. Start by checking allocation state, host connection, last heartbeat, and the active job linked to the device.
```

Avoid manual table-of-contents or summary sections that duplicate the H2-H4 headings. QUI Docs renders the table of contents automatically.

## Screenshots

Screenshots support the text. They do not replace it. Use screenshots to confirm a state, clarify a dense table, or show a non-obvious control location.

Every screenshot needs nearby text explaining why it matters. If removing screenshots leaves no useful documentation, rewrite the page as a task, workflow, capability, troubleshooting, concept, field/state, recipe, or decision page.

## Writing

Use active voice, present tense, imperative steps, and exact UI labels, field names, commands, statuses, and file names.

Avoid `below`, `above`, `here`, `please`, `user can`, `as per`, and `kindly`. Name the thing directly.

## Before Submitting

Confirm:

- Each page has one clear primary type.
- The first paragraph states the reader value.
- Prerequisites, steps, expected result, and failure modes are explicit.
- Examples use realistic values.
- Screenshots support the text instead of replacing it.
- Terminology matches the canonical glossary and is consistent.
