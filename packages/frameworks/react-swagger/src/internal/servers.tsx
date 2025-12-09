import {ReactNode, useCallback, useEffect} from "react"

import {List, OrderedMap} from "immutable"

import {QCombobox, QTextInput} from "@qui/react"

interface ServersProps {
  // Use 'any[]' for ImPropTypes.list
  currentServer: string
  // Use '() => any' for PropTypes.func
  getEffectiveServerValue: (server: string) => any
  // Use '() => void' for PropTypes.func
  getServerVariable: (currentServer: any, name: string) => any
  servers: List<any>
  setSelectedServer: (server: any) => void
  // Use '() => void' for PropTypes.func
  setServerVariableValue: (value: any) => void // Use '() => any' for PropTypes.func
}

export function Servers({
  currentServer,
  getEffectiveServerValue,
  getServerVariable,
  servers,
  setSelectedServer,
  setServerVariableValue,
}: ServersProps): ReactNode {
  const currentServerDefinition =
    servers.find((s) => s.get("url") === currentServer) || OrderedMap()
  const currentServerVariableDefs =
    currentServerDefinition.get("variables") || OrderedMap()
  const shouldShowVariableUI = currentServerVariableDefs.size !== 0

  useEffect(() => {
    if (currentServer) {
      return
    }

    // fire 'change' event to set default 'value' of select
    setSelectedServer(servers.first()?.get("url"))
  }, [currentServer, servers, setSelectedServer])

  useEffect(() => {
    // server has changed, we may need to set default values
    const currentServerDefinition = servers.find(
      (server) => server.get("url") === currentServer,
    )
    if (!currentServerDefinition) {
      setSelectedServer(servers.first().get("url"))
      return
    }

    const currentServerVariableDefs =
      currentServerDefinition.get("variables") || OrderedMap()
    currentServerVariableDefs.map((val: any, key: any) => {
      setServerVariableValue({
        key,
        server: currentServer,
        val: val.get("default") || "",
      })
    })
  }, [currentServer, servers, setSelectedServer, setServerVariableValue])

  const handleServerChange = useCallback(
    (value: string) => {
      setSelectedServer(value)
    },
    [setSelectedServer],
  )

  const handleServerVariableChange = useCallback(
    (name: string, newValue: string) => {
      setServerVariableValue({
        key: name,
        server: currentServer,
        val: newValue,
      })
    },
    [setServerVariableValue, currentServer],
  )

  const serversOpts = servers.toArray().map((schema) => schema.get("url"))

  return (
    <div className="servers">
      <QCombobox
        className="q-swagger-input"
        clearable={false}
        disableOptionToggle
        id="servers"
        onChange={(event, value) => handleServerChange(value)}
        options={serversOpts}
        value={currentServer}
      />

      {shouldShowVariableUI && (
        <div>
          <div className="computed-url">
            Computed URL:
            <code>{getEffectiveServerValue(currentServer)}</code>
          </div>
          <h4>Server variables</h4>
          <table>
            <tbody>
              {currentServerVariableDefs.entrySeq().map(([name, val]: any) => {
                const opts: string[] = val.get("enum")
                  ? val.get("enum").toArray()
                  : []
                return (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>
                      {opts.length ? (
                        <QCombobox
                          onChange={(event, value) =>
                            handleServerVariableChange(name, value)
                          }
                          options={opts}
                          value={getServerVariable(currentServer, name)}
                        />
                      ) : (
                        <QTextInput
                          onChange={(event, value) =>
                            handleServerVariableChange(name, value)
                          }
                          value={getServerVariable(currentServer, name) || ""}
                        />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
