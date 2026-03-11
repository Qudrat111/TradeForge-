import { RfqStatus } from '../types/rfq.types';

/**
 * Defines the valid state transitions for an RFQ.
 * An RFQ may only move from a given status to one of the listed target statuses.
 */
export const RFQ_STATUS_TRANSITIONS: Record<RfqStatus, RfqStatus[]> = {
  [RfqStatus.DRAFT]: [RfqStatus.PUBLISHED, RfqStatus.CANCELLED],
  [RfqStatus.PUBLISHED]: [RfqStatus.CLOSED, RfqStatus.CANCELLED],
  [RfqStatus.CLOSED]: [RfqStatus.AWARDED, RfqStatus.CANCELLED],
  [RfqStatus.AWARDED]: [],
  [RfqStatus.CANCELLED]: [],
};

/**
 * Returns true if transitioning an RFQ from `from` to `to` is permitted.
 */
export function isValidRfqTransition(from: RfqStatus, to: RfqStatus): boolean {
  const allowed = RFQ_STATUS_TRANSITIONS[from];
  return allowed.includes(to);
}
