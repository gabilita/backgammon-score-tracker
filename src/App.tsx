import { useEffect, useMemo, useState, type Key } from 'react'
import './App.css'
import {
  Provider,
  defaultTheme,
  Flex,
  View,
  Heading,
  Text,
  Button,
  TextField,
  ListView,
  Item,
  Divider,
  DialogTrigger,
  Dialog,
  Content,
  ButtonGroup,
  ActionButton,
  Picker,
  NumberField,
  TableView,
  TableHeader,
  Column,
  Row,
  TableBody,
  Cell,
} from '@adobe/react-spectrum'
import { STORAGE_KEYS, UI_TEXT } from './constants'
import type { UserName, Game } from './types'

function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem(STORAGE_KEYS.scheme) as 'light' | 'dark') || 'light',
  )
  const [userName, setUserName] = useState('')
  const [users, setUsers] = useState<UserName[]>([])
  const [playerA, setPlayerA] = useState<UserName | null>(null)
  const [playerB, setPlayerB] = useState<UserName | null>(null)
  const [lines, setLines] = useState<number>(1)
  const [games, setGames] = useState<Game[]>([])
  const ranking = useMemo(() => {
    const totals = new Map<string, number>()
    for (const u of users) totals.set(u, 0)
    for (const g of games) {
      totals.set(g.winner, (totals.get(g.winner) || 0) + g.lines)
    }
    return [...totals.entries()].sort((a, b) => b[1] - a[1])
  }, [users, games])

  useEffect(() => {
    try {
      const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]') as UserName[]
      const savedGames = JSON.parse(localStorage.getItem(STORAGE_KEYS.games) || '[]') as Game[]
      if (Array.isArray(savedUsers)) setUsers(savedUsers)
      if (Array.isArray(savedGames)) setGames(savedGames)
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users))
    localStorage.setItem(STORAGE_KEYS.games, JSON.stringify(games))
  }, [users, games])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.scheme, colorScheme)
  }, [colorScheme])

  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <Flex direction="column" gap="size-0" minHeight="100vh">
        <View position="sticky" top={0} zIndex={1} backgroundColor="gray-50" borderBottomWidth="thin" borderColor="gray-300" paddingX="size-400" paddingY="size-200">
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Heading level={1}>{UI_TEXT.appTitle}</Heading>
            <Button
              variant="secondary"
              onPress={() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light'))}
            >
              {colorScheme === 'light' ? UI_TEXT.toggleToDark : UI_TEXT.toggleToLight}
            </Button>
          </Flex>
        </View>

        <View flex={1} overflow="auto" padding="size-400">
          <Flex direction="column" gap="size-300">
            <View>
              <Heading level={3}>{UI_TEXT.addUser}</Heading>
              <Flex gap="size-200" alignItems="end">
                <TextField label={UI_TEXT.nameLabel} value={userName} onChange={setUserName} width="size-3600" />
                <Button
                  variant="cta"
                  isDisabled={!userName.trim()}
                  onPress={() => {
                    const name = userName.trim()
                    if (!name) return
                    if (users.includes(name)) return
                    setUsers((prev) => [...prev, name])
                    setUserName('')
                  }}
                >
                  {UI_TEXT.add}
                </Button>
              </Flex>
            </View>

            <Divider size="S" />

            <View>
              <Heading level={3}>{UI_TEXT.users}</Heading>
              {users.length === 0 ? (
                <Text>{UI_TEXT.noUsers}</Text>
              ) : (
                <ListView aria-label="Users list" selectionMode="none">
                  {users.map((u) => (
                    <Item key={u}>{u}</Item>
                  ))}
                </ListView>
              )}
            </View>

            <Divider size="S" />

            <View>
              <Heading level={3}>{UI_TEXT.addGame}</Heading>
              <Flex gap="size-200" wrap>
                <Picker
                  aria-label={UI_TEXT.playerA}
                  selectedKey={playerA || undefined}
                  onSelectionChange={(key: Key | null) => setPlayerA(key ? String(key) : null)}
                  isDisabled={users.length < 2}
                  width="size-2400"
                >
                  {users.map((u) => (
                    <Item key={u}>{u}</Item>
                  ))}
                </Picker>
                <Picker
                  aria-label={UI_TEXT.playerB}
                  selectedKey={playerB || undefined}
                  onSelectionChange={(key: Key | null) => setPlayerB(key ? String(key) : null)}
                  isDisabled={users.length < 2}
                  width="size-2400"
                >
                  {users.map((u) => (
                    <Item key={u}>{u}</Item>
                  ))}
                </Picker>
                <NumberField
                  label={UI_TEXT.lines}
                  minValue={1}
                  value={lines}
                  onChange={setLines}
                  formatOptions={{ maximumFractionDigits: 0 }}
                  width="size-2000"
                />

                <DialogTrigger type="modal">
                  <Button
                    variant="cta"
                    isDisabled={!playerA || !playerB || playerA === playerB || lines < 1}
                  >
                    {UI_TEXT.recordWinner}
                  </Button>
                  <Dialog>
                    <Heading>{UI_TEXT.confirmWinner}</Heading>
                    <Content>
                      <Text>{UI_TEXT.selectWinner}</Text>
                      <Flex gap="size-200" marginTop="size-200">
                        <ActionButton
                          onPress={() => {
                            if (!playerA || !playerB) return
                            setGames((prev) => [
                              { id: crypto.randomUUID(), a: playerA, b: playerB, lines, winner: playerA },
                              ...prev,
                            ])
                          }}
                        >
                          {playerA || UI_TEXT.playerA}
                        </ActionButton>
                        <ActionButton
                          onPress={() => {
                            if (!playerA || !playerB) return
                            setGames((prev) => [
                              { id: crypto.randomUUID(), a: playerA, b: playerB, lines, winner: playerB },
                              ...prev,
                            ])
                          }}
                        >
                          {playerB || UI_TEXT.playerB}
                        </ActionButton>
                      </Flex>
                    </Content>
                    <ButtonGroup>
                      <Button variant="secondary">{UI_TEXT.close}</Button>
                    </ButtonGroup>
                  </Dialog>
                </DialogTrigger>
              </Flex>

              <View marginTop="size-300">
                <TableView aria-label={UI_TEXT.games} density="spacious">
                  <TableHeader>
                    <Column>{UI_TEXT.playerA}</Column>
                    <Column>{UI_TEXT.playerB}</Column>
                    <Column>{UI_TEXT.lines}</Column>
                    <Column>{UI_TEXT.recordWinner}</Column>
                  </TableHeader>
                  <TableBody>
                    {games.map((g) => (
                      <Row key={g.id}>
                        <Cell>{g.a}</Cell>
                        <Cell>{g.b}</Cell>
                        <Cell>{g.lines}</Cell>
                        <Cell>{g.winner}</Cell>
                      </Row>
                    ))}
                  </TableBody>
                </TableView>
              </View>
            </View>

            <Divider size="S" />

            <View>
              <Heading level={3}>{UI_TEXT.ranking}</Heading>
              <TableView aria-label={UI_TEXT.ranking} density="spacious">
                <TableHeader>
                  <Column>{UI_TEXT.rank}</Column>
                  <Column>{UI_TEXT.player}</Column>
                  <Column>{UI_TEXT.totalLines}</Column>
                </TableHeader>
                <TableBody>
                  {ranking.map(([player, total], idx) => (
                    <Row key={player}>
                      <Cell>{idx + 1}</Cell>
                      <Cell>{player}</Cell>
                      <Cell>{total}</Cell>
                    </Row>
                  ))}
                </TableBody>
              </TableView>
            </View>
          </Flex>
        </View>
      </Flex>
    </Provider>
  )
}

export default App
