import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-slate-400">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 ? <ChevronRight size={14} className="text-slate-600" /> : null}
          {item.href ? (
            <Link to={item.href} className="hover:text-slate-200 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-200">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
