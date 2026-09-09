// Web e2e scenario: switching the model on a session that has not issued a
// request yet must route that session's own next request through the newly
// selected route. The shipped default-model scenario only covers the settings/
// projection face of the switch; this one covers the request-routing face.
// No browser: the composer gesture is simulated through the same
// sessionController.selectModel RPC the client issues. No model traffic: the
// fixture-less scaffold answers with a route-only adapter whose stream throws,
// and request/header is logged before any adapter traffic, so the route under
// test is durable even though the turn itself fails.
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { fileURLToPath } from 'node:url'
import { SessionId } from '@deepseek-ai/dsh-session'
import { launchWebScaffold, type WebScaffold } from './scaffold.ts'

/** The route the scenario starts on (composition default via its own overlay seam). */
const START_ROUTE = 'origin-gateway'
const START_MODEL = 'origin-large'
/** The route the switch lands on. */
const ROUTE = 'acme-gateway'
const MODEL = 'acme-large'

describe('web e2e: a session-scoped model switch routes the same session', () => {
  let scaffold: WebScaffold

  beforeAll(async () => {
    // Start the shipped default on the origin route (same overlay seam the
    // default-model scenario uses) so round 1 runs somewhere concrete.
    scaffold = await launchWebScaffold({
      extraOverlayPath: fileURLToPath(new URL('./default-model.overlay.yml', import.meta.url)),
    })
    // Declare both routes the way the Models page would (pi-ai settings seam).
    await scaffold.ctx.settings.update('llm-pi-ai', {
      providers: {
        [START_ROUTE]: {
          displayName: 'Origin Gateway',
          api: 'openai-completions',
          baseURL: 'https://gateway.origin.example/v1',
          models: [{ id: START_MODEL, name: 'Origin Large' }],
        },
        [ROUTE]: {
          displayName: 'Acme Gateway',
          api: 'openai-completions',
          baseURL: 'https://gateway.acme.example/v1',
          models: [{ id: MODEL, name: 'Acme Large' }],
        },
      },
    })
  }, 120_000)

  afterAll(async () => {
    await scaffold?.close()
  })

  /** The provider/model of the session's last logged request header. */
  const lastLoggedRoute = (sessionId: string): { provider: string; model: string } => {
    const session = scaffold.ctx.sessions.get(SessionId(sessionId))
    if (session === undefined) throw new Error(`session "${sessionId}" is not live`)
    const events = typeof session.snapshotEvents === 'function'
      ? session.snapshotEvents()
      : session.events
    const headers = events.filter((event: { type: string }) => event.type === 'request/header')
    if (headers.length === 0) throw new Error('no request/header logged yet')
    const last = headers[headers.length - 1] as { data: { header: { config: { provider: string; model: string } } } }
    return last.data.header.config
  }

  const headersOf = (sessionId: string): number => {
    const session = scaffold.ctx.sessions.get(SessionId(sessionId))
    if (session === undefined) throw new Error(`session "${sessionId}" is not live`)
    const events = typeof session.snapshotEvents === 'function'
      ? session.snapshotEvents()
      : session.events
    return events.filter((event: { type: string }) => event.type === 'request/header').length
  }

  const waitUntilLogged = async (sessionId: string): Promise<void> => {
    for (let i = 0; i < 100; i += 1) {
      if (headersOf(sessionId) >= 1) return
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error('no request/header logged within the wait window')
  }

  const waitUntilSecondHeader = async (sessionId: string): Promise<void> => {
    for (let i = 0; i < 100; i += 1) {
      if (headersOf(sessionId) >= 2) return
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error('second request/header never logged within the wait window')
  }

  // SKIPPED on dsh >= 0.1.5: the fixture-less scaffold no longer logs a
  // `request/header` for a real prompt (route admission ordering changed and
  // the session log moved to V3), so `waitUntilLogged` never observes round 1.
  // The 0.1.5-native observation pattern seeds headers by hand instead — see
  // default-model.e2e.ts:100 (`sessions.get(...).append('request/header', …)`.
  // Porting this scenario means seeding round 1 the same way and asserting the
  // freshly selected route on the second header. The production fix this test
  // guards (x-opencode-session on pi-ai requests) is still live in
  // packages/llm/llm-pi-ai/src/adapter.ts and NOT implemented upstream.
  it.skip('routes the next request through the freshly selected model', async () => {
    const sessionId = SessionId('model-switch-same-session')
    await scaffold.ctx.sessionController.create({ sessionId, cwd: scaffold.workspaceCwd, agentPreset: 'autonomous' })

    // Round 1: prompt on the composition default route (origin), which fails
    // on the route-only adapter — the "my model is erroring" state a user is
    // in when they reach for the model picker.
    await scaffold.ctx.sessionController.prompt({
      requestId: 'model-switch-route-0' as never,
      sessionId,
      mode: 'queue',
      content: [{ type: 'text', text: 'first' }],
    }, new AbortController().signal).catch(() => undefined)
    await waitUntilLogged(sessionId)
    expect(lastLoggedRoute(sessionId)).toEqual({ provider: START_ROUTE, model: START_MODEL })

    // Switch THIS session's model after a failed turn (the picker gesture).
    await scaffold.ctx.sessionController.selectModel({
      sessionId,
      provider: ROUTE,
      model: MODEL,
    })

    // Round 2: the retried prompt must route through the new selection.
    await scaffold.ctx.sessionController.prompt({
      requestId: 'model-switch-route-1' as never,
      sessionId,
      mode: 'queue',
      content: [{ type: 'text', text: 'second' }],
    }, new AbortController().signal).catch(() => undefined)
    await waitUntilSecondHeader(sessionId)

    expect(lastLoggedRoute(sessionId)).toEqual({ provider: ROUTE, model: MODEL })
  }, 60_000)
})
