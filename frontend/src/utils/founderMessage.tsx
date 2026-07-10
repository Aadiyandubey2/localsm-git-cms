import React from 'react';
import type { BusinessDocument } from '../api/cms';

const MISSION_STATEMENT = "LocalSM isn't just a name. It's a mission statement.";
const PILLAR_HEADER_PATTERN = /^\d{2} \/ /;

type FounderMessageContentProps = {
  message: string;
  businesses: BusinessDocument[];
  founderName: string;
  founderTitle: string;
};

const pillarLabels = ['01 / Delivery', '02 / Quick Commerce', '03 / Software'];

export function FounderMessageContent({
  message,
  businesses,
  founderName,
  founderTitle,
}: FounderMessageContentProps) {
  const paragraphs = message.split('\n\n').filter((paragraph) => paragraph.trim().length > 0);
  const elements: React.ReactNode[] = [];
  const pillarDescriptions: string[] = [];
  let pillarInserted = false;
  let collectingPillars = false;

  paragraphs.forEach((paragraph, index) => {
    const trimmed = paragraph.trim();

    if (
      trimmed === 'Sincerely,' ||
      trimmed === founderName ||
      trimmed.startsWith(`${founderTitle},`) ||
      trimmed.startsWith('Founder & CEO,') ||
      trimmed.startsWith('Founder & CEO') ||
      trimmed === `— ${founderName}` ||
      trimmed.startsWith(`— ${founderName}`)
    ) {
      return;
    }

    if (PILLAR_HEADER_PATTERN.test(trimmed) || pillarLabels.some((label) => trimmed.startsWith(label))) {
      collectingPillars = true;
      return;
    }

    if (collectingPillars) {
      if (trimmed.startsWith('Our mission remains unchanged')) {
        collectingPillars = false;
      } else {
        pillarDescriptions.push(trimmed);
        return;
      }
    }

    if (!pillarInserted && pillarDescriptions.length > 0) {
      pillarInserted = true;
      elements.push(
        <div key="pillar-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          {businesses.slice(0, 3).map((business, businessIndex) => (
            <div key={business.title} className="border border-black/10 p-6 bg-black/[0.01]">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-[#0055ff] mb-2">
                {pillarLabels[businessIndex] || `0${businessIndex + 1} / ${business.title}`}
              </h4>
              <p className="text-sm text-black/60 font-light leading-relaxed">
                {pillarDescriptions[businessIndex] || (
                  <>
                    <strong>{business.title}</strong>
                    {business.description ? `, ${business.description.split('.')[0]}.` : '.'}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (trimmed === MISSION_STATEMENT) {
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="border-l-2 border-[#0055ff] pl-6 my-10 py-2 text-2xl md:text-3xl font-light tracking-tight text-black italic"
        >
          “{trimmed}”
        </blockquote>
      );
      return;
    }

    if (index === 0) {
      elements.push(
        <p key={`paragraph-${index}`} className="font-medium text-black">
          {trimmed}
        </p>
      );
      return;
    }

    elements.push(
      <p key={`paragraph-${index}`}>
        {trimmed}
      </p>
    );
  });

  if (!pillarInserted && pillarDescriptions.length > 0) {
    elements.push(
      <div key="pillar-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        {businesses.slice(0, 3).map((business, businessIndex) => (
          <div key={business.title} className="border border-black/10 p-6 bg-black/[0.01]">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[#0055ff] mb-2">
              {pillarLabels[businessIndex] || `0${businessIndex + 1} / ${business.title}`}
            </h4>
            <p className="text-sm text-black/60 font-light leading-relaxed">
              {pillarDescriptions[businessIndex] || (
                <>
                  <strong>{business.title}</strong>
                  {business.description ? `, ${business.description.split('.')[0]}.` : '.'}
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return <>{elements}</>;
}
