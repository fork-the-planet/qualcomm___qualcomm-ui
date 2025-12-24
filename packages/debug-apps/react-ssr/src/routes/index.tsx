import {Link} from "react-router"

const components = [
  "accordion",
  "avatar",
  "breadcrumbs",
  "button",
  "button-group",
  "checkbox",
  "collapsible",
  "combobox",
  "dialog",
  "divider",
  "drawer",
  "header-bar",
  "icon",
  "icon-button",
  "inline-icon-button",
  "inline-notification",
  "link",
  "menu",
  "number-input",
  "pagination",
  "password-input",
  "popover",
  "progress",
  "progress-ring",
  "radio",
  "segmented-control",
  "select",
  "side-nav",
  "slider",
  "switch",
  "tabs",
  "tag",
  "text-input",
  "toast",
  "tooltip",
  "tree",
]

export default function HomePage() {
  return (
    <div className="page">
      <div className="section">
        <h1 className="section-title">Component Demos</h1>
        <p className="text-neutral-secondary mb-4">
          Click any component to view all its demos. On each component page,
          click individual demo titles to view them in isolation.
        </p>
        <ul className="space-y-2">
          {components.map((component) => (
            <li key={component}>
              <Link
                to={`/components/${component}`}
                className="text-primary hover:underline"
              >
                {component
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
