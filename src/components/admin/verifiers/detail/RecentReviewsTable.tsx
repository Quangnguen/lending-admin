"use client";

import Link from "next/link";
import { ReviewRecord, decisionColors } from "../types";

interface RecentReviewsTableProps {
  reviews: ReviewRecord[];
  onViewAll?: () => void;
}

const typeColors: Record<ReviewRecord["type"], string> = {
  KYC: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Loan: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Fraud: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Document: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function RecentReviewsTable({ reviews, onViewAll }: RecentReviewsTableProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
        <h3 className="font-semibold text-foreground">Recent Reviews</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-primary hover:text-primary-hover font-medium"
        >
          View All
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Review ID
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">Type</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Applicant
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Decision
            </th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">Date</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-foreground-muted">
              Review Time
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="border-b border-card-border last:border-b-0 hover:bg-background-secondary transition-colors"
            >
              <td className="px-5 py-3">
                <Link href="#" className="text-sm text-primary hover:underline">
                  {review.id}
                </Link>
              </td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeColors[review.type]}`}
                >
                  {review.type}
                </span>
              </td>
              <td className="px-5 py-3 text-sm text-foreground">{review.applicantName}</td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${decisionColors[review.decision]}`}
                >
                  {review.decision}
                </span>
              </td>
              <td className="px-5 py-3 text-sm text-foreground-muted">{review.date}</td>
              <td className="px-5 py-3 text-sm text-foreground-muted">{review.reviewTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
