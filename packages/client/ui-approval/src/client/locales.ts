/** `approval` namespace dictionaries. */

/** Simplified Chinese dictionary and key-set source of truth. */
export const zh = {
  waiting: '等待审批',
  'detail.aria': '审批详情',
  escalation: '工具 {toolName} 请求越权执行',
  reject: '拒绝',
  allowOnce: '允许一次',
  statusLabel: '状态',
  pending: '待审批',
  approved: '已通过',
  rejected: '已拒绝',
  toolNameLabel: '工具名称',
  callIdLabel: '调用编号',
  reasonLabel: '审批原因',
  sessionIdLabel: '会话编号',
  timestampLabel: '申请时间',
} satisfies Record<string, string>

/** Approval dictionary key union. */
export type ApprovalKey = keyof typeof zh

/** English dictionary, checked against the Chinese key set. */
export const en = {
  waiting: 'Waiting for approval',
  'detail.aria': 'Approval details',
  escalation: 'Tool {toolName} requests privileged execution',
  reject: 'Reject',
  allowOnce: 'Allow once',
  statusLabel: 'Status',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  toolNameLabel: 'Tool',
  callIdLabel: 'Call ID',
  reasonLabel: 'Reason',
  sessionIdLabel: 'Session',
  timestampLabel: 'Requested',
} satisfies Record<ApprovalKey, string>
