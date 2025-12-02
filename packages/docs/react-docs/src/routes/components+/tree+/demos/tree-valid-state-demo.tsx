import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree} from "@qualcomm-ui/react/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

export function TreeValidStateDemo() {
  return (
    // preview
    <Tree.Root
      className="w-full max-w-sm"
      collection={collection}
      // [!code highlight]
      defaultCheckedValue={["elite", "plus"]}
      defaultExpandedValue={["qualcomm", "sdx"]}
    >
      {/* preview */}
      {collection.rootNode.nodes?.map((node, index) => {
        return (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeCheckbox />
                <Tree.NodeText>{node.name}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeCheckbox />
                <Tree.NodeText>{node.name}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        )
      })}
    </Tree.Root>
  )
}

const collection = createTreeCollection<Node>({
  rootNode: {
    id: "ROOT",
    name: "",
    nodes: [
      {
        id: "qualcomm",
        name: "Qualcomm",
        nodes: [
          {
            id: "sdx",
            name: "Snapdragon X",
            nodes: [
              {id: "elite", name: "Snapdragon X Elite"},
              {id: "plus", name: "Snapdragon X Plus"},
            ],
          },
        ],
      },
    ],
  },
})
