/**
 * Every patch the manifest declares must parse under the loader's own YAML
 * dialect: a preset file that fails to parse would only surface when the
 * profile boots, long after the edit that broke it.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as yaml from 'js-yaml'
import { entryListSchema } from '@deepseek-ai/cordis-plugin-include'

/** One entry-list patch row as the loader sees it: an `insert` list of plugin rows. */
interface PatchRow {
  insert?: {
    config?: {
      id?: string
      plugins?: { id: string; config?: Record<string, unknown> }[]
    }
  }[]
}

describe('web-app bundle patches', () => {
  it('declares parseable patch files through the dsh.bundle.patch manifest field', () => {
    const root = fileURLToPath(new URL('..', import.meta.url))
    const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
      dsh?: { bundle?: { patch?: string[] } }
    }
    const patches = manifest.dsh?.bundle?.patch
    expect(Array.isArray(patches)).toBe(true)
    expect(patches).toContain('./presets/autonomous.patch.yml')
    for (const patch of patches!) {
      const parsed = yaml.load(readFileSync(resolve(root, patch), 'utf8'), { schema: entryListSchema })
      expect(Array.isArray(parsed), patch).toBe(true)
    }
  })

  it('keeps the autonomous persona carrying its Pangu and todo doctrine', () => {
    const root = fileURLToPath(new URL('..', import.meta.url))
    const rows = yaml.load(
      readFileSync(resolve(root, './presets/autonomous.patch.yml'), 'utf8'),
      { schema: entryListSchema },
    ) as PatchRow[]
    const preset = rows.flatMap(row => row.insert ?? []).find(row => row.config?.id === 'autonomous')
    expect(preset, 'the autonomous preset row is missing').toBeDefined()
    const persona = preset!.config!.plugins!.find(plugin => plugin.id === 'persona')
    const rawPrefix = persona?.config?.['prefix']
    const prefix = typeof rawPrefix === 'string' ? rawPrefix : ''
    expect(prefix, 'the persona must state when to search memory').toContain('BLOCKING GATE')
    expect(prefix, 'the persona must keep memory hygiene separate from the search gate').toContain('Memory hygiene')
    expect(prefix, 'a skipped search must be reported, not silent').toContain('本次未检索记忆')
    expect(prefix, 'the persona must keep the verification tail on a code-changing plan').toContain('todo_write')

    // Reporting a skip 是**答案格式**规则，住在 BLOCKING GATE(只管「动手前搜」)里就永远不会生效：
    // 不改东西的轮次模型会认为整节不适用，跳过它。2026-10-02 实测两轮纯问答(hello、
    // 今天天气如何)都没报 —— 规则在错误的节里。这里锁住它必须在 Communicate results 之后。
    const gateStart = prefix.indexOf('## ⚠️ BLOCKING GATE')
    const gateEnd = prefix.indexOf('## ', gateStart + 1)
    const gateSection = prefix.slice(gateStart, gateEnd)
    expect(gateSection, 'Reporting a skip 不该留在 BLOCKING GATE 节内').not.toContain('本次未检索记忆')
    const skipAt = prefix.indexOf('本次未检索记忆')
    const communicateAt = prefix.indexOf('Communicate results')
    expect(communicateAt, 'Communicate results 节丢了').toBeGreaterThan(-1)
    expect(skipAt, 'Reporting a skip 必须在 Communicate results 之后').toBeGreaterThan(communicateAt)
  })
})
