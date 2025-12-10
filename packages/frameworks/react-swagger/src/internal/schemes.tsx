import type {ReactNode} from "react"
import {useCallback, useEffect, useMemo} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

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

  const collection = useMemo(() => {
    return selectCollection({items: schemes.valueSeq().toArray()})
  }, [schemes])

  useEffect(() => {
    if (!currentScheme || !schemes.includes(currentScheme)) {
      setSchemes(schemes.first())
    }
  }, [currentScheme, schemes, setSchemes])

  return (
    <Select
      clearable={false}
      collection={collection}
      label="Schemes"
      onValueChange={(value) => setSchemes(value[0])}
      style={{minWidth: 100}}
      value={currentScheme ? [currentScheme] : []}
    />
  )
}
