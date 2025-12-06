import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

// @ts-expect-error
import {accessibleName} from "../rules/accessible-name.js"

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.describe = describe

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
})

ruleTester.run("accessible-name", accessibleName, {
  invalid: [
    {
      code: `<IconButton />`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<IconButton icon={<Icon />} />`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<IconButton aria-label="" />`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<IconButton aria-labelledby="" />`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<IconButton aria-label={""} />`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<IconButton onClick={handleClick}><Icon /></IconButton>`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<Foo.IconButton />`,
      errors: [{messageId: "missingLabel"}],
    },
  ],
  valid: [
    {
      code: `<IconButton aria-label="Close" />`,
    },
    {
      code: `<IconButton aria-labelledby="close-label" />`,
    },
    {
      code: `<IconButton aria-label="Delete item" icon={<DeleteIcon />} />`,
    },
    {
      code: `<IconButton aria-label={label} />`,
    },
    {
      code: `<IconButton aria-labelledby={labelId} />`,
    },
    {
      code: `<Button>Click me</Button>`,
    },
    {
      code: `<div aria-label="test" />`,
    },
    {
      code: `<IconButton aria-label={"Search"} />`,
    },
    {
      code: `<Namespace.IconButton aria-label="Edit" />`,
    },
  ],
})
