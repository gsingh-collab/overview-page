import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ButtonIconAlign,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  Dropdown,
  Icon,
  IconName,
  IconSize,
  Menu,
  MenuItemType,
  MenuSize,
  MenuVariant,
  Pill,
  PillSize,
  Tab,
  Tabs,
  TabSize,
} from '@eightfold.ai/octuple';

import styles from './NetflixV2OverviewPage.module.css';

/* ── Static data ── */

const manageMenuItems = [
  { type: MenuItemType.button, text: 'Calibrate Position', value: 'calibrate', iconProps: { path: IconName.mdiTuneVariant } },
  { type: MenuItemType.button, text: 'Position details', value: 'details', iconProps: { path: IconName.mdiClipboardOutline } },
  { type: MenuItemType.button, text: 'Add candidates', value: 'add', iconProps: { path: IconName.mdiUpload } },
  { type: MenuItemType.button, text: 'Job description', value: 'jd', iconProps: { path: IconName.mdiFileDocumentOutline } },
  { type: MenuItemType.button, text: 'Job distribution', value: 'dist', iconProps: { path: IconName.mdiShareOutline } },
  { type: MenuItemType.button, text: 'Upload position reference docs', value: 'upload', iconProps: { path: IconName.mdiUpload } },
  { type: MenuItemType.button, text: 'Use Interview guides', value: 'guides', iconProps: { path: IconName.mdiCogOutline } },
  { type: MenuItemType.button, text: 'Setup hiring team', value: 'team', iconProps: { path: IconName.mdiAccountGroupOutline } },
  { type: MenuItemType.button, text: 'Automate workflows', value: 'automate', iconProps: { path: IconName.mdiCog } },
  { type: MenuItemType.button, text: 'Download Report', value: 'download', iconProps: { path: IconName.mdiDownload } },
];

const timelineRows = [
  { label: 'Days open', value: '12', extra: 'Mar 20, 2026' },
  { label: 'Target fill', value: '25 days', extra: 'Due Apr 14, 2026' },
  { label: 'Projected fill', value: '40 days', extra: 'At current velocity', alert: true },
];

const healthItems: Array<{
  trend: 'up' | 'down' | 'warn';
  label: string;
  value: string;
  unit: string;
  sub?: string;
  suggestion?: string;
}> = [
  {
    trend: 'down',
    label: 'Sourcing health',
    value: '14',
    unit: 'applicants/week',
    sub: 'down from 22 last week',
    suggestion: 'Source 20 more candidates',
  },
  {
    trend: 'up',
    label: 'Active candidates',
    value: '25',
    unit: 'Onsite interviews',
    sub: 'across all stages',
  },
  {
    trend: 'down',
    label: 'Interview Rejection',
    value: '8/12',
    unit: 'interviews',
    sub: "for 'system design' gap",
  },
  {
    trend: 'warn',
    label: 'Offer',
    value: '2',
    unit: 'pending acceptance',
  },
];

const pipelineRows = [
  {
    key: 'new',
    tone: 'green' as const,
    count: '8',
    title: 'New Applicants',
    pill: { text: '4 high-match', tone: 'green' as const },
    desc: '9 above 4.0 match score · 5 from top schools · 5 from top companies',
    action: 'Review applicants',
  },
  {
    key: 'fb',
    tone: 'red' as const,
    count: '3',
    title: 'Feedback Pending',
    pill: { text: '1 urgent', tone: 'red' as const },
    desc: 'Vikram Patel 6d overdue · Rohan Mehra 4d · Divya Nair 2d — decisions blocked',
    action: 'Send reminders',
  },
  {
    key: 'stuck',
    tone: 'amber' as const,
    count: '4',
    title: 'Stuck Candidates',
    pill: { text: 'SLA breached', tone: 'red' as const },
    desc: 'Ananya Iyer 7d in HM Screen · Mihir Shah 5d in AI Screen — drop-off risk',
    action: 'Advance stages',
  },
  {
    key: 'up',
    tone: 'blue' as const,
    count: '3',
    title: 'Upcoming Interviews',
    pill: { text: '1 tomorrow', tone: 'amber' as const },
    desc: 'Kavya Reddy → Prabhat Sharma tomorrow 3 PM · Arjun Menon → CFO Thu 11 AM',
    action: 'View candidates',
  },
];

const funnelStages = [
  {
    name: 'Application Review',
    active: 12,
    total: 328,
    change: -3,
    lastWeek: 14,
    breakdown: [
      { label: 'Total', value: 328, color: 'dark' as const },
      { label: 'Passed', value: 153, color: 'green' as const },
      { label: 'Skipped', value: 14, color: 'dark' as const },
      { label: 'Rej. by Org', value: 138, color: 'red' as const },
      { label: 'Rej. by Cand.', value: 0, color: 'red' as const },
      { label: 'Rej. Other', value: 17, color: 'red' as const },
    ],
  },
  {
    name: 'Initial Screen',
    active: 5,
    total: 148,
    change: 8,
    lastWeek: 4,
    breakdown: [
      { label: 'Total', value: 148, color: 'dark' as const },
      { label: 'Passed', value: 70, color: 'green' as const },
      { label: 'Skipped', value: 5, color: 'dark' as const },
      { label: 'Rej. by Org', value: 54, color: 'red' as const },
      { label: 'Rej. by Cand.', value: 12, color: 'red' as const },
      { label: 'Rej. Other', value: 7, color: 'red' as const },
    ],
  },
  {
    name: 'First Round',
    active: 3,
    total: 67,
    change: 5,
    lastWeek: 2,
    breakdown: [
      { label: 'Total', value: 67, color: 'dark' as const },
      { label: 'Passed', value: 33, color: 'green' as const },
      { label: 'Skipped', value: 2, color: 'dark' as const },
      { label: 'Rej. by Org', value: 21, color: 'red' as const },
      { label: 'Rej. by Cand.', value: 7, color: 'red' as const },
      { label: 'Rej. Other', value: 4, color: 'red' as const },
    ],
  },
  {
    name: 'Second Round',
    active: 2,
    total: 31,
    change: -2,
    lastWeek: 3,
    breakdown: [
      { label: 'Total', value: 31, color: 'dark' as const },
      { label: 'Passed', value: 13, color: 'green' as const },
      { label: 'Skipped', value: 1, color: 'dark' as const },
      { label: 'Rej. by Org', value: 11, color: 'red' as const },
      { label: 'Rej. by Cand.', value: 4, color: 'red' as const },
      { label: 'Rej. Other', value: 2, color: 'red' as const },
    ],
  },
  {
    name: 'Offer',
    active: 1,
    total: 12,
    change: 12,
    lastWeek: 0,
    breakdown: [
      { label: 'Total', value: 12, color: 'dark' as const },
      { label: 'Passed', value: 7, color: 'green' as const },
      { label: 'Skipped', value: 0, color: 'dark' as const },
      { label: 'Rej. by Org', value: 3, color: 'red' as const },
      { label: 'Rej. by Cand.', value: 2, color: 'red' as const },
      { label: 'Rej. Other', value: 0, color: 'red' as const },
    ],
  },
  {
    name: 'Hired',
    active: 0,
    total: 7,
    change: 0,
    lastWeek: 0,
    breakdown: [
      { label: 'Total', value: 7, color: 'dark' as const },
      { label: 'Passed', value: 7, color: 'green' as const },
      { label: 'Skipped', value: 0, color: 'dark' as const },
      { label: 'Rej. by Org', value: 0, color: 'red' as const },
      { label: 'Rej. by Cand.', value: 0, color: 'red' as const },
      { label: 'Rej. Other', value: 0, color: 'red' as const },
    ],
  },
];

const sourcing = [
  { name: 'LinkedIn', pct: 38, stars: 18, color: '#3b82f6', subs: 148, interview: 32 },
  { name: 'External Career Site', pct: 24, stars: 9, color: '#a5b4fc', subs: 105, interview: 28 },
  { name: 'Internal Career Site', pct: 17, stars: 14, color: '#34d399', subs: 78, interview: 35 },
  { name: 'Agencies', pct: 12, stars: 6, color: '#fdba74', subs: 62, interview: 22 },
  { name: 'Referrals', pct: 9, stars: 11, color: '#f472b6', subs: 45, interview: 41 },
];

/* ── Side panel data ── */

type PanelKey = 'fb' | 'stuck' | 'up';

const panelMeta: Record<PanelKey, { title: string; subtitle: string }> = {
  fb: { title: 'Feedback Pending', subtitle: '3 candidates awaiting interviewer feedback — decisions blocked' },
  stuck: { title: 'Stuck Candidates', subtitle: '2 candidates with SLA breaches — drop-off risk' },
  up: { title: 'Upcoming Interviews', subtitle: '3 interviews this week — prep & logistics' },
};

const feedbackCandidates = [
  {
    id: 'vp', name: 'Vikram Patel', initials: 'VP', role: 'Senior Product Manager',
    bg: '#dbeafe', color: '#1d4ed8', overdue: 6, stage: 'HM Screen',
    interviewer: 'Prabhat Sharma', round: 'System Design',
    matchScore: '4.2', source: 'LinkedIn',
  },
  {
    id: 'rm', name: 'Rohan Mehra', initials: 'RM', role: 'Product Manager',
    bg: '#fef3c7', color: '#92400e', overdue: 4, stage: 'First Round',
    interviewer: 'Anika Gupta', round: 'Technical',
    matchScore: '3.8', source: 'Referral',
  },
  {
    id: 'dn', name: 'Divya Nair', initials: 'DN', role: 'Associate PM',
    bg: '#d1fae5', color: '#065f46', overdue: 2, stage: 'Initial Screen',
    interviewer: 'Rajesh Kumar', round: 'Phone Screen',
    matchScore: '4.5', source: 'Career Site',
  },
];

const stuckCandidates = [
  {
    id: 'ai', name: 'Ananya Iyer', initials: 'AI', role: 'Senior Product Manager',
    bg: '#fce7f3', color: '#9d174d', days: 7, stage: 'HM Screen', sla: 5,
    blocker: 'HM Prabhat Sharma OOO until Wednesday',
    risk: 'high' as const, matchScore: '4.6', source: 'LinkedIn',
  },
  {
    id: 'ms', name: 'Mihir Shah', initials: 'MS', role: 'Product Manager',
    bg: '#e0e7ff', color: '#3730a3', days: 5, stage: 'AI Screen', sla: 3,
    blocker: "Candidate hasn't completed coding assessment",
    risk: 'medium' as const, matchScore: '3.9', source: 'Agency',
  },
];

const interviewCandidates = [
  {
    id: 'kr', name: 'Kavya Reddy', initials: 'KR', role: 'Senior Product Manager',
    bg: '#dbeafe', color: '#1d4ed8', date: 'Tomorrow', time: '3:00 PM',
    interviewer: 'Prabhat Sharma', round: 'System Design',
    prep: 80, matchScore: '4.3', source: 'LinkedIn', scheduled: true,
  },
  {
    id: 'am', name: 'Arjun Menon', initials: 'AM', role: 'Senior Product Manager',
    bg: '#fef3c7', color: '#92400e', date: 'Thursday', time: '11:00 AM',
    interviewer: 'CFO — Deepak Rajam', round: 'Final Round',
    prep: 60, matchScore: '4.1', source: 'Internal', scheduled: true,
  },
  {
    id: 'pd', name: 'Priya Deshmukh', initials: 'PD', role: 'Product Manager',
    bg: '#d1fae5', color: '#065f46', date: 'Friday', time: '2:00 PM',
    interviewer: 'Anika Gupta', round: 'Technical Screen',
    prep: 45, matchScore: '3.7', source: 'Career Site', scheduled: true,
  },
  {
    id: 'sj', name: 'Sneha Joshi', initials: 'SJ', role: 'Senior Product Manager',
    bg: '#fce7f3', color: '#9d174d', date: '', time: '',
    interviewer: 'Prabhat Sharma', round: 'HM Screen',
    prep: 0, matchScore: '4.4', source: 'Referral', scheduled: false,
  },
];

const panelKeySet = new Set<string>(['fb', 'stuck', 'up']);

/* ── Hover data ── */

const activeHoverData = [
  { items: [{ l: 'In Review', c: 5 }, { l: 'Awaiting Feedback', c: 4 }, { l: 'Newly Added', c: 3 }], avg: '3.2 days' },
  { items: [{ l: 'Scheduled', c: 2 }, { l: 'Awaiting Feedback', c: 2 }, { l: 'In Progress', c: 1 }], avg: '4.1 days' },
  { items: [{ l: 'Interview Prep', c: 1 }, { l: 'Scheduled', c: 1 }, { l: 'In Progress', c: 1 }], avg: '5.8 days' },
  { items: [{ l: 'Scheduled', c: 1 }, { l: 'Pending Decision', c: 1 }], avg: '6.2 days' },
  { items: [{ l: 'Offer Drafted', c: 1 }], avg: '3.5 days' },
  { items: [], avg: '' },
];

const completedHoverData = [
  { passed: 153, rejected: 155, skipped: 14, avg: '5.2 days' },
  { passed: 70, rejected: 73, skipped: 5, avg: '6.8 days' },
  { passed: 33, rejected: 32, skipped: 2, avg: '8.1 days' },
  { passed: 13, rejected: 17, skipped: 1, avg: '7.4 days' },
  { passed: 7, rejected: 5, skipped: 0, avg: '4.2 days' },
  { passed: 7, rejected: 0, skipped: 0, avg: '' },
];

const subRowHover: Record<string, { l: string; c: number }[][]> = {
  skip: [
    [{ l: 'Auto-skipped (duplicate)', c: 8 }, { l: 'Manager override', c: 6 }],
    [{ l: 'Duplicate', c: 3 }, { l: 'Already in pipeline', c: 2 }],
    [{ l: 'Schedule conflict', c: 2 }],
    [{ l: 'Duplicate', c: 1 }],
    [], [],
  ],
  pass: [
    [{ l: 'Auto-advanced (high match)', c: 98 }, { l: 'Manual review', c: 55 }],
    [{ l: 'Interviewer approved', c: 42 }, { l: 'Auto-advanced', c: 28 }],
    [{ l: 'Panel approved', c: 20 }, { l: 'Fast-tracked', c: 13 }],
    [{ l: 'Committee approved', c: 8 }, { l: 'HM approved', c: 5 }],
    [{ l: 'Offer accepted', c: 7 }],
    [],
  ],
  org: [
    [{ l: 'Experience mismatch', c: 55 }, { l: 'System Design gap', c: 45 }, { l: 'Cultural fit concern', c: 38 }],
    [{ l: 'Technical skills', c: 22 }, { l: 'Communication', c: 18 }, { l: 'Domain knowledge', c: 14 }],
    [{ l: 'System Design', c: 9 }, { l: 'Coding proficiency', c: 7 }, { l: 'Problem solving', c: 5 }],
    [{ l: 'Leadership fit', c: 5 }, { l: 'Strategic thinking', c: 4 }, { l: 'Technical depth', c: 2 }],
    [{ l: 'Compensation mismatch', c: 2 }, { l: 'Role alignment', c: 1 }],
    [],
  ],
  cand: [
    [],
    [{ l: 'Better offer', c: 6 }, { l: 'Location preference', c: 4 }, { l: 'Role mismatch', c: 2 }],
    [{ l: 'Compensation', c: 3 }, { l: 'Timeline too long', c: 2 }, { l: 'Other opportunity', c: 2 }],
    [{ l: 'Counter offer', c: 2 }, { l: 'Personal reasons', c: 2 }],
    [{ l: 'Better offer', c: 1 }, { l: 'Relocation', c: 1 }],
    [],
  ],
  oth: [
    [{ l: 'Duplicate application', c: 8 }, { l: 'Incomplete profile', c: 5 }, { l: 'Visa issues', c: 4 }],
    [{ l: 'No-show', c: 4 }, { l: 'Unresponsive', c: 3 }],
    [{ l: 'No-show', c: 2 }, { l: 'Schedule conflict', c: 2 }],
    [{ l: 'Unresponsive', c: 1 }, { l: 'Background check', c: 1 }],
    [], [],
  ],
};

/* ── Helpers ── */

function PipelineToneClass(t: (typeof pipelineRows)[0]['tone']) {
  if (t === 'green') return styles.pcGreen;
  if (t === 'red') return styles.pcRed;
  if (t === 'amber') return styles.pcAmber;
  return styles.pcBlue;
}

function MiniPillClass(t: 'green' | 'red' | 'amber') {
  if (t === 'green') return `${styles.miniPill} ${styles.miniPillGreen}`;
  if (t === 'red') return `${styles.miniPill} ${styles.miniPillRed}`;
  return `${styles.miniPill} ${styles.miniPillAmber}`;
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cpx = (x0 + x1) / 2;
    d += ` C ${cpx},${y0} ${cpx},${y1} ${x1},${y1}`;
  }
  return d;
}

function HealthTrendIcon({ trend }: { trend: 'up' | 'down' | 'warn' }) {
  if (trend === 'up')
    return (
      <span className={`${styles.trendBadge} ${styles.trendBadgeGreen}`}>
        <Icon path={IconName.mdiTrendingUp} size={IconSize.Small} color="#3D8F79" />
      </span>
    );
  if (trend === 'down')
    return (
      <span className={`${styles.trendBadge} ${styles.trendBadgeRed}`}>
        <Icon path={IconName.mdiTrendingDown} size={IconSize.Small} color="#C15151" />
      </span>
    );
  return (
    <span className={`${styles.trendBadge} ${styles.trendBadgeAmber}`}>
      <Icon path={IconName.mdiClockOutline} size={IconSize.Small} color="#9d6309" />
    </span>
  );
}

const SPARKLE_PATH = 'M19,1L17.74,3.75L15,5L17.74,6.26L19,9L20.25,6.26L23,5L20.25,3.75M9,4L6.5,9.5L1,12L6.5,14.5L9,20L11.5,14.5L17,12L11.5,9.5M19,15L17.74,17.74L15,19L17.74,20.25L19,23L20.25,20.25L23,19L20.25,17.74';

function GradientSparkle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="url(#sparkleGrad)" d={SPARKLE_PATH} />
    </svg>
  );
}

const stageHeaders = [
  'Application Review',
  'Initial Screen',
  'First Round',
  'Second Round',
  'Offer',
  'Hired',
] as const;

/* ── Component ── */

export function NetflixV2OverviewPage() {
  const [tab, setTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'table' | 'funnel'>('funnel');
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [hoveredSource, setHoveredSource] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [hoveredPct, setHoveredPct] = useState<number | null>(null);

  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [dismissedActions, setDismissedActions] = useState<Set<string>>(new Set());

  const openPanel = useCallback((key: PanelKey) => {
    setActivePanel(key);
    setDismissedActions(new Set());
  }, []);
  const closePanel = useCallback(() => setActivePanel(null), []);

  const addToast = useCallback((msg: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const handleAction = useCallback(
    (actionId: string, msg: string) => {
      setDismissedActions((prev) => new Set(prev).add(actionId));
      addToast(msg);
    },
    [addToast]
  );

  useEffect(() => {
    if (!activePanel) return;
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [activePanel]);

  /* ── Donut chart ── */

  const donutR = 62;
  const donutStroke = 18;
  const donutCirc = 2 * Math.PI * donutR;

  const donutArcs = useMemo(() => {
    let offset = 0;
    return sourcing.map((s) => {
      const len = (s.pct / 100) * donutCirc;
      const arc = { dasharray: `${len} ${donutCirc - len}`, dashoffset: -offset, color: s.color };
      offset += len;
      return arc;
    });
  }, [donutCirc]);

  /* ── Conversion table data ── */

  const conversionRows = useMemo(
    () => [
      {
        k: 'all',
        label: 'All Candidates',
        sub: false,
        stages: [
          { active: '12', total: '328', pct: '47%' },
          { active: '5', total: '148', pct: '47%' },
          { active: '3', total: '67', pct: '49%' },
          { active: '2', total: '31', pct: '42%' },
          { active: '1', total: '12', pct: '58%' },
          { active: '0', total: '7' },
        ],
      },
      {
        k: 'skip',
        label: 'Skipped',
        sub: true,
        tone: 'green' as const,
        stages: [
          { val: '14' }, { val: '5' }, { val: '2' },
          { val: '1' }, { val: '0' }, { val: '' },
        ],
      },
      {
        k: 'pass',
        label: 'Passed Through',
        sub: true,
        tone: 'green' as const,
        stages: [
          { val: '153' }, { val: '70' }, { val: '33' },
          { val: '13' }, { val: '7' }, { val: '' },
        ],
      },
      {
        k: 'org',
        label: 'Rejected by Org',
        sub: true,
        tone: 'red' as const,
        stages: [
          { val: '138' }, { val: '54' }, { val: '21' },
          { val: '11' }, { val: '3' }, { val: '' },
        ],
      },
      {
        k: 'cand',
        label: 'Rejected by Candidate',
        sub: true,
        tone: 'red' as const,
        stages: [
          { val: '0' }, { val: '12' }, { val: '7' },
          { val: '4' }, { val: '2' }, { val: '' },
        ],
      },
      {
        k: 'oth',
        label: 'Rejected - Other',
        sub: true,
        tone: 'red' as const,
        stages: [
          { val: '17' }, { val: '7' }, { val: '4' },
          { val: '2' }, { val: '0' }, { val: '' },
        ],
      },
    ],
    []
  );

  const chartPaths = useMemo(() => {
    const maxVal = Math.max(...funnelStages.map((s) => s.total));
    const w = 1000;
    const h = 200;
    const pad = 10;
    const pts: [number, number][] = funnelStages.map((s, i) => [
      (i / (funnelStages.length - 1)) * w,
      pad + (h - pad) * (1 - s.total / maxVal),
    ]);
    const line = smoothPath(pts);
    const area = `${line} L ${w},${h} L 0,${h} Z`;
    return { line, area, w, h };
  }, []);

  const manageOverlay = (
    <Menu
      items={manageMenuItems}
      size={MenuSize.small}
      variant={MenuVariant.neutral}
      onChange={() => undefined}
    />
  );

  /* ── Extracted sections ── */

  const sourcingSection = (
    <>
      <p className={styles.cardHeaderTitle}>Sourcing Breakdown</p>
      <p className={styles.cardSubtitle}>822 total · all time</p>
      <div className={styles.sourcingBody}>
        <div className={styles.donutWrap} onMouseLeave={() => setHoveredSource(null)}>
          <svg viewBox="0 0 150 150" className={styles.donutSvg}>
            {donutArcs.map((arc, i) => (
              <g key={sourcing[i].name}>
                <circle
                  cx="75"
                  cy="75"
                  r={donutR}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={donutStroke + 8}
                  strokeDasharray={arc.dasharray}
                  strokeDashoffset={arc.dashoffset}
                  strokeLinecap="butt"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredSource(i)}
                />
                <circle
                  cx="75"
                  cy="75"
                  r={donutR}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={hoveredSource === i ? donutStroke + 4 : donutStroke}
                  strokeDasharray={arc.dasharray}
                  strokeDashoffset={arc.dashoffset}
                  strokeLinecap="butt"
                  className={`${styles.donutArc} ${hoveredSource === i ? styles.donutArcActive : ''}`}
                  pointerEvents="none"
                />
              </g>
            ))}
          </svg>
          <div className={styles.donutCenter}>
            <p className={styles.donutValue}>
              {hoveredSource !== null ? `${sourcing[hoveredSource].pct}%` : '822'}
            </p>
            <p className={styles.donutCap}>
              {hoveredSource !== null ? sourcing[hoveredSource].name : 'candidates'}
            </p>
          </div>
          {hoveredSource !== null && (
            <div className={styles.donutStats}>
              <div className={styles.donutStat}>
                <p className={styles.donutStatVal}>{sourcing[hoveredSource].subs}</p>
                <p className={styles.donutStatLbl}>Submissions</p>
              </div>
              <div className={styles.donutStat}>
                <p className={styles.donutStatVal}>{sourcing[hoveredSource].interview}%</p>
                <p className={styles.donutStatLbl}>Interview</p>
              </div>
            </div>
          )}
        </div>
        <div className={styles.sourceList}>
          {sourcing.map((s, i) => (
            <div
              key={s.name}
              className={`${styles.sourceRow} ${hoveredSource === i ? styles.sourceRowActive : ''}`}
              onMouseEnter={() => setHoveredSource(i)}
              onMouseLeave={() => setHoveredSource(null)}
            >
              <div className={styles.sourceRowTop}>
                <div className={styles.sourceName}>
                  <span className={styles.dot} style={{ background: s.color }} />
                  {s.name}
                </div>
                <div className={styles.pctCell}>{s.pct}%</div>
                <div className={styles.stars}>★{s.stars}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const pipelineSection = (
    <section>
      <div className={styles.taskHeader}>
        <h2 className={styles.taskTitle}>Today&apos;s task</h2>
      </div>
      <div className={styles.taskList}>
        {/* Calibrate position card */}
        <div className={styles.calibrateCard}>
          <div className={styles.calibrateInner}>
            <div className={styles.calibrateBadge}>
              <span className={styles.calibratePct}>70</span>
              <span className={styles.calibratePctSign}>%</span>
            </div>
            <div className={styles.calibrateContent}>
              <p className={styles.calibrateTitle}>Calibrate position</p>
              <p className={styles.calibrateSub}>Start with calibrating position</p>
              <div className={styles.aiSuggestion}>
                <GradientSparkle />
                <span>Add skills Product Strategy, Stakeholder Management to get more candidates</span>
              </div>
            </div>
            <div className={styles.calibrateAction}>
              <Button
                text="Calibrate"
                variant={ButtonVariant.Neutral}
                size={ButtonSize.Small}
                shape={ButtonShape.Pill}
                alignIcon={ButtonIconAlign.Right}
                iconProps={{ path: IconName.mdiChevronRight }}
                onClick={() => addToast('Opening Calibrate Position page...')}
              />
            </div>
          </div>
        </div>

        <div className={styles.taskDivider} />

        {/* Pipeline task rows */}
        {pipelineRows.map((row) => {
          const hasPanel = panelKeySet.has(row.key);
          const handleRowClick = () => {
            if (hasPanel) openPanel(row.key as PanelKey);
            else if (row.key === 'new') addToast('Opening New Applicants tab...');
          };
          return (
            <div
              key={row.key}
              className={`${styles.pipelineCard} ${styles.pipelineCardClickable}`}
              onClick={handleRowClick}
            >
              <div className={styles.pipelineCardInner}>
                <div className={`${styles.pipelineCount} ${PipelineToneClass(row.tone)}`}>
                  {row.count}
                </div>
                <div className={styles.pipelineMain}>
                  <div className={styles.pipelineTitleRow}>
                    <p className={styles.pipelineTitle}>{row.title}</p>
                    <span className={MiniPillClass(row.pill.tone)}>{row.pill.text}</span>
                  </div>
                  <p className={styles.pipelineDesc}>{row.desc}</p>
                </div>
                <div className={styles.pipelineAction}>
                  <Button
                    text={row.action}
                    variant={ButtonVariant.Neutral}
                    size={ButtonSize.Small}
                    shape={ButtonShape.Pill}
                    alignIcon={ButtonIconAlign.Right}
                    iconProps={{ path: IconName.mdiChevronRight }}
                    onClick={(e) => { e.stopPropagation(); handleRowClick(); }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  const convSection = (
    <div className={styles.convCard}>
      <div className={styles.convHeader}>
        <div className={styles.convTitle}>
          <h2>{viewMode === 'table' ? 'Pipeline Conversion Breakdown' : 'Pipeline Conversion Breakdown'}</h2>
          <Icon path={IconName.mdiInformationOutline} size={IconSize.Medium} color="#717182" />
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'funnel' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('funnel')}
          >
            <Icon path={IconName.mdiChartLine} size={IconSize.Small} />
            <span>Funnel view</span>
          </button>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'table' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('table')}
          >
            <Icon path={IconName.mdiFormatListBulletedSquare} size={IconSize.Small} />
            <span>Table view</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.colLabel}>
                  <span className={styles.cellMuted}>
                    Active candidates on left, completed on right
                  </span>
                </th>
                {stageHeaders.map((h, i) => (
                  <>
                    <th key={h} className={styles.colStage} colSpan={2}>{h}</th>
                    {i < stageHeaders.length - 1 && (
                      <th key={`pct-${i}`} className={styles.colPct} />
                    )}
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {conversionRows.map((row) => {
                if (row.k === 'all') {
                  return (
                    <tr key={row.k}>
                      <td className={styles.tdLabel}>{row.label}</td>
                      {row.stages.map((s, i) => (
                        <>
                          <td
                            key={`a-${i}`}
                            className={`${styles.colActive} ${styles.cellHoverable}`}
                            onMouseEnter={() => setHoveredCell(`all:${i}:a`)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            {'active' in s ? s.active : ''}
                            {hoveredCell === `all:${i}:a` && activeHoverData[i]?.items.length > 0 && (
                              <div className={styles.cellTooltip}>
                                <p className={styles.ctTitle}>Active · {stageHeaders[i]}</p>
                                {activeHoverData[i].items.map((it) => (
                                  <div key={it.l} className={styles.ctRow}>
                                    <span>{it.l}</span>
                                    <span className={styles.ctCount}>{it.c}</span>
                                  </div>
                                ))}
                                <p className={styles.ctFooter}>{activeHoverData[i].avg} avg in stage</p>
                              </div>
                            )}
                          </td>
                          <td
                            key={`t-${i}`}
                            className={`${styles.colTotal} ${styles.cellHoverable}`}
                            onMouseEnter={() => setHoveredCell(`all:${i}:t`)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            {'total' in s ? (
                              <span className={styles.cellBold}>{s.total}</span>
                            ) : ''}
                            {hoveredCell === `all:${i}:t` && completedHoverData[i] && (
                              <div className={styles.cellTooltip}>
                                <p className={styles.ctTitle}>Completed · {stageHeaders[i]}</p>
                                <div className={styles.ratioBar}>
                                  <div className={styles.ratioGreen} style={{ flex: completedHoverData[i].passed }} />
                                  <div className={styles.ratioRed} style={{ flex: completedHoverData[i].rejected }} />
                                  {completedHoverData[i].skipped > 0 && (
                                    <div className={styles.ratioGray} style={{ flex: completedHoverData[i].skipped }} />
                                  )}
                                </div>
                                <div className={styles.ctRow}>
                                  <span><span className={`${styles.ctDot} ${styles.ctDotGreen}`} />Passed</span>
                                  <span className={styles.ctCount}>{completedHoverData[i].passed}</span>
                                </div>
                                <div className={styles.ctRow}>
                                  <span><span className={`${styles.ctDot} ${styles.ctDotRed}`} />Rejected</span>
                                  <span className={styles.ctCount}>{completedHoverData[i].rejected}</span>
                                </div>
                                {completedHoverData[i].skipped > 0 && (
                                  <div className={styles.ctRow}>
                                    <span><span className={`${styles.ctDot} ${styles.ctDotGray}`} />Skipped</span>
                                    <span className={styles.ctCount}>{completedHoverData[i].skipped}</span>
                                  </div>
                                )}
                                {completedHoverData[i].avg && (
                                  <p className={styles.ctFooter}>{completedHoverData[i].avg} avg to complete</p>
                                )}
                              </div>
                            )}
                          </td>
                          {i < row.stages.length - 1 && (
                            <td
                              key={`p-${i}`}
                              className={`${styles.colPct} ${styles.colPctHoverable}`}
                              onMouseEnter={() => setHoveredPct(i)}
                              onMouseLeave={() => setHoveredPct(null)}
                            >
                              {'pct' in s && s.pct ? (
                                <>
                                  <div className={styles.pctBadge}>
                                    <span>{s.pct}</span>
                                    <span className={styles.pctArrow}>→</span>
                                  </div>
                                  {hoveredPct === i && (
                                    <div className={styles.pctTooltip}>
                                      <p className={styles.pctTooltipTitle}>Pass-through Rate</p>
                                      <p className={styles.pctTooltipFormula}>
                                        (Active + Completed in next stage) ÷ Completed in current stage
                                      </p>
                                      <p className={styles.pctTooltipCalc}>
                                        {(() => {
                                          const next = row.stages[i + 1];
                                          const nextA = next && 'active' in next ? next.active : '0';
                                          const nextT = next && 'total' in next ? next.total : '0';
                                          const curT = 'total' in s ? s.total : '0';
                                          return `(${nextA} + ${nextT}) ÷ ${curT} = ${s.pct}`;
                                        })()}
                                      </p>
                                    </div>
                                  )}
                                </>
                              ) : null}
                            </td>
                          )}
                        </>
                      ))}
                    </tr>
                  );
                }
                const tone = 'tone' in row ? row.tone : undefined;
                const toneClass = tone === 'green' ? styles.subGreen : tone === 'red' ? styles.subRed : undefined;
                const reasons = subRowHover[row.k];
                return (
                  <tr key={row.k}>
                    <td className={styles.tdLabelSub}>{row.label}</td>
                    {row.stages.map((s, i) => {
                      const cellKey = `${row.k}:${i}`;
                      const items = reasons?.[i] ?? [];
                      const val = 'val' in s ? s.val : '';
                      return (
                        <>
                          <td
                            key={`v-${i}`}
                            className={`${styles.colActive} ${val && items.length ? styles.cellHoverable : ''}`}
                            colSpan={2}
                            onMouseEnter={items.length ? () => setHoveredCell(cellKey) : undefined}
                            onMouseLeave={items.length ? () => setHoveredCell(null) : undefined}
                          >
                            <span className={val ? toneClass : styles.cellDash}>{val || '—'}</span>
                            {hoveredCell === cellKey && items.length > 0 && (
                              <div className={styles.cellTooltip}>
                                <p className={styles.ctTitle}>
                                  {tone === 'red' ? 'Top reasons' : 'Breakdown'} · {stageHeaders[i]}
                                </p>
                                <div className={styles.ctPills}>
                                  {items.map((it) => (
                                    <span
                                      key={it.l}
                                      className={`${styles.ctPill} ${tone === 'red' ? styles.ctPillRed : styles.ctPillGreen}`}
                                    >
                                      {it.l} <strong>{it.c}</strong>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                          {i < row.stages.length - 1 && (
                            <td key={`e-${i}`} className={styles.colPct} />
                          )}
                        </>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.funnelView}>
          <p className={styles.funnelSubtitle}>Hover each stage for detailed metrics</p>
          <div className={styles.funnelGrid}>
            <div className={styles.chartLayer}>
              <svg
                viewBox={`0 0 ${chartPaths.w} ${chartPaths.h}`}
                preserveAspectRatio="none"
                className={styles.areaSvg}
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d={chartPaths.area} fill="url(#areaGrad)" />
                <path
                  d={chartPaths.line}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            {funnelStages.map((stage, i) => (
              <div
                key={stage.name}
                className={`${styles.funnelCol} ${hoveredStage === i ? styles.funnelColActive : ''}`}
                onMouseEnter={() => setHoveredStage(i)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <div className={styles.funnelColHeader}>
                  <p className={styles.funnelStageName}>{stage.name}</p>
                  <div className={styles.funnelValueRow}>
                    <span className={styles.funnelCount}>{stage.active}</span>
                    {stage.change !== 0 && (
                      <span className={stage.change > 0 ? styles.changeUp : styles.changeDown}>
                        {stage.change > 0 ? '↑' : '↓'}
                        {Math.abs(stage.change)}%
                      </span>
                    )}
                  </div>
                  <p className={styles.funnelVs}>vs {stage.lastWeek} last week</p>
                </div>
                <div className={styles.funnelColChart} />
                {hoveredStage === i && hoveredPct === null && (
                  <div className={styles.tooltip}>
                    <p className={styles.tooltipTitle}>{stage.name}</p>
                    {stage.breakdown.map((b) => (
                      <div key={b.label} className={styles.tooltipRow}>
                        <span className={styles.tooltipLabel}>{b.label}</span>
                        <span
                          className={
                            b.color === 'red'
                              ? styles.tooltipValRed
                              : b.color === 'green'
                                ? styles.tooltipValGreen
                                : styles.tooltipValDark
                          }
                        >
                          {b.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className={styles.pctOverlay}>
              {funnelStages.map((_, i) => {
                if (i >= funnelStages.length - 1) return null;
                const allStages = conversionRows[0].stages;
                const cs = allStages[i];
                const pct = 'pct' in cs ? cs.pct : null;
                if (!pct) return null;
                const nxt = allStages[i + 1];
                const nxtA = 'active' in nxt ? nxt.active : '0';
                const nxtT = 'total' in nxt ? nxt.total : '0';
                const curT = 'total' in cs ? cs.total : '0';
                return (
                  <div
                    key={i}
                    className={styles.funnelPctCircle}
                    style={{ left: `${((i + 1) / funnelStages.length) * 100}%` }}
                    onMouseEnter={() => { setHoveredPct(i); setHoveredStage(null); }}
                    onMouseLeave={() => setHoveredPct(null)}
                  >
                    <span>{pct}</span>
                    <span className={styles.funnelPctArrow}>›</span>
                    {hoveredPct === i && (
                      <div className={styles.funnelPctTooltip}>
                        <p className={styles.pctTooltipTitle}>Pass-through Rate</p>
                        <p className={styles.pctTooltipFormula}>
                          (Active + Completed in next stage) ÷ Completed in current stage
                        </p>
                        <p className={styles.pctTooltipCalc}>
                          ({nxtA} + {nxtT}) ÷ {curT} = {pct}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Side panel content ── */

  const sidePanelContent = activePanel && (
    <div className={styles.panelBackdrop} onClick={closePanel}>
      <div className={styles.panelSlide} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>{panelMeta[activePanel].title}</h2>
            <p className={styles.panelSubtitle}>{panelMeta[activePanel].subtitle}</p>
          </div>
          <button className={styles.panelClose} onClick={closePanel} aria-label="Close panel">
            <Icon path={IconName.mdiClose} size={IconSize.Medium} />
          </button>
        </div>
        <div className={styles.panelBody}>
          {activePanel === 'fb' &&
            feedbackCandidates.map((c) => (
              <div key={c.id} className={styles.candidateCard}>
                <div className={styles.candidateTop}>
                  <div className={styles.candidateAvatar} style={{ background: c.bg, color: c.color }}>
                    {c.initials}
                  </div>
                  <div className={styles.candidateInfo}>
                    <div className={styles.candidateNameRow}>
                      <p className={styles.candidateName}>{c.name}</p>
                      <span className={styles.candidateRole}>{c.role}</span>
                    </div>
                    <div className={styles.candidateTags}>
                      <span className={styles.tagStage}>{c.stage}</span>
                      <span className={styles.tagRound}>{c.round}</span>
                      <span
                        className={`${styles.tagUrgency} ${
                          c.overdue >= 5
                            ? styles.tagCritical
                            : c.overdue >= 3
                              ? styles.tagWarning
                              : styles.tagNormal
                        }`}
                      >
                        {c.overdue}d overdue
                      </span>
                    </div>
                    <p className={styles.candidateMeta}>
                      Interviewer: <strong>{c.interviewer}</strong> · Match ★{c.matchScore} · {c.source}
                    </p>
                  </div>
                </div>
                <div className={styles.candidateActions}>
                  {dismissedActions.has(`fb-${c.id}-remind`) ? (
                    <span className={styles.actionDone}>
                      <Icon path={IconName.mdiCheck} size={IconSize.Small} color="#16a34a" /> Reminder sent
                    </span>
                  ) : (
                    <Button
                      text="Send reminder"
                      variant={ButtonVariant.Secondary}
                      size={ButtonSize.Small}
                      shape={ButtonShape.Pill}
                      onClick={() =>
                        handleAction(
                          `fb-${c.id}-remind`,
                          `Reminder sent to ${c.interviewer} for ${c.name}'s ${c.round} feedback`
                        )
                      }
                    />
                  )}
                  {dismissedActions.has(`fb-${c.id}-escalate`) ? (
                    <span className={styles.actionDone}>
                      <Icon path={IconName.mdiCheck} size={IconSize.Small} color="#16a34a" /> Escalated
                    </span>
                  ) : (
                    <Button
                      text="Escalate to HM"
                      variant={ButtonVariant.Neutral}
                      size={ButtonSize.Small}
                      shape={ButtonShape.Pill}
                      onClick={() =>
                        handleAction(
                          `fb-${c.id}-escalate`,
                          `Escalated ${c.name}'s feedback to hiring manager`
                        )
                      }
                    />
                  )}
                </div>
              </div>
            ))}

          {activePanel === 'stuck' &&
            stuckCandidates.map((c) => (
              <div key={c.id} className={styles.candidateCard}>
                <div className={styles.candidateTop}>
                  <div className={styles.candidateAvatar} style={{ background: c.bg, color: c.color }}>
                    {c.initials}
                  </div>
                  <div className={styles.candidateInfo}>
                    <div className={styles.candidateNameRow}>
                      <p className={styles.candidateName}>{c.name}</p>
                      <span className={styles.candidateRole}>{c.role}</span>
                    </div>
                    <div className={styles.candidateTags}>
                      <span className={styles.tagStage}>{c.stage}</span>
                      <span className={`${styles.tagUrgency} ${c.risk === 'high' ? styles.tagCritical : styles.tagWarning}`}>
                        {c.days}d in stage (SLA: {c.sla}d)
                      </span>
                      <span className={`${styles.tagBreach} ${c.risk === 'high' ? styles.tagCritical : styles.tagWarning}`}>
                        {c.risk === 'high' ? 'BREACHED' : 'WARNING'}
                      </span>
                    </div>
                    <p className={styles.candidateBlocker}>
                      <Icon path={IconName.mdiAlertCircleOutline} size={IconSize.Small} color="#d97706" />
                      {c.blocker}
                    </p>
                    <p className={styles.candidateMeta}>
                      Match ★{c.matchScore} · {c.source}
                    </p>
                  </div>
                </div>
                <div className={styles.candidateActions}>
                  {dismissedActions.has(`stuck-${c.id}-advance`) ? (
                    <span className={styles.actionDone}>
                      <Icon path={IconName.mdiCheck} size={IconSize.Small} color="#16a34a" /> Advanced
                    </span>
                  ) : (
                    <Dropdown
                      overlay={
                        <Menu
                          items={[
                            { type: MenuItemType.button, text: 'Initial Screen', value: 'initial', iconProps: { path: IconName.mdiArrowRight } },
                            { type: MenuItemType.button, text: 'First Round', value: 'first', iconProps: { path: IconName.mdiArrowRight } },
                            { type: MenuItemType.button, text: 'Second Round', value: 'second', iconProps: { path: IconName.mdiArrowRight } },
                            { type: MenuItemType.button, text: 'Offer', value: 'offer', iconProps: { path: IconName.mdiArrowRight } },
                          ]}
                          size={MenuSize.small}
                          variant={MenuVariant.neutral}
                          onChange={(val: string) =>
                            handleAction(`stuck-${c.id}-advance`, `${c.name} advanced to ${val.charAt(0).toUpperCase() + val.slice(1)} stage`)
                          }
                        />
                      }
                      placement="bottom-start"
                    >
                      <Button
                        text="Advance"
                        variant={ButtonVariant.Neutral}
                        size={ButtonSize.Small}
                        shape={ButtonShape.Pill}
                        alignIcon={ButtonIconAlign.Right}
                        iconProps={{ path: IconName.mdiChevronDown }}
                      />
                    </Dropdown>
                  )}
                  <Button
                    text="Reject"
                    variant={ButtonVariant.Neutral}
                    size={ButtonSize.Small}
                    shape={ButtonShape.Pill}
                    onClick={() => addToast(`${c.name} marked as rejected`)}
                  />
                </div>
              </div>
            ))}

          {activePanel === 'up' &&
            interviewCandidates.map((c) => (
              <div key={c.id} className={styles.candidateCard}>
                <div className={styles.candidateTop}>
                  <div className={styles.candidateAvatar} style={{ background: c.bg, color: c.color }}>
                    {c.initials}
                  </div>
                  <div className={styles.candidateInfo}>
                    <div className={styles.candidateNameRow}>
                      <p className={styles.candidateName}>{c.name}</p>
                      <span className={styles.candidateRole}>{c.role}</span>
                    </div>
                    <div className={styles.candidateTags}>
                      <span className={styles.tagRound}>{c.round}</span>
                      {c.scheduled ? (
                        <span className={styles.tagSchedule}>
                          {c.date} · {c.time}
                        </span>
                      ) : (
                        <span className={styles.tagNotScheduled}>Meeting not scheduled</span>
                      )}
                    </div>
                    <p className={styles.candidateMeta}>
                      Interviewer: <strong>{c.interviewer}</strong> · Match ★{c.matchScore} · {c.source}
                    </p>
                  </div>
                </div>
                <div className={styles.candidateActions}>
                  {c.scheduled ? (
                    <>
                      {dismissedActions.has(`up-${c.id}-prep`) ? (
                        <span className={styles.actionDone}>
                          <Icon path={IconName.mdiCheck} size={IconSize.Small} color="#16a34a" /> Prep kit sent
                        </span>
                      ) : (
                        <Button
                          text="Send prep kit"
                          variant={ButtonVariant.Secondary}
                          size={ButtonSize.Small}
                          shape={ButtonShape.Pill}
                          onClick={() =>
                            handleAction(
                              `up-${c.id}-prep`,
                              `Prep kit sent to ${c.interviewer} for ${c.name}'s ${c.round} interview`
                            )
                          }
                        />
                      )}
                      <Button
                        text="Reschedule"
                        variant={ButtonVariant.Neutral}
                        size={ButtonSize.Small}
                        shape={ButtonShape.Pill}
                        onClick={() => addToast(`Reschedule request sent for ${c.name}'s interview`)}
                      />
                    </>
                  ) : (
                    <Button
                      text="Schedule meeting"
                      variant={ButtonVariant.Secondary}
                      size={ButtonSize.Small}
                      shape={ButtonShape.Pill}
                      onClick={() => addToast(`Scheduling request sent for ${c.name}'s ${c.round} interview`)}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const toastContent = toasts.length > 0 && (
    <div className={styles.toastStack}>
      {toasts.map((t) => (
        <div key={t.id} className={styles.toast}>
          <Icon path={IconName.mdiCheckCircle} size={IconSize.Medium} color="#22c55e" />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );

  /* ── Render ── */

  return (
    <div className={styles.page}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2c8cc9" />
            <stop offset="49%" stopColor="#5962b7" />
            <stop offset="100%" stopColor="#975590" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.shell}>
        {/* ── Header ── */}
        <header className={styles.header}>
          <p className={styles.breadcrumb}>Positions › Senior Product Manager</p>
          <div className={styles.titleRow}>
            <div className={styles.titleLeft}>
              <h1 className={styles.title}>Senior Product Manager</h1>
              <Pill label="Open" size={PillSize.XSmall} theme="green" />
              <Pill label="Published" size={PillSize.XSmall} theme="blue" />
            </div>
            <Dropdown overlay={manageOverlay} placement="bottom-end">
              <button type="button" className={styles.manageBtn}>
                <Icon path={IconName.mdiCogOutline} size={IconSize.Small} />
                <span>Manage position</span>
                <Icon path={IconName.mdiChevronDown} size={IconSize.Small} />
              </button>
            </Dropdown>
          </div>
          <p className={styles.meta}>REQ-2024-0847 · Bangalore, Remote · HM: Prabhat Sharma</p>
          <div className={styles.tabsWrap}>
            <Tabs value={tab} onChange={(v) => setTab(v)} size={TabSize.Medium} theme="violet">
              <Tab value="overview" label="Overview" />
              <Tab value="leads" label="Leads" badgeContent="232" />
              <Tab value="contacted" label="Contacted" badgeContent="201" />
              <Tab value="applicants" label="Applicants" badgeContent="12" />
              <Tab value="hmscreen" label="HM screen" badgeContent="87" />
              <Tab value="interview" label="Interview" badgeContent="51" />
              <Tab value="offer" label="Offer" />
            </Tabs>
          </div>
        </header>

        {/* ── Main two-column layout ── */}
        <div className={styles.mainLayout}>
          {/* Left sidebar */}
          <aside className={styles.sidebar}>
            {/* Position Timeline */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Position timeline</h3>
              <div className={styles.timelineList}>
                {timelineRows.map((row) => (
                  <div key={row.label} className={styles.timelineRow}>
                    <div className={styles.timelineLeft}>
                      <p className={styles.timelineLabel}>{row.label}</p>
                      <p className={`${styles.timelineValue} ${row.alert ? styles.timelineValueAlert : ''}`}>
                        {row.value}
                      </p>
                    </div>
                    <p className={styles.timelineExtra}>{row.extra}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Health */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Position health</h3>
              <div className={styles.healthList}>
                {healthItems.map((item) => (
                  <div key={item.label} className={styles.healthItem}>
                    <div className={styles.healthItemHeader}>
                      <HealthTrendIcon trend={item.trend} />
                      <span className={styles.healthItemLabel}>{item.label}</span>
                    </div>
                    <p className={styles.healthItemValue}>
                      {item.value} <span className={styles.healthItemUnit}>{item.unit}</span>
                    </p>
                    {item.sub && <p className={styles.healthItemSub}>{item.sub}</p>}
                    {item.suggestion && (
                      <div className={styles.healthSuggestion}>
                        <GradientSparkle />
                        <span>{item.suggestion}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sourcing Breakdown */}
            <div className={`${styles.sidebarCard} ${styles.sourcingCardSidebar}`}>
              {sourcingSection}
            </div>
          </aside>

          {/* Right main content */}
          <div className={styles.mainContent}>
            {pipelineSection}
            {convSection}
          </div>
        </div>
      </div>
      {sidePanelContent}
      {toastContent}
    </div>
  );
}
