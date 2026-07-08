import React, { useState } from 'react';
import { Search, ChevronDown, Check, ArrowRight } from 'lucide-react';

export default function Careers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedDeptLoc] = useState('All');
  const [appliedJob, setAppliedJob] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', resume: '', coverLetter: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const departments = ['All', 'Engineering', 'Product Management', 'Operations', 'Design', 'Marketing'];
  const locations = ['All', 'Gurugram', 'Bengaluru', 'Mumbai', 'Remote'];

  const jobs = [
    {
      id: 'eng-01',
      title: 'Principal Software Engineer — Quick Commerce Platform',
      dept: 'Engineering',
      loc: 'Bengaluru',
      type: 'Full-time',
      desc: 'Build and scale the hyper-local routing and order matching engines that power Janhal’s 10-minute delivery ecosystem. Experience with high-throughput distributed systems is required.',
    },
    {
      id: 'eng-02',
      title: 'Senior Frontend Engineer — Merchant Suite',
      dept: 'Engineering',
      loc: 'Gurugram',
      type: 'Full-time',
      desc: 'Lead the development of our next-generation Local Branding Software. You will build highly responsive, data-rich dashboards that empower local merchants to manage their digital presence.',
    },
    {
      id: 'prod-01',
      title: 'Director of Product — Hyper-local Logistics',
      dept: 'Product Management',
      loc: 'Gurugram',
      type: 'Full-time',
      desc: 'Own the product vision and roadmap for LocalSM Delivery’s core dispatch, allocation, and delivery partner experience. Drive efficiency gains across our 500,000+ courier fleet.',
    },
    {
      id: 'ops-01',
      title: 'Head of Dark Store Operations',
      dept: 'Operations',
      loc: 'Mumbai',
      type: 'Full-time',
      desc: 'Oversee operational performance, inventory accuracy, and picking efficiency across our network of 150+ Janhal dark stores in the Western region.',
    },
    {
      id: 'des-01',
      title: 'Lead Product Designer — Consumer Experience',
      dept: 'Design',
      loc: 'Bengaluru',
      type: 'Full-time',
      desc: 'Craft intuitive, simple, and delightful consumer ordering journeys for LocalSM Delivery and Janhal. Strong visual design and interaction prototyping skills are essential.',
    },
    {
      id: 'mkt-01',
      title: 'Growth Marketing Lead — Merchant Acquisition',
      dept: 'Marketing',
      loc: 'Remote',
      type: 'Full-time',
      desc: 'Design and execute multi-channel growth campaigns to acquire and onboard local merchants onto our Local Branding Software platform.',
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || job.dept === selectedDept;
    const matchesLoc = selectedLoc === 'All' || job.loc === selectedLoc;
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
            Build things that outlast you.
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-light max-w-3xl leading-relaxed">
            We do not offer jobs; we offer missions. We are looking for builders, thinkers, and operators who thrive under responsibility and want to shape the hyper-local economy of tomorrow.
          </p>
        </div>
      </section>

      {/* Recruitment Principles */}
      <section className="section-spacing px-6 md:px-12 border-b border-black/10 bg-black/[0.01]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
              Our Hiring Philosophy
            </h2>
            <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
              What we look for in every candidate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
              <span className="text-xs font-mono text-[#0055ff]">PRINCIPLE 01 /</span>
              <h3 className="text-xl font-medium tracking-tight">High Agency</h3>
              <p className="text-sm text-black/60 font-light leading-relaxed">
                We value individuals who find a way to get things done despite obstacles, constraints, or lack of resources. If you wait for permission or clear instructions, you will struggle here.
              </p>
            </div>

            <div className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
              <span className="text-xs font-mono text-[#0055ff]">PRINCIPLE 02 /</span>
              <h3 className="text-xl font-medium tracking-tight">Intellectual Curiosity</h3>
              <p className="text-sm text-black/60 font-light leading-relaxed">
                You must have a deep desire to understand how things work from first principles. We want people who ask "why" five times, challenge assumptions, and constantly seek better solutions.
              </p>
            </div>

            <div className="border border-black/10 p-8 space-y-4 bg-[#f4f4f4]">
              <span className="text-xs font-mono text-[#0055ff]">PRINCIPLE 03 /</span>
              <h3 className="text-xl font-medium tracking-tight">Resilience & Grit</h3>
              <p className="text-sm text-black/60 font-light leading-relaxed">
                Building enduring institutions is incredibly hard work. It involves setbacks, failures, and intense pressure. We look for candidates who have demonstrated grit and can bounce back stronger.
              </p>
            </div>
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
                onChange={(e) => setSelectedDeptLoc(e.target.value)}
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

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-black/10 p-8 bg-[#f4f4f4] hover:border-black/30 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono text-[#0055ff] font-semibold tracking-wider uppercase">
                        {job.dept}
                      </span>
                      <span className="text-black/20 text-xs">•</span>
                      <span className="text-xs font-mono text-black/50 tracking-wider uppercase">
                        {job.loc}
                      </span>
                      <span className="text-black/20 text-xs">•</span>
                      <span className="text-xs font-mono text-black/50 tracking-wider uppercase">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-light tracking-tight text-black">
                      {job.title}
                    </h3>
                    <p className="text-sm text-black/60 font-light leading-relaxed">
                      {job.desc}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleApplyClick(job.title)}
                      className="whitespace-nowrap px-6 py-3 border border-black text-xs font-semibold uppercase tracking-wider hover:bg-black hover:text-[#f4f4f4] transition-all duration-300 cursor-pointer focus:outline-none"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-black/10 p-12 text-center text-black/50 font-light">
                No open positions match your selected filters. Try broadening your search.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Apply Modal overlay */}
      {appliedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[#f4f4f4] border border-black/20 w-full max-w-2xl p-8 md:p-10 relative">
            <button
              onClick={() => setAppliedJob(null)}
              className="absolute right-6 top-6 text-black/50 hover:text-black focus:outline-none cursor-pointer"
            >
              ✕
            </button>

            {showSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="h-12 w-12 rounded-full border border-green-600 flex items-center justify-center text-green-600">
                  <Check size={24} />
                </div>
                <h3 className="text-2xl font-light">Application Submitted</h3>
                <p className="text-sm text-black/60 font-light max-w-md">
                  Thank you for applying for the <strong>{appliedJob}</strong> position. Our recruiting team will review your details and get back to you shortly.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#0055ff] uppercase tracking-widest">Job Application</span>
                  <h3 className="text-2xl font-light tracking-tight">{appliedJob}</h3>
                </div>

                <form onSubmit={handleSubmitApply} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-black/50">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={applyForm.name}
                        onChange={handleInputChange}
                        className="w-full bg-[#f4f4f4] border border-black/10 p-3 text-sm font-light focus:outline-none focus:border-[#0055ff]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-black/50">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={applyForm.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#f4f4f4] border border-black/10 p-3 text-sm font-light focus:outline-none focus:border-[#0055ff]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-black/50">Resume Link (PDF / Google Drive)</label>
                    <input
                      type="url"
                      name="resume"
                      required
                      placeholder="https://example.com/resume.pdf"
                      value={applyForm.resume}
                      onChange={handleInputChange}
                      className="w-full bg-[#f4f4f4] border border-black/10 p-3 text-sm font-light focus:outline-none focus:border-[#0055ff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-black/50">Why LocalSM? (Brief Cover Letter)</label>
                    <textarea
                      name="coverLetter"
                      required
                      rows={4}
                      value={applyForm.coverLetter}
                      onChange={handleInputChange}
                      placeholder="Tell us why you are a high-agency builder..."
                      className="w-full bg-[#f4f4f4] border border-black/10 p-3 text-sm font-light focus:outline-none focus:border-[#0055ff] resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-black text-[#f4f4f4] text-xs font-semibold uppercase tracking-wider hover:bg-[#0055ff] transition-all duration-300 disabled:bg-black/40 cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
