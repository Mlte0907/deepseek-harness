/** Composer takeover for one pending approval waterfall. */
import { useState, type ReactNode } from 'react'
import { Button, StateDot, Pill } from '@deepseek-ai/dsh-client-ui-primitives'
import type { ApprovalComposerProps, PendingApproval } from './contract/slots.ts'
import css from './ApprovalPanel.module.css'

/** Status label for the current approval state. */
function approvalStatus(answered: boolean, outcome: string | null): 'pending' | 'approved' | 'rejected' {
  if (!answered) return 'pending'
  return outcome === 'allowed-once' ? 'approved' : 'rejected'
}

/**
 * Render one pending approval and its optional Tool-owned detail.
 * @param props - selector-matched request and standard Slot props.
 * @returns The approval composer takeover.
 */
export function ApprovalPanel(props: ApprovalComposerProps) {
  const approval = props.matched
  const detail = approval.callId === undefined
    ? null
    : props.renderSlot('conversation.approval.detail', { callId: approval.callId })
  return <ApprovalFlow key={approval.key} pending={approval} detail={detail} t={props.t} />
}

function ApprovalFlow({ pending, detail, t }: {
  pending: PendingApproval
  detail: ReactNode
  t: ApprovalComposerProps['t']
}) {
  const [answered, setAnswered] = useState(false)
  const [outcome, setOutcome] = useState<string | null>(null)
  const status = approvalStatus(answered, outcome)

  const answer = (outcome: 'allowed-once' | 'rejected'): void => {
    setAnswered(true)
    setOutcome(outcome)
    void pending.answer(outcome).catch(() => {
      setAnswered(false)
      setOutcome(null)
    })
  }

  const statusColor: Record<'pending' | 'approved' | 'rejected', 'done' | 'warning' | 'error' | 'ongoing'> = {
    pending: 'ongoing',
    approved: 'done',
    rejected: 'error',
  }

  return (
    <div className={css.root} data-approval-key={pending.key}>
      <div className={css.card}>
        {/* Status bar */}
        <div className={css.statusBar}>
          <StateDot state={statusColor[status]} />
          <span className={css.statusText}>{t(status as unknown as Parameters<typeof t>[0])}</span>
          <Pill active={status === 'pending'} className={css.statusPill}>
            {t(status as unknown as Parameters<typeof t>[0])}
          </Pill>
        </div>

        {/* Form fields */}
        <div className={css.fields} data-approval-scroll="" tabIndex={0} role="group" aria-label={t('detail.aria')}>
          <div className={css.fieldRow}>
            <span className={css.fieldLabel}>{t('toolNameLabel')}</span>
            <span className={css.fieldValue}>{pending.toolName}</span>
          </div>
          <div className={css.fieldRow}>
            <span className={css.fieldLabel}>{t('sessionIdLabel')}</span>
            <span className={css.fieldValue}>{pending.sessionId}</span>
          </div>
          {pending.callId !== undefined && (
            <div className={css.fieldRow}>
              <span className={css.fieldLabel}>{t('callIdLabel')}</span>
              <span className={css.fieldValue}>{pending.callId}</span>
            </div>
          )}
          {pending.reason !== undefined && (
            <div className={css.fieldRow}>
              <span className={css.fieldLabel}>{t('reasonLabel')}</span>
              <span className={css.fieldValue}>{pending.reason}</span>
            </div>
          )}
          <div className={css.headline}>{pending.reason ?? t('escalation', { toolName: pending.toolName })}</div>
          {detail !== null && <div className={css.command}>{detail}</div>}
        </div>

        {/* Approval buttons */}
        <div className={css.actionRow}>
          <Button variant="outline" className={css.reject} disabled={answered} onClick={() => { answer('rejected') }}>
            {t('reject')}
          </Button>
          <Button variant="primary" disabled={answered} onClick={() => { answer('allowed-once') }}>
            {t('allowOnce')}
          </Button>
        </div>
      </div>
    </div>
  )
}
