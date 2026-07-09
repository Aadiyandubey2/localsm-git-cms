import React, { useState, useEffect } from 'react';
import { TrendingUp, FileText, Download, ChevronRight } from 'lucide-react';
import {
  getActiveDocument,
  getCollection,
  type InvestorsPageDocument,
  type BoardMemberDocument,
  type FinancialReportDocument,
  type ShareholdingPatternDocument,
} from '../api/cms';

export default function Investors() {
  const [stockPrice, setStockPrice] = useState(248.50);
  const [priceChange, setPriceChange] = useState(1.85);
  const [priceChangePercent, setPriceChangePercent] = useState(0.75);

  const [investorsPage, setInvestorsPage] = useState<InvestorsPageDocument | null>(null);
  const [boardMembers, setBoardMembers] = useState<BoardMemberDocument[]>([]);
  const [reports, setReports] = useState<FinancialReportDocument[]>([]);
  const [shareholdings, setShareholdings] = useState<ShareholdingPatternDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadInvestorsData = async () => {
      try {
        const [pageDoc, boardList, reportList, shareList] = await Promise.all([
          getActiveDocument<InvestorsPageDocument>('/investors-page'),
          getCollection<BoardMemberDocument>('/board-members'),
          getCollection<FinancialReportDocument>('/financial-reports'),
          getCollection<ShareholdingPatternDocument>('/shareholding-patterns'),
        ]);

        if (!isMounted) return;

        if (pageDoc) setInvestorsPage(pageDoc);
        if (boardList) setBoardMembers(boardList.filter((b) => b.isActive !== false));
        if (reportList) setReports(reportList.filter((r) => r.isActive !== false));
        if (shareList) setShareholdings(shareList.filter((s) => s.isActive !== false));
      } catch (error) {
        console.error('Failed to load investor relations content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInvestorsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const basePrice = investorsPage?.stockBasePrice || 246.65;
  const showStockWidget = investorsPage?.showStockWidget !== false;
  const showStockGraph = investorsPage?.showStockGraph !== false;

  // Simulate slight stock price fluctuation for high-end feel
  useEffect(() => {
    if (isLoading || !basePrice) return;

    setStockPrice(basePrice + 1.85);

    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 0.4; // slight upward bias
      setStockPrice((prev) => {
        const next = prev + delta;
        const change = next - basePrice;
        setPriceChange(change);
        setPriceChangePercent((change / basePrice) * 100);
        return Number(next.toFixed(2));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLoading, basePrice]);

  if (isLoading) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 animate-pulse">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-black/10"></div>
            <div className="h-12 w-3/4 rounded bg-black/10"></div>
            <div className="h-6 w-1/2 rounded bg-black/10"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="h-4 w-36 rounded bg-black/10"></div>
              <div className="h-12 w-48 rounded bg-black/10"></div>
              <div className="h-3 w-64 rounded bg-black/10"></div>
            </div>
            <div className="lg:col-span-7 h-48 bg-black/5 border border-black/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const reportsToRender = reports.length > 0
    ? [...reports].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : [];

  const shareholdingsToRender = shareholdings.length > 0
    ? [...shareholdings].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : [];

  const boardToRender = boardMembers.length > 0
    ? [...boardMembers].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : [];

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-black font-sans pt-32 pb-20 selection:bg-[#0055ff]/10 selection:text-black">
      {/* Hero Section */}
      <section className="px-6 md:px-12 pb-20 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="inline-block border-b border-[#0055ff] pb-1.5">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-black/60">
              Investor Relations
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] max-w-5xl">
            {investorsPage?.heroTitle || 'Long-term value through discipline.'}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-light max-w-3xl leading-relaxed">
            {investorsPage?.heroDescription || `LocalSM Limited (NSE: ${investorsPage?.stockSymbol || 'LOCALS'} / BSE: 544444) is committed to building a sustainable, profitable, and highly resilient hyper-local commerce ecosystem. We prioritize long-term cash flow generation and governance over short-term optimization.`}
          </p>
        </div>
      </section>

      {/* Stock Ticker & Metrics */}
      {showStockWidget && (
        <section className="section-spacing px-6 md:px-12 border-b border-black/10 bg-black/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Ticker Info */}
              <div className={`${showStockGraph ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-6`}>
                <span className="text-xs font-mono text-black/40 uppercase tracking-widest">LIVE NSE STOCK QUOTE</span>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-4">
                    <h2 className="text-5xl md:text-6xl font-light tracking-tight font-mono">
                      ₹{stockPrice.toFixed(2)}
                    </h2>
                    <div className="flex items-center text-green-600 font-mono text-sm font-medium">
                      <TrendingUp size={16} className="mr-1" />
                      +{priceChange.toFixed(2)} (+{priceChangePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <p className="text-xs text-black/40 font-mono">{investorsPage?.stockSymbol || 'LOCALS'} // ISIN: {investorsPage?.stockIsin || 'INE000001010'} // Delayed by 5 mins</p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-black/5">
                  <div>
                    <p className="text-xs text-black/40 font-mono uppercase">Market Cap</p>
                    <p className="text-lg font-medium">{investorsPage?.marketCap || '₹78,450 Cr'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/40 font-mono uppercase">P/E Ratio</p>
                    <p className="text-lg font-medium">{investorsPage?.peRatio || '68.4'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/40 font-mono uppercase">52-Week High</p>
                    <p className="text-lg font-medium">{investorsPage?.fiftyTwoWeekHigh || '₹268.00'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/40 font-mono uppercase">52-Week Low</p>
                    <p className="text-lg font-medium">{investorsPage?.fiftyTwoWeekLow || '₹134.50'}</p>
                  </div>
                </div>
              </div>

              {/* Stock Price Trend SVG Visual */}
              {showStockGraph && (
                <div className="lg:col-span-7">
                  <div className="border border-black/10 p-8 bg-[#f4f4f4] space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-black/40 uppercase tracking-widest">Historical Performance (1 Year)</span>
                      <span className="text-xs font-mono text-green-600">{investorsPage?.ytdPerformance || '+84.5%'} YTD</span>
                    </div>
                    {/* SVG Trendline */}
                    <div className="h-48 w-full bg-black/[0.02] border border-black/5 relative flex items-end">
                      <svg className="w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        <line x1="0" y1="20" x2="100" y2="20" stroke="#000" strokeWidth="0.05" strokeDasharray="1,2" opacity="0.1" />
                        <line x1="0" y1="50" x2="100" y2="50" stroke="#000" strokeWidth="0.05" strokeDasharray="1,2" opacity="0.1" />
                        <line x1="0" y1="80" x2="100" y2="80" stroke="#000" strokeWidth="0.05" strokeDasharray="1,2" opacity="0.1" />
                        {/* Price Line */}
                        <path
                          d="M 0 90 Q 15 85 25 70 T 50 45 T 75 35 T 100 15"
                          fill="none"
                          stroke="#0055ff"
                          strokeWidth="1.5"
                        />
                        {/* Shadow Area */}
                        <path
                          d="M 0 90 Q 15 85 25 70 T 50 45 T 75 35 T 100 15 L 100 100 L 0 100 Z"
                          fill="url(#gradient-blue)"
                          opacity="0.04"
                        />
                        <defs>
                          <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0055ff" />
                            <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute left-4 bottom-4 text-[10px] font-mono text-black/40">{investorsPage?.chartStartDate || 'Feb 2025'}</div>
                      <div className="absolute right-4 bottom-4 text-[10px] font-mono text-black/40">{investorsPage?.chartEndDate || 'Feb 2026'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Financial Results Table */}
      {reportsToRender.length > 0 && (
        <section className="section-spacing px-6 md:px-12 border-b border-black/10">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                Financial Performance
              </h2>
              <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
                Quarterly and annual financial results.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border-y border-black/10">
                <thead>
                  <tr className="border-b border-black/10 text-xs font-mono text-black/40 uppercase tracking-wider">
                    <th className="py-5 px-4 font-normal">Reporting Period</th>
                    <th className="py-5 px-4 font-normal">Revenue</th>
                    <th className="py-5 px-4 font-normal">YoY Growth</th>
                    <th className="py-5 px-4 font-normal">Adjusted EBITDA</th>
                    <th className="py-5 px-4 font-normal text-right">Downloads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {reportsToRender.map((res, idx) => (
                    <tr key={idx} className="text-sm font-light hover:bg-black/[0.01] transition-colors">
                      <td className="py-5 px-4 font-medium">{res.period}</td>
                      <td className="py-5 px-4">{res.revenue}</td>
                      <td className="py-5 px-4 text-green-600">{res.growth}</td>
                      <td className="py-5 px-4">{res.profit}</td>
                      <td className="py-5 px-4 text-right">
                        <button
                          onClick={() => alert(`Downloading report for ${res.period}...`)}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0055ff] hover:underline cursor-pointer focus:outline-none"
                        >
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Shareholding Pattern */}
      {shareholdingsToRender.length > 0 && (
        <section className="section-spacing px-6 md:px-12 border-b border-black/10 bg-black/[0.01]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                Ownership Structure
              </h2>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight leading-tight">
                A highly institutionalized shareholder registry.
              </h3>
              <p className="text-base text-black/60 font-light leading-relaxed">
                We are backed by leading global and domestic institutional investors who share our long-term vision of building sustainable hyper-local infrastructure. Our promoter group remains fully committed, retaining a significant equity stake.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="border border-black/10 p-8 bg-[#f4f4f4] space-y-6">
                <span className="text-xs font-mono text-black/40 uppercase tracking-widest">Shareholding Pattern</span>
                <div className="space-y-4">
                  {shareholdingsToRender.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm font-light">
                        <span>{item.category}</span>
                        <span className="font-mono font-medium">{item.percentage}</span>
                      </div>
                      <div className="h-2 w-full bg-black/5">
                        <div
                          className="h-full bg-[#0055ff]"
                          style={{ width: item.percentage }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Corporate Governance / Board of Directors */}
      {boardToRender.length > 0 && (
        <section className="section-spacing px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-black/40">
                Corporate Governance
              </h2>
              <p className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
                Board of Directors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {boardToRender.map((member, idx) => (
                <div key={idx} className="border-t border-black/10 pt-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium tracking-tight">{member.name}</h3>
                    <p className="text-xs font-mono text-[#0055ff] uppercase tracking-widest">{member.role}</p>
                  </div>
                  <p className="text-sm text-black/60 font-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
