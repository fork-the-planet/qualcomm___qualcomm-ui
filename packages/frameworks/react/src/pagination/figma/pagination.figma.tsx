import figma from "@figma/code-connect"

import type {QdsPaginationSize} from "@qualcomm-ui/qds-core/pagination"
import {Pagination} from "@qualcomm-ui/react/pagination"

const FIGMA_URL = "<FIGMA_COMPONENTS_BASE>?node-id=3746-4648"

// Shared props for size (omitting default "sm")
const sharedProps = {
  size: figma.enum<QdsPaginationSize>("size", {
    md: "md",
  }),
}

// Shared props for table-bar variants
const tableBarProps = {
  ...sharedProps,
  pageMetadata: figma.boolean("range", {
    true: (
      <Pagination.PageMetadata>
        {({count, pageEnd, pageStart}) =>
          `${pageStart} - ${pageEnd} of ${count} results`
        }
      </Pagination.PageMetadata>
    ),
  }),
  pageSize: figma.boolean("items", {
    true: (
      <Pagination.PageSize options={[10, 25, 50, 100]}>
        <Pagination.PageSizeLabel>Items per page</Pagination.PageSizeLabel>
      </Pagination.PageSize>
    ),
  }),
}

/**
 * Pagination Nav - Simple page buttons only
 */
figma.connect(Pagination.Root, FIGMA_URL, {
  example: ({size}) => (
    <Pagination.Root count={100} defaultPageSize={10} size={size}>
      <Pagination.PageButtons />
    </Pagination.Root>
  ),
  props: sharedProps,
  variant: {control: "none", type: "pagination-nav"},
})

/**
 * Table Bar - Controls on left
 * Layout: [PageSize] [PageMetadata] ... [PageButtons]
 */
figma.connect(Pagination.Root, FIGMA_URL, {
  example: ({pageMetadata, pageSize, size}) => (
    <Pagination.Root count={360} defaultPageSize={100} size={size}>
      {pageSize}
      {pageMetadata}
      <Pagination.PageButtons />
    </Pagination.Root>
  ),
  props: tableBarProps,
  variant: {control: "left", type: "table-bar"},
})

/**
 * Table Bar - Controls on right
 * Layout: [PageButtons] ... [PageSize] [PageMetadata]
 */
figma.connect(Pagination.Root, FIGMA_URL, {
  example: ({pageMetadata, pageSize, size}) => (
    <Pagination.Root count={360} defaultPageSize={100} size={size}>
      <Pagination.PageButtons />
      {pageSize}
      {pageMetadata}
    </Pagination.Root>
  ),
  props: tableBarProps,
  variant: {control: "right", type: "table-bar"},
})
