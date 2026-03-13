export enum VerificationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IVerificationDocument {
  documentType: string;
  url: string;
  uploadedAt: Date;
}

export class VerificationDomainEntity {
  id: string;
  companyId: string;
  tenantId: string;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  status: VerificationStatus;
  documents: IVerificationDocument[];
  notes: string | null;
  rejectionReason: string | null;

  approve(reviewerId: string): void {
    this.status = VerificationStatus.APPROVED;
    this.reviewedAt = new Date();
    this.reviewedBy = reviewerId;
  }

  reject(reviewerId: string, reason: string): void {
    this.status = VerificationStatus.REJECTED;
    this.reviewedAt = new Date();
    this.reviewedBy = reviewerId;
    this.rejectionReason = reason;
  }

  startReview(reviewerId: string): void {
    this.status = VerificationStatus.UNDER_REVIEW;
    this.reviewedBy = reviewerId;
  }
}
