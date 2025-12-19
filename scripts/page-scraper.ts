import {chromium} from "playwright"

interface FetchOptions {
  extractText?: boolean
  selector?: string
  timeout?: number
  url: string
}

async function fetchPage({
  extractText = false,
  selector,
  timeout = 30000,
  url,
}: FetchOptions): Promise<string> {
  const browser = await chromium.launch()
  const context = await browser.newContext({ignoreHTTPSErrors: true})
  const page = await context.newPage()

  try {
    await page.goto(url, {timeout, waitUntil: "networkidle"})

    if (selector) {
      await page.waitForSelector(selector, {timeout})
    }

    return extractText ? await page.innerText("body") : await page.content()
  } finally {
    await page.close()
    await browser.close()
  }
}

const url = process.argv[2]
const selector = process.argv[3]

if (!url) {
  console.error("Usage: pnpm tsx scripts/page-scraper-mcp.ts <url> [selector]")
  process.exit(1)
}

const content = await fetchPage({extractText: true, selector, url})
console.log(content)
