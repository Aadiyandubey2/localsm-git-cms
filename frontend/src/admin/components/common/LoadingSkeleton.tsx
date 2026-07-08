import React from 'react';

type LoadingSkeletonProps = {
  rows?: number;
};

export default function LoadingSkeleton({ rows = 4 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="admin-card space-y-3">
          <div className="h-4 w-32 rounded bg-slate-700" />
          <div className="h-10 w-full rounded bg-slate-800" />
          <div className="h-10 w-2/3 rounded bg-slate-800" />
        </div>
      ))}
    </div>
  );
}
