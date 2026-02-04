import sections from "../../public/exports/sections.json"

export function loader() {
  return new Response(JSON.stringify(sections), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  })
}
