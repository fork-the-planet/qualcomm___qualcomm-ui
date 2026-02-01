import {Card} from "./card"
// preview
import {CardHeader} from "./card-header"

export function WithHeaderDemo() {
  return (
    <Card>
      <CardHeader>Title</CardHeader>
      <p>Card content</p>
    </Card>
  )
}
