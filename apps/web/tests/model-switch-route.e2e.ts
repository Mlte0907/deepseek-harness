// Web e2e scenario: switching the model on one session must route THAT
// session's own next request through the newly selected route — even while the
// session holds its own logged route. The shipped default-model scenario
// covers the settings face of the switch (what later sessions start on); this
// one covers the session-scoped face: the switch lands on the session's
// projection, which is the value the loop consumes on its next step. On 0.1.5
// the composer switch additionally rewrites the shared default, so a session
// created afterwards starts on the new route too (asserted at the end).
//
// 0.1.5 flavor: the fixture-less scaffold no longer logs request/header for a
// real prompt, so the "session has run a turn" fact is seeded the same way
// default-model.e2e seeds it — sessions.get(...).append('request/header').
// No browser: the composer gesture is simulated through the same
// sessionController.selectModel RPC the client issues. No model traffic: the
// adapter registry stays empty and nothing here prompts.
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

  /** The route the Client derives for one session: its own logged route, else the shared default. */
  const currentOf = (sessionId: string): unknown => {
    const session = scaffold.ctx.sessions.get(SessionId(sessionId))
    if (session === undefined) throw new Error(`session "${sessionId}" is not live`)
    return scaffold.ctx.sessionProjections.snapshot(session).values.modelSelection?.next
      ?? scaffold.ctx.agentDefaultModel.currentSelection()
  }

  beforeAll(async () => {
    // Start the shipped default on the origin route (same overlay seam the
    // default-model scenario uses) and declare both routes through the
    // settings seam so the picker has somewhere to start and somewhere to go.
    scaffold = await launchWebScaffold({
      extraOverlayPath: fileURLToPath(new URL('./default-model.overlay.yml', import.meta.url)),
    })
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

  it('routes the freshly selected model into the same session only', async () => {
    const sessionId = await scaffold.ctx.sessionController.create({
      sessionId: SessionId('model-switch-same-session'),
      cwd: scaffold.workspaceCwd,
    }).then(response => response.sessionId)

    // Round 1 fact: the session starts on the composition default...
    expect(currentOf(sessionId)).toEqual({ provider: START_ROUTE, model: START_MODEL })

    // ...and once it has run a turn, its own logged route is the fact it keeps
    // deriving from (seeded: the fixture-less scaffold does not log headers for
    // real prompts on 0.1.5).
    scaffold.ctx.sessions.get(SessionId(sessionId))?.append('request/header', {
      header: { config: { provider: START_ROUTE, model: START_MODEL } },
      reason: 'initial',
    })
    expect(currentOf(sessionId)).toEqual({ provider: START_ROUTE, model: START_MODEL })

    // The picker gesture, through the same RPC the client issues: a
    // session-scoped switch, not a default rewrite.
    await scaffold.ctx.sessionController.selectModel({
      sessionId: SessionId(sessionId),
      provider: ROUTE,
      model: MODEL,
    })

    // The session's own next-request selection switched...
    expect(currentOf(sessionId)).toEqual({ provider: ROUTE, model: MODEL })

    // ...while a session created after the switch starts on it. 0.1.5
    // semantics (see default-model.e2e): the composer switch is ALSO what
    // writes the shared agent default, so this is expected — the
    // session-scoped guarantee this scenario guards is the assertion above:
    // the switch reached THIS session's next-request selection even while it
    // held its own logged route.
    const otherId = await scaffold.ctx.sessionController.create({
      sessionId: SessionId('model-switch-other-session'),
      cwd: scaffold.workspaceCwd,
    }).then(response => response.sessionId)
    expect(currentOf(otherId)).toEqual({ provider: ROUTE, model: MODEL })
  }, 60_000)
})
