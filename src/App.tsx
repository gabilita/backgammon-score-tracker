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

function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('bst:scheme') as 'light' | 'dark') || 'light',
  )
  const [userName, setUserName] = useState('')
  const [users, setUsers] = useState<string[]>([])
  const [playerA, setPlayerA] = useState<string | null>(null)
  const [playerB, setPlayerB] = useState<string | null>(null)
  const [lines, setLines] = useState<number>(1)
  const [games, setGames] = useState<{
    id: string
    a: string
    b: string
    lines: number
    winner: string
  }[]>([])
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
      const savedUsers = JSON.parse(localStorage.getItem('bst:users') || '[]') as string[]
      const savedGames = JSON.parse(localStorage.getItem('bst:games') || '[]') as {
        id: string
        a: string
        b: string
        lines: number
        winner: string
      }[]
      if (Array.isArray(savedUsers)) setUsers(savedUsers)
      if (Array.isArray(savedGames)) setGames(savedGames)
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('bst:users', JSON.stringify(users))
    localStorage.setItem('bst:games', JSON.stringify(games))
  }, [users, games])

  useEffect(() => {
    localStorage.setItem('bst:scheme', colorScheme)
  }, [colorScheme])

  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <Flex direction="column" gap="size-300" margin="size-400">
        <Flex direction="row" justifyContent="space-between" alignItems="center">
          <Heading level={1}>Backgammon Score Tracker</Heading>
          <Button
            variant="secondary"
            onPress={() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light'))}
          >
            Switch to {colorScheme === 'light' ? 'Dark' : 'Light'}
          </Button>
        </Flex>

        <View>
          <Heading level={3}>Add User</Heading>
          <Flex gap="size-200" alignItems="end">
            <TextField label="Name" value={userName} onChange={setUserName} width="size-3600" />
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
              Add
            </Button>
          </Flex>
        </View>

        <Divider size="S" />

        <View>
          <Heading level={3}>Users</Heading>
          {users.length === 0 ? (
            <Text>No users yet.</Text>
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
          <Heading level={3}>Add Game / Lines</Heading>
          <Flex gap="size-200" wrap>
            <Picker
              aria-label="Player A"
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
              aria-label="Player B"
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
              label="Lines"
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
                Record Winner
              </Button>
              <Dialog>
                <Heading>Confirm Winner</Heading>
                <Content>
                  <Text>Select the winner for this game.</Text>
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
                      {playerA || 'Player A'}
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
                      {playerB || 'Player B'}
                    </ActionButton>
                  </Flex>
                </Content>
                <ButtonGroup>
                  <Button variant="secondary">Close</Button>
                </ButtonGroup>
              </Dialog>
            </DialogTrigger>
          </Flex>

          <View marginTop="size-300">
            <TableView aria-label="Games" density="spacious">
              <TableHeader>
                <Column>Player A</Column>
                <Column>Player B</Column>
                <Column>Lines</Column>
                <Column>Winner</Column>
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
          <Heading level={3}>Ranking</Heading>
          <TableView aria-label="Ranking" density="spacious">
            <TableHeader>
              <Column>Rank</Column>
              <Column>Player</Column>
              <Column>Total Lines</Column>
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
    </Provider>
  )
}

export default App
