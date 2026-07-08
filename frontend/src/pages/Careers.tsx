import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Check, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getActiveDocument, getCollection, type CareersPageDocument, type JobDocument } from '../api/cms';

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [appliedJob, setAppliedJob] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', resume: '', coverLetter: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [careersPage, setCareersPage] = useState<CareersPageDocument | null>(null);
  const [jobs, setJobs] = useState<JobDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCareersData = async () => {
      try {
        const [pageDoc, jobsList] = await Promise.all([
          getActiveDocument<CareersPageDocument>('/careers-page'),
          getCollection<JobDocument>('/jobs'),
        ]);

        if (!isMounted) return;

        if (pageDoc) setCareersPage(pageDoc);
        if (jobsList) setJobs(jobsList.filter((j) => j.isActive !== false));
      } catch (error) {
        console.error('Failed to load careers content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCareersData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-black/10"></div>
            <div className="h-12 w-3/4 rounded bg-black/10"></div>
            <div className="h-6 w-1/2 rounded bg-black/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
                <div className="h-4 w-28 rounded bg-black/10"></div>
                <div className="h-6 w-20 rounded bg-black/10"></div>
                <div className="h-16 w-full rounded bg-black/10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Derive filter categories dynamically from active jobs
  const departments = ['All', ...Array.from(new Set(jobs.map((job) => job.department)))];
  const locations = ['All', ...Array.from(new Set(jobs.map((job) => job.location)))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesLoc = selectedLoc === 'All' || job.location === selectedLoc;
    return matchesSearch && matchesDept && matchesLoc;
  });

  const handleApplyClick = (jobTitle: string) => {
    setAppliedJob(jobTitle);
    setShowSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setApplyForm({ name: '', email: '', resume: '', coverLetter: '' });
      setTimeout(() => {
        setAppliedJob(null);
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  const principlesToRender = careersPage?.principles?.length
    ? careersPage.principles
    : [
        {
          label: 'High Agency',
          title: 'We value individuals who find a way',
          description: 'We value individuals who find a way to get things done despite obstacles, constraints, or lack of resources. If you wait for permission or clear instructions, you will struggle here.',
        },
        {
          label: 'Intellectual Curiosity',
          title: 'Deep first-principles understanding',
          description: 'You must have a deep desire to understand how things work from first principles. We want people who ask "why" five times, challenge assumptions, and constantly seek better solutions.',
        },
        {
          label: 'Resilience & Grit',
          title: 'Building for the long-term',
          description: 'Building enduring institutions is incredibly hard work. It involves setbacks, failures, and intense pressure. We look for candidates who have demonstrated grit and can bounce back stronger.',
        },
      ];

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
      {/* Hero Section */}
      <section className="px-6 md:px-12 pb-20 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="inline-block border-b border-[#0055ff] pb-1.5">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-black/60">
              Careers at LocalSM
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] max-w-5xl">
            {careersPage?.heroTitle || 'Build things that outlast you.'}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-light max-w-3xl leading-relaxed">
            {careersPage?.heroDescription || 'We do not offer jobs; we offer missions. We are looking for builders, thinkers, and operators who thrive under responsibility and want to shape the hyper-local economy of tomorrow.'}
          </p>
        </div>
      </section>

      {/* Recruitment Principles */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10 bg-black/[0.01]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
              {careersPage?.philosophyTitle || 'Our Hiring Philosophy'}
            </h2>
            <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
              {careersPage?.philosophySubtitle || 'What we look for in every candidate.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principlesToRender.map((p, idx) => (
              <div key={idx} className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
                <span className="text-xs font-mono text-[#0055ff]">PRINCIPLE {String(idx + 1).padStart(2, '0')} //</span>
                <h3 className="text-xl font-medium tracking-tight">{p.label} — {p.title}</h3>
                <p className="text-sm text-black/60 font-light leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Portal Section */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                Open Positions
              </h2>
              <p className="text-3xl md:text-4xl font-light tracking-tight">
                Join one of our core missions.
              </p>
            </div>
            <div className="text-sm text-black/50 font-mono">
              Showing {filteredJobs.length} open roles
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-black/10 pb-8">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={18} />
              <input
                type="text"
                placeholder="Search by role, keyword, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f4f4f4] border border-black/10 py-3.5 pl-12 pr-4 text-sm font-light text-black placeholder-black/40 focus:outline-none focus:border-[#0055ff] transition-colors"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-[#f4f4f4] border border-black/10 py-3.5 px-4 text-sm font-light text-black appearance-none focus:outline-none focus:border-[#0055ff] transition-colors cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    Dept: {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={16} />
            </div>

            {/* Location Filter */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedLoc}
                onChange={(e) => setSelectedLoc(e.target.value)}
                className="w-full bg-[#f4f4f4] border border-black/10 py-3.5 px-4 text-sm font-light text-black appearance-none focus:outline-none focus:border-[#0055ff] transition-colors cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    Location: {loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Directory Listings */}
          <div className="divide-y divide-black/10">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.title} className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start group">
                  <div className="lg:col-span-8 space-y-3">
                    <h3 className="text-xl font-medium tracking-tight group-hover:text-[#0055ff] transition-colors duration-300">
                      {job.title}
                    </h3>
                    <p className="text-sm text-black/60 font-light leading-relaxed max-w-3xl">
                      {job.description}
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-col sm:flex-row sm:items-center lg:justify-end gap-6 pt-2 lg:pt-0">
                    <div className="flex flex-wrap gap-2 text-xs font-mono text-black/40">
                      <span className="px-2.5 py-1 border border-black/5 bg-[#f4f4f4]">
                        {job.department.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 border border-black/5 bg-[#f4f4f4]">
                        {job.location.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 border border-black/5 bg-[#f4f4f4]">
                        {job.type.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <button
                        onClick={() => handleApplyClick(job.title)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0055ff] hover:text-black transition-colors focus:outline-none"
                      >
                        Apply Now <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-black/40 font-light">
                No open positions match your search filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Overlay Modal */}
      {appliedJob && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-black/10 w-full max-w-xl p-8 md:p-10 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAppliedJob(null)}
              className="absolute right-6 top-6 text-black/40 hover:text-black transition-colors focus:outline-none"
            >
              <X size={20} />
            </button>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#0055ff] font-semibold">Application Form</span>
              <h3 className="text-2xl font-light tracking-tight text-black">{appliedJob}</h3>
            </div>

            {showSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 flex items-start gap-3">
                <Check className="text-green-600 shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Application Submitted Successfully!</p>
                  <p className="text-xs text-green-700">Thank you for applying. Our talent team will review your profile and reach out shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApply} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-black/50 uppercase">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={applyForm.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#f4f4f4] border border-black/10 py-3 px-4 text-sm font-light text-black placeholder-black/30 focus:outline-none focus:border-[#0055ff] transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-black/50 uppercase">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={applyForm.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#f4f4f4] border border-black/10 py-3 px-4 text-sm font-light text-black placeholder-black/30 focus:outline-none focus:border-[#0055ff] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-black/50 uppercase">Resume URL</label>
                  <input
                    type="url"
                    name="resume"
                    required
                    value={applyForm.resume}
                    onChange={handleInputChange}
                    className="w-full bg-[#f4f4f4] border border-black/10 py-3 px-4 text-sm font-light text-black placeholder-black/30 focus:outline-none focus:border-[#0055ff] transition-colors"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-black/50 uppercase">Cover Letter / Note</label>
                  <textarea
                    name="coverLetter"
                    rows={4}
                    value={applyForm.coverLetter}
                    onChange={handleInputChange}
                    className="w-full bg-[#f4f4f4] border border-black/10 py-3 px-4 text-sm font-light text-black placeholder-black/30 focus:outline-none focus:border-[#0055ff] transition-colors resize-none"
                    placeholder="Tell us why you are a great fit..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-3.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#0055ff] disabled:bg-black/30 transition-colors duration-300 focus:outline-none"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
