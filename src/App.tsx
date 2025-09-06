import { useEffect, useMemo, useState } from 'react'
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
  ActionGroup,
  ToggleButton,
  TableView,
  TableHeader,
  Column,
  Row,
  TableBody,
  Cell,
} from '@adobe/react-spectrum'
import { STORAGE_KEYS, UI_TEXT } from './constants'
import type { UserName, Game, Session, Match, GameResult } from './types'

function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem(STORAGE_KEYS.scheme) as 'light' | 'dark') || 'light',
  )
  const [userName, setUserName] = useState('')
  const [users, setUsers] = useState<UserName[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.players) ||
          localStorage.getItem(STORAGE_KEYS.users) ||
          '[]',
      ) as UserName[]
    } catch {
      return []
    }
  })
  const [games] = useState<Game[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.matches) ||
          localStorage.getItem(STORAGE_KEYS.games) ||
          '[]',
      ) as Game[]
    } catch {
      return []
    }
  })
  const [activeView, setActiveView] = useState<'home' | 'players' | 'sessions' | 'rankings'>('home')
  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.sessions) || '[]') as Session[]
    } catch {
      return []
    }
  })
  const ranking = useMemo(() => {
    const totals = new Map<string, number>()
    for (const u of users) totals.set(u, 0)
    for (const g of games) {
      totals.set(g.winner, (totals.get(g.winner) || 0) + g.lines)
    }
    return [...totals.entries()].sort((a, b) => b[1] - a[1])
  }, [users, games])

  // initial state is loaded synchronously from localStorage in useState initializers above

  useEffect(() => {
    // Save under new keys (players) and legacy (users)
    const usersJson = JSON.stringify(users)
    localStorage.setItem(STORAGE_KEYS.players, usersJson)
    localStorage.setItem(STORAGE_KEYS.users, usersJson)
  }, [users])

  // Persist computed rankings snapshot for convenience
  useEffect(() => {
    try {
      const totalsObject = Object.fromEntries(ranking)
      localStorage.setItem(STORAGE_KEYS.rankingTotals, JSON.stringify(totalsObject))
    } catch {}
  }, [ranking])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.scheme, colorScheme)
  }, [colorScheme])

  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <Flex direction="column" gap="size-0" minHeight="100vh">
        <View position="sticky" top={0} zIndex={1} backgroundColor="gray-50" borderBottomWidth="thin" borderColor="gray-300" paddingX="size-400" paddingY="size-200">
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <a onClick={() => setActiveView('home')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
              <Heading level={1}>{UI_TEXT.appTitle}</Heading>
            </a>
            <Flex direction="row" gap="size-300" alignItems="center">
              <ActionGroup
                selectionMode="single"
                selectedKeys={[activeView === 'home' ? 'players' : activeView]}
                onSelectionChange={(keys) => setActiveView(Array.from(keys)[0] as 'players' | 'sessions' | 'rankings')}
                isQuiet
              >
                <Item key="players">Players</Item>
                <Item key="sessions">{UI_TEXT.sessions}</Item>
                <Item key="rankings">Rankings</Item>
              </ActionGroup>
              <ToggleButton
                isSelected={colorScheme === 'dark'}
                onChange={(isSelected) => setColorScheme(isSelected ? 'dark' : 'light')}
              >
                {UI_TEXT.darkMode}
              </ToggleButton>
            </Flex>
          </Flex>
        </View>

        <View flex={1} overflow="auto" padding="size-400">
          <Flex direction="column" gap="size-300">
            {activeView === 'home' && (
              <View>
                <Heading level={2}>{UI_TEXT.welcome}</Heading>
                <View marginTop="size-300">
                  <ActionGroup
                    selectionMode="single"
                    onAction={(key) => setActiveView(key as 'players' | 'sessions' | 'rankings')}
                    isEmphasized
                  >
                    <Item key="players">{UI_TEXT.users}</Item>
                    <Item key="sessions">{UI_TEXT.sessions}</Item>
                    <Item key="rankings">{UI_TEXT.ranking}</Item>
                  </ActionGroup>
                </View>
              </View>
            )}

            {activeView === 'players' && (
              <>
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
              </>
            )}

            {activeView === 'sessions' && (
              <>
                <View>
                  <Heading level={3}>{UI_TEXT.createSession}</Heading>
                  <Flex gap="size-200" wrap>
                    <Text>{UI_TEXT.selectPlayers}</Text>
                    {/* Future: Picker for playerA and playerB and a DatePicker */}
                    <Button variant="primary" isDisabled>
                      {UI_TEXT.create}
                    </Button>
                  </Flex>
                </View>

                <Divider size="S" />

                <View>
                  <Heading level={3}>{UI_TEXT.sessionsList}</Heading>
                  {sessions.length === 0 ? (
                    <Text>No sessions yet.</Text>
                  ) : (
                    <ListView aria-label={UI_TEXT.sessionsList} selectionMode="none">
                      {sessions.map((s) => (
                        <Item key={s.id}>
                          {s.dateISO} — {s.playerA} vs {s.playerB} ({s.matches.length} matches)
                        </Item>
                      ))}
                    </ListView>
                  )}
                </View>
              </>
            )}

            {activeView === 'rankings' && (
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
            )}
          </Flex>
        </View>
      </Flex>
    </Provider>
  )
}

export default App
