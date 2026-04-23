import type { ReactNode } from 'react';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  Pill,
  PillSize,
  TextInput,
  TextInputShape,
  TextInputSize,
  TextInputWidth,
} from '@eightfold.ai/octuple';
import { figma } from '../figmaAssets';
import styles from './TAOverviewPage.module.css';

const mainNav = [
  { id: 'position', label: 'Position', active: true, chevron: false },
  { id: 'talent', label: 'Talent', active: false, chevron: true },
  { id: 'engage', label: 'Engage', active: false, chevron: true },
  { id: 'insight', label: 'Insight', active: false, chevron: true },
  { id: 'more', label: 'More', active: false, chevron: true },
] as const;

const subTabs = [
  { id: 'overview', label: 'Overview', icon: '◉', active: true },
  { id: 'setup', label: 'Position setup', icon: '▢', active: false },
  { id: 'leads', label: 'Leads', icon: '▢', active: false },
  { id: 'contacted', label: 'Contacted', icon: '✉', active: false },
  { id: 'applicants', label: 'Applicants', icon: '◯', active: false },
] as const;

const insights = [
  {
    label: 'Resumes submitted this week',
    value: '18',
    trend: '30 resumes last week',
  },
  {
    label: 'HM interviews this week',
    value: '4',
    trend: '11 interviews last week',
  },
  {
    label: 'On-site interviews this week',
    value: '1',
    trend: '8 interviews last week',
  },
] as const;

const activities: {
  avatar: string;
  body: ReactNode;
  right?: ReactNode;
  time: string;
}[] = [
  {
    avatar: figma.activityAvatar,
    body: (
      <>
        <p className={styles.activityText}>
          Michael Jane published <strong>positions</strong>
        </p>
        <span className={styles.internalTag}>Internal</span>
      </>
    ),
    time: '2 seconds ago',
  },
  {
    avatar: figma.activityAvatar,
    body: (
      <p className={styles.activityText}>
        Michael Sheehan published <strong>positions</strong> to Monster
      </p>
    ),
    right: (
      <Button
        text="View distribution status"
        variant={ButtonVariant.Secondary}
        size={ButtonSize.Small}
        shape={ButtonShape.Pill}
      />
    ),
    time: '2 minutes ago',
  },
  {
    avatar: figma.alfredo,
    body: (
      <p className={styles.activityText}>
        Michael Sheehan unpublished the job posting from Naukri
      </p>
    ),
    right: (
      <Button
        text="View distribution status"
        variant={ButtonVariant.Secondary}
        size={ButtonSize.Small}
        shape={ButtonShape.Pill}
      />
    ),
    time: '2 days ago',
  },
  {
    avatar: figma.activityAvatar,
    body: (
      <p className={styles.activityText}>Drake Bell removed variable compensation</p>
    ),
    time: 'Yesterday',
  },
  {
    avatar: figma.activityAvatar,
    body: (
      <p className={styles.activityText}>
        <strong>Drake Bell</strong> added new variable <strong>compensation</strong>{' '}
      </p>
    ),
    time: '10 days ago',
  },
];

function OutlineAction({
  label,
  count,
}: {
  label: string;
  count?: string;
}) {
  return (
    <Button
      text={label}
      counter={count}
      variant={ButtonVariant.Secondary}
      size={ButtonSize.Small}
      shape={ButtonShape.Pill}
      style={{ borderColor: '#1999ac', color: '#054d7b' }}
    />
  );
}

export function TAOverviewPage() {
  return (
    <div className={styles.page} data-figma-node="1:12056">
      <div className={styles.browserChrome}>
        <div className={styles.browserTitleBar} />
        <div className={styles.browserControls}>
          <button type="button" className={styles.browserDot} aria-label="Close">
            <img src={figma.macClose} alt="" />
          </button>
          <button type="button" className={styles.browserDot} aria-label="Minimize">
            <img src={figma.macMin} alt="" />
          </button>
          <button type="button" className={styles.browserDot} aria-label="Zoom">
            <img src={figma.macMax} alt="" />
          </button>
        </div>
        <div className={styles.browserTabStrip}>
          <img src={figma.tabBg} alt="" />
        </div>
        <div className={styles.browserTabLabel}>
          <img src={figma.eightfoldMarkSmall} alt="" />
          <span>Eightfold</span>
          <img src={figma.mdiClose} alt="" width={11} height={11} />
        </div>
        <button type="button" className={styles.browserAddTab} aria-label="New tab">
          <img src={figma.mdiAdd} alt="" />
        </button>

        <div className={styles.browserToolbar}>
          <div className={styles.browserNavCluster}>
            <button type="button" className={styles.iconBtn} aria-label="Back">
              <img src={figma.mdiBack} alt="" />
            </button>
            <button type="button" className={`${styles.iconBtn} ${styles.rotate180}`} aria-label="Forward">
              <img src={figma.mdiForward} alt="" />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Reload">
              <img src={figma.mdiRefresh} alt="" />
            </button>
            <div className={styles.urlBar}>
              <div className={styles.urlText}>
                <span className={styles.urlMuted}>https://</span>
                <span>app.eightfold.ai/</span>
              </div>
              <img className={styles.urlStar} src={figma.mdiStar} alt="" />
            </div>
          </div>
          <img src={figma.browserDots} width={54} height={18} alt="" />
        </div>
        <div className={styles.toolbarDivider}>
          <img src={figma.lineHair} alt="" />
        </div>
      </div>

      <header className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLeft}>
            <div className={styles.brandRow}>
              <div className={styles.brandMark}>
                <img src={figma.eightfoldMark} alt="Eightfold" />
              </div>
              <div className={styles.brandDivider} />
              <div className={styles.productLockup}>
                <div className={styles.taIconWrap}>
                  <img className={styles.taIcon1} src={figma.taPersonPrimary} alt="" />
                  <img className={styles.taIcon2} src={figma.taPersonSecondary} alt="" />
                </div>
                <span className={styles.productLabel}>Talent Acquisition</span>
              </div>
            </div>
            <nav className={styles.mainTabs} aria-label="Primary">
              {mainNav.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={t.active ? `${styles.mainTab} ${styles.mainTabActive}` : styles.mainTab}
                >
                  <div className={styles.mainTabRow}>
                    <span className={styles.mainTabLabel}>{t.label}</span>
                    {t.chevron && (
                      <span className={styles.mainTabChevron} aria-hidden>
                        ▾
                      </span>
                    )}
                  </div>
                  <div
                    className={`${styles.tabIndicator} ${t.active ? styles.tabIndicatorOn : ''}`}
                  />
                </button>
              ))}
            </nav>
          </div>
          <div className={styles.navRight}>
            <div className={styles.searchPill}>
              <TextInput
                placeholder="Type to search..."
                shape={TextInputShape.Pill}
                inputWidth={TextInputWidth.fill}
                size={TextInputSize.Medium}
              />
            </div>
            <div className={styles.iconActions}>
              <div className={styles.gradientHit}>
                <button type="button" className={styles.fauxPill} aria-label="Copilot">
                  <img src={figma.copilot} alt="" />
                  <span className={styles.counterLavender}>8</span>
                </button>
              </div>
              <button type="button" className={styles.fauxPill} aria-label="Notifications">
                <img src={figma.eightfoldAi} alt="" />
                <span aria-hidden>🔔</span>
                <span className={styles.counterTeal}>8</span>
              </button>
              <button type="button" className={styles.fauxPill} aria-label="Apps">
                <img src={figma.eightfoldAi} alt="" />
                <span aria-hidden>▦</span>
                <span className={styles.counterGrey}>8</span>
              </button>
            </div>
            <div className={styles.profileLockup}>
              <div className={styles.avatar}>
                <img src={figma.profileMenu} alt="" />
              </div>
              <button type="button" className={styles.fauxPillMuted} aria-label="Account menu">
                ▾
              </button>
            </div>
          </div>
        </div>
        <div className={styles.navDivider} />
      </header>

      <div className={styles.headerBand}>
        <div className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <div className={styles.titleLine}>
              <h1 className={styles.pageTitle}>Software Developer</h1>
              <div className={styles.octupleBtnWrap}>
                <button type="button" className={styles.fauxPillMuted} aria-label="Bookmark">
                  <img src={figma.eightfoldWord} alt="" />
                  <span aria-hidden>🔖</span>
                  <span className={styles.counterGrey}>8</span>
                  <span aria-hidden>▾</span>
                </button>
                <button type="button" className={styles.fauxPillMuted} aria-label="Documents">
                  <img src={figma.eightfoldWord} alt="" />
                  <span aria-hidden>📄</span>
                  <span className={styles.counterGrey}>8</span>
                </button>
              </div>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.tagId}>999888</span>
              <span className={styles.tagDraft}>
                <span aria-hidden>◆</span> Draft
              </span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.fauxPill}
              style={{ border: '1px solid #1999ac', color: '#054d7b', fontWeight: 600 }}
            >
              <img src={figma.eightfoldWord} alt="" />
              <span>Automate workflows</span>
              <span className={styles.counterTeal}>4</span>
            </button>
            <button
              type="button"
              className={styles.fauxPill}
              aria-label="More actions"
              style={{ border: '1px solid #1999ac' }}
            >
              <img src={figma.eightfoldWord} alt="" />
              <span aria-hidden>⋮</span>
              <span className={styles.counterTeal}>8</span>
            </button>
          </div>
        </div>
        <div className={styles.subTabs} role="tablist">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.active}
              className={tab.active ? `${styles.subTab} ${styles.subTabActive}` : styles.subTab}
            >
              <div className={styles.subTabRow}>
                <span className={styles.subTabIcon} aria-hidden>
                  {tab.icon}
                </span>
                {tab.label}
              </div>
              <div
                className={`${styles.subIndicator} ${tab.active ? styles.tabIndicatorOn : ''}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <main className={styles.mainCol}>
          <section>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>Today&apos;s task</h2>
              <span className={styles.countLg}>7</span>
            </div>
            <p className={styles.sectionHint}>Key updates and actions to fill position</p>
            <div className={styles.taskScroller}>
              <div className={styles.taskCard}>
                <div>
                  <p className={styles.taskMetric}>22</p>
                  <p className={styles.taskCopy}>
                    <span>candidates </span>pending over <span className={styles.highlight}>{'{n}'}</span> days
                  </p>
                </div>
                <OutlineAction label="Advance candidates" count="8" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.taskCard}>
                  <div>
                    <p className={styles.taskMetric}>3</p>
                    <p className={styles.taskCopy}>Offer approval pending since yesterday</p>
                  </div>
                  <OutlineAction label="Review offer" count="8" />
                </div>
              ))}
              <div className={`${styles.taskCard} ${styles.taskCardWide}`}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#025966' }}>Offer</p>
                <p className={styles.taskMetric} style={{ fontSize: 20, lineHeight: '28px', color: '#4f5666' }}>
                  0 offers
                </p>
                <OutlineAction label="Contact leads" count="8" />
              </div>
              <div className={`${styles.taskCard} ${styles.taskCardWide}`}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#025966' }}>Offer</p>
                <p className={styles.taskMetric} style={{ fontSize: 20, lineHeight: '28px', color: '#4f5666' }}>
                  0 offers
                </p>
                <OutlineAction label="Contact leads" count="8" />
              </div>
              <div className={styles.scrollerFade} />
              <div className={styles.scrollerArrow}>
                <button type="button" className={styles.scrollChevron} aria-label="Next tasks">
                  <span aria-hidden>›</span>
                  <span className={styles.counterTeal}>8</span>
                </button>
              </div>
            </div>
          </section>

          <section className={styles.aiBanner}>
            <div className={styles.aiBannerText}>
              <div className={styles.aiBannerIcon}>
                <img src={figma.copilotBanner} alt="" />
              </div>
              <p className={styles.aiBannerTitle}>Generate with Interview feedback form with AI</p>
            </div>
            <div className={styles.aiBannerActions}>
              <Button
                text="Upload document"
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Medium}
                shape={ButtonShape.Pill}
              />
              <Button
                text="Generate"
                variant={ButtonVariant.Primary}
                size={ButtonSize.Medium}
                shape={ButtonShape.Pill}
              />
            </div>
          </section>

          <section>
            <div className={styles.sectionTitleRow} style={{ paddingTop: 8 }}>
              <h2 className={styles.sectionTitle}>Informational insights</h2>
            </div>
            <div className={styles.insightsGrid}>
              {insights.map((row) => (
                <div key={row.label} className={styles.insightCard}>
                  <p className={styles.insightLabel}>{row.label}</p>
                  <div className={styles.insightStats}>
                    <p className={styles.insightValue}>{row.value}</p>
                    <div className={styles.trend}>
                      <span className={styles.trendIcon} aria-hidden>
                        ↘
                      </span>
                      <span>{row.trend}</span>
                    </div>
                  </div>
                  <OutlineAction
                    label={
                      row.label.includes('Resume')
                        ? 'Update job posting'
                        : 'Contact candidates'
                    }
                    count="8"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className={styles.docsPanel}>
            <div className={styles.docsHeader}>
              <div>
                <div className={styles.docsTitleRow}>
                  <h2 className={styles.docsTitle}>Position documents</h2>
                  <span className={styles.countSm}>2</span>
                </div>
                <p className={styles.docsHint}>
                  The AI agent will answer candidate questions based on information in these documents.
                </p>
              </div>
              <Button
                text="Manage documents"
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Medium}
                shape={ButtonShape.Pill}
              />
            </div>

            <div className={styles.docRow}>
              <div className={styles.docMain}>
                <p className={styles.docName}>FAQ document</p>
                <div className={styles.pillRow}>
                  <Pill label="Unanswered 10" size={PillSize.Small} theme="orange" />
                  <Pill label="Answered 4" size={PillSize.Small} theme="blueGreen" />
                </div>
              </div>
              <Button text="Manage FAQs" variant={ButtonVariant.Secondary} size={ButtonSize.Small} shape={ButtonShape.Pill} />
              <Button ariaLabel="FAQ menu" variant={ButtonVariant.Neutral} size={ButtonSize.Small} shape={ButtonShape.Pill} text="⋮" />
            </div>
            <hr className={styles.rowDivider} />
            <div className={styles.docRow}>
              <div className={styles.docMain}>
                <p className={styles.docName}>Work from home policy</p>
                <div className={styles.pillRow}>
                  <Pill label="Country: India, USA" size={PillSize.Small} theme="grey" />
                  <Pill label="Policy" size={PillSize.Small} theme="grey" />
                </div>
              </div>
              <Button ariaLabel="Policy menu" variant={ButtonVariant.Neutral} size={ButtonSize.Small} shape={ButtonShape.Pill} text="⋮" />
            </div>
            <hr className={styles.rowDivider} />
            <div className={styles.docRow}>
              <div className={styles.docMain}>
                <p className={styles.docName}>Interview process guide</p>
              </div>
              <Button ariaLabel="Guide menu" variant={ButtonVariant.Neutral} size={ButtonSize.Small} shape={ButtonShape.Pill} text="⋮" />
            </div>
          </section>

          <section className={styles.activityBlock}>
            <div className={styles.activityHead}>
              <h2 className={styles.activityTitle}>Position activities</h2>
              <span className={styles.countSm}>8</span>
            </div>
            <div className={styles.activityFeed}>
              {activities.map((a, idx) => (
                <div key={idx} className={styles.activityItem}>
                  <div className={styles.activityLeft}>
                    <div className={styles.activityAvatar}>
                      <img src={a.avatar} alt="" />
                    </div>
                    <div className={styles.activityBody}>{a.body}</div>
                  </div>
                  <div className={styles.activityMeta}>
                    {a.right}
                    <span className={styles.time}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.healthHeader}>
            <div className={styles.healthCol}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={styles.healthPill}>51</span>
                <span className={styles.healthLabel}>Average</span>
              </div>
              <p className={styles.healthSub}>Position health</p>
            </div>
            <div className={styles.healthDivider}>
              <img src={figma.healthDivider} alt="" />
            </div>
            <div className={styles.healthCol}>
              <p className={styles.healthScore}>3</p>
              <p className={styles.healthSub}>High impact pending tasks</p>
            </div>
          </div>

          <div className={styles.tasksPanel}>
            <p className={styles.tasksPanelTitle}>Tasks to improve position health</p>
            <div className={styles.tasksSep}>
              <img src={figma.sep1} alt="" />
            </div>
            <div className={styles.taskRow}>
              <div className={styles.taskRowInner}>
                <div className={styles.taskGlyph}>📋</div>
                <div className={styles.taskInfo}>
                  <p className={styles.taskName}>Complete intake form</p>
                  <p className={styles.taskSub}>Pending for 2 days</p>
                  <div className={styles.requiredTag}>
                    <img src={figma.eightfoldWordSolid} alt="" />
                    <span className={styles.requiredText}>Required</span>
                  </div>
                </div>
              </div>
              <OutlineAction label="Edit form" count="8" />
            </div>
            <div className={styles.tasksSep}>
              <img src={figma.sep2} alt="" />
            </div>
            <div className={styles.taskRow}>
              <div className={styles.taskRowInner}>
                <div className={styles.taskGlyph}>📍</div>
                <div className={styles.taskInfo}>
                  <p className={styles.taskName}>Low number of leads</p>
                  <p className={styles.taskSub}>Pending for 3 days</p>
                </div>
              </div>
              <OutlineAction label="Calibrate position" count="8" />
            </div>
            <div className={styles.tasksSep}>
              <img src={figma.sep2} alt="" />
            </div>
            <div className={styles.taskRow}>
              <div className={styles.taskRowInner}>
                <div className={styles.taskGlyph}>📊</div>
                <div className={styles.taskInfo}>
                  <p className={styles.taskName}>Low pipeline health</p>
                </div>
              </div>
              <OutlineAction label="Contact leads" count="8" />
            </div>
          </div>

          <div>
            <p className={styles.controlTitle}>Control panel</p>
            <button type="button" className={styles.controlLink}>
              <span className={styles.controlIcon} aria-hidden>
                📄
              </span>
              <span className={styles.controlLabel}>Job description</span>
            </button>
            <div className={styles.controlSep}>
              <img src={figma.sep3} alt="" />
            </div>
            <button type="button" className={styles.controlLink}>
              <span className={styles.controlIcon} aria-hidden>
                👥
              </span>
              <span className={styles.controlLabel}>Hiring team</span>
            </button>
            <div className={styles.controlSep}>
              <img src={figma.sep3} alt="" />
            </div>
            <button type="button" className={styles.controlLink}>
              <span className={styles.controlIcon} aria-hidden>
                🌐
              </span>
              <span className={styles.controlLabel}>Job distribution center</span>
            </button>
            <div className={styles.controlSep}>
              <img src={figma.sep4} alt="" />
            </div>
            <div className={styles.showMore}>
              <Button
                text="Show more 4"
                variant={ButtonVariant.Primary}
                size={ButtonSize.Small}
                shape={ButtonShape.Pill}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
