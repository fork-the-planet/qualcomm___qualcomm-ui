import {getPages, getSections} from "@qualcomm-ui/docs-plugin/markdown-content"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {createExportsLoader} from "@qualcomm-ui/react-router-utils/node"

export const loader = createExportsLoader({
  exports: siteData.exports,
  getPages,
  getSections,
})
