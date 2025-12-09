import {ReactNode, useCallback, useEffect} from "react"

import {QCombobox} from "@qui/react"

Schemes.displayName = "Schemes"

interface Props {
  currentScheme: string
  method?: string
  path?: string
  schemes: any
  specActions: any
}

export function Schemes(props: Props): ReactNode {
  const {currentScheme, method, path, schemes, specActions} = props

  const setSchemes = useCallback(
    (value: any) => {
      specActions.setScheme(value, path, method)
    },
    [method, path, specActions],
  )

  useEffect(() => {
    if (!currentScheme || !schemes.includes(currentScheme)) {
      setSchemes(schemes.first())
    }
  }, [currentScheme, schemes, setSchemes])

  return (
    <QCombobox
      clearable={false}
      disableOptionToggle
      label="Schemes"
      onChange={(_, value) => setSchemes(value)}
      options={schemes.valueSeq().toArray()}
      style={{minWidth: 100}}
      value={currentScheme}
    />
  )
}
