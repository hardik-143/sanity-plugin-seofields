import {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {useClient, useWorkspace} from 'sanity'
import {useIntentLink} from 'sanity/router'
import {usePaneRouter} from 'sanity/structure'
import styled, {css, keyframes} from 'styled-components'

import {DeprecationWarning, DocumentWithSeoHealth, SeoHealthMetrics} from '../types'

type ThemeMode = 'light' | 'dark' | 'system'

const themeVars = {
  light: {
    '--seo-bg': '#f0f2f5',
    '--seo-card-bg': '#ffffff',
    '--seo-text-primary': '#1f2937',
    '--seo-text-secondary': '#6b7280',
    '--seo-text-muted': '#9ca3af',
    '--seo-border': '#e5e7eb',
    '--seo-border-light': '#f3f4f6',
    '--seo-input-bg': '#f9fafb',
    '--seo-header-bg': '#f9fafb',
    '--seo-accent': '#6366f1',
    '--seo-accent-hover': '#4f46e5',
    '--seo-link': '#4f46e5',
    '--seo-link-hover': '#4338ca',
    '--seo-hover-bg': '#fafafa',
    '--seo-shadow': 'rgba(0, 0, 0, 0.07)',
    '--seo-shadow-hover': 'rgba(0, 0, 0, 0.1)',
    '--seo-focus-ring': 'rgba(99, 102, 241, 0.1)',
    '--seo-issue-color': '#ef4444',
    '--seo-more-issues': '#6b7280',
    '--seo-more-issues-hover': '#374151',
    '--seo-popover-bg': '#1f2937',
    '--seo-popover-text': '#ffffff',
    '--seo-spinner-track': '#e5e7eb',
    '--seo-spinner-fill': '#6366f1',
    '--seo-btn-bg': '#ffffff',
    '--seo-btn-text': '#374151',
    '--seo-btn-border': '#d1d5db',
    '--seo-btn-hover-bg': '#f3f4f6',
    '--seo-btn-hover-border': '#9ca3af',
    '--seo-select-arrow': '%236b7280',
    '--seo-score-excellent-bg': '#d1fae5',
    '--seo-score-excellent-text': '#065f46',
    '--seo-score-good-bg': '#fef3c7',
    '--seo-score-good-text': '#92400e',
    '--seo-score-fair-bg': '#ffedd5',
    '--seo-score-fair-text': '#9a3412',
    '--seo-score-poor-bg': '#fee2e2',
    '--seo-score-poor-text': '#991b1b',
    '--seo-preview-bg': '#fef3c7',
    '--seo-preview-text': '#92400e',
    '--seo-deprecation-bg': '#fffbeb',
    '--seo-deprecation-border': '#fcd34d',
    '--seo-deprecation-text': '#78350f',
    '--seo-deprecation-link': '#92400e',
    '--seo-upgrade-bg': '#ffffff',
    '--seo-upgrade-border': '#e5e7eb',
    '--seo-upgrade-code-bg': '#f3f4f6',
    '--seo-upgrade-code-text': '#374151',
    '--seo-upgrade-code-border': '#e5e7eb',
    '--seo-warning-bg': '#fef3c7',
    '--seo-warning-border': '#fcd34d',
    '--seo-warning-text': '#92400e',
    '--seo-theme-picker-bg': '#ffffff',
    '--seo-theme-picker-border': '#e5e7eb',
    '--seo-theme-picker-active': '#f0f0ff',
    '--seo-theme-picker-active-border': '#6366f1',
  } as Record<string, string>,
  dark: {
    '--seo-bg': '#1a1b1e',
    '--seo-card-bg': '#25262b',
    '--seo-text-primary': '#c9cdd3',
    '--seo-text-secondary': '#8b919a',
    '--seo-text-muted': '#6b7280',
    '--seo-border': '#373a40',
    '--seo-border-light': '#2c2e33',
    '--seo-input-bg': '#2c2e33',
    '--seo-header-bg': '#2c2e33',
    '--seo-accent': '#818cf8',
    '--seo-accent-hover': '#6366f1',
    '--seo-link': '#818cf8',
    '--seo-link-hover': '#a5b4fc',
    '--seo-hover-bg': '#2c2e33',
    '--seo-shadow': 'rgba(0, 0, 0, 0.25)',
    '--seo-shadow-hover': 'rgba(0, 0, 0, 0.35)',
    '--seo-focus-ring': 'rgba(129, 140, 248, 0.15)',
    '--seo-issue-color': '#f87171',
    '--seo-more-issues': '#8b919a',
    '--seo-more-issues-hover': '#c9cdd3',
    '--seo-popover-bg': '#373a40',
    '--seo-popover-text': '#e5e7eb',
    '--seo-spinner-track': '#373a40',
    '--seo-spinner-fill': '#818cf8',
    '--seo-btn-bg': '#2c2e33',
    '--seo-btn-text': '#c9cdd3',
    '--seo-btn-border': '#373a40',
    '--seo-btn-hover-bg': '#373a40',
    '--seo-btn-hover-border': '#4b5058',
    '--seo-select-arrow': '%238b919a',
    '--seo-score-excellent-bg': '#064e3b',
    '--seo-score-excellent-text': '#6ee7b7',
    '--seo-score-good-bg': '#78350f',
    '--seo-score-good-text': '#fcd34d',
    '--seo-score-fair-bg': '#7c2d12',
    '--seo-score-fair-text': '#fdba74',
    '--seo-score-poor-bg': '#7f1d1d',
    '--seo-score-poor-text': '#fca5a5',
    '--seo-preview-bg': '#78350f',
    '--seo-preview-text': '#fcd34d',
    '--seo-deprecation-bg': '#422006',
    '--seo-deprecation-border': '#a16207',
    '--seo-deprecation-text': '#fcd34d',
    '--seo-deprecation-link': '#fbbf24',
    '--seo-upgrade-bg': '#25262b',
    '--seo-upgrade-border': '#373a40',
    '--seo-upgrade-code-bg': '#2c2e33',
    '--seo-upgrade-code-text': '#c9cdd3',
    '--seo-upgrade-code-border': '#373a40',
    '--seo-warning-bg': '#422006',
    '--seo-warning-border': '#a16207',
    '--seo-warning-text': '#fcd34d',
    '--seo-theme-picker-bg': '#25262b',
    '--seo-theme-picker-border': '#373a40',
    '--seo-theme-picker-active': '#2d2d44',
    '--seo-theme-picker-active-border': '#818cf8',
  } as Record<string, string>,
}

const DashboardContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background: var(--seo-bg);
  padding: 28px 32px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--seo-text-primary);
`

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 28px;
`

const PageTitle = styled.h1`
  margin: 0 0 6px 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--seo-text-primary);
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const PreviewBadge = styled.span`
  display: inline-block;
  background: var(--seo-preview-bg);
  color: var(--seo-preview-text);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 8px;
`

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--seo-text-secondary);
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
`

const StatCard = styled.div<{$accent?: string}>`
  background: var(--seo-card-bg);
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow:
    0 1px 3px var(--seo-shadow),
    0 1px 2px var(--seo-shadow);
  border-left: ${(p) => (p.$accent ? `4px solid ${p.$accent}` : '4px solid transparent')};
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px var(--seo-shadow-hover);
  }
`

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: var(--seo-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`

const StatValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: var(--seo-text-primary);
  line-height: 1;
`

const ControlsBar = styled.div`
  background: var(--seo-card-bg);
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px var(--seo-shadow);
`

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 220px;
`

const SearchIconSvg = styled.span`
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--seo-text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
`

const SearchInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 12px 0 34px;
  border: 1px solid var(--seo-border);
  border-radius: 7px;
  font-size: 13px;
  color: var(--seo-text-primary);
  background: var(--seo-input-bg);
  box-sizing: border-box;
  outline: none;
  transition:
    border-color 0.15s,
    background 0.15s;

  &::placeholder {
    color: var(--seo-text-muted);
  }

  &:focus {
    border-color: var(--seo-accent);
    background: var(--seo-card-bg);
    box-shadow: 0 0 0 3px var(--seo-focus-ring);
  }
`

const StyledSelect = styled.select`
  height: 36px;
  padding: 0 32px 0 12px;
  border: 1px solid var(--seo-border);
  border-radius: 7px;
  font-size: 13px;
  color: var(--seo-text-secondary);
  background: var(--seo-input-bg)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")
    no-repeat right 10px center;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--seo-accent);
    background-color: var(--seo-card-bg);
    box-shadow: 0 0 0 3px var(--seo-focus-ring);
  }
`

const TableCard = styled.div`
  background: var(--seo-card-bg);
  border-radius: 10px;
  box-shadow: 0 1px 3px var(--seo-shadow);
  overflow: hidden;
`

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 11px 20px;
  background: var(--seo-header-bg);
  border-bottom: 1px solid var(--seo-border);
  font-size: 11px;
  font-weight: 600;
  color: var(--seo-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  gap: 12px;
`

const TableRow = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 20px;
  border-bottom: 1px solid var(--seo-border-light);
  gap: 12px;
  transition: background 0.1s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--seo-hover-bg);
  }
`

const ColTitle = styled.div`
  flex: 2;
  min-width: 0;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  min-width: 0;
`

/* Constrains the title + doc-id block so text-overflow works inside flex */
const TitleCell = styled.div`
  min-width: 0;
  overflow: hidden;
  flex: 1;
`

const ColType = styled.div`
  flex: 0.8;
  min-width: 80px;
`

const ColScore = styled.div`
  flex: 0.6;
  min-width: 70px;
`

const ColIssues = styled.div`
  flex: 2;
  min-width: 0;
`

const DocTitleLink = styled.a`
  font-size: 13px;
  font-weight: 600;
  color: var(--seo-link);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  display: block;
  transition: color 0.15s;

  &:hover {
    color: var(--seo-link-hover);
    text-decoration: underline;
  }
`

const DocId = styled.div`
  font-size: 11px;
  color: var(--seo-text-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TypeBadge = styled.span<{$bgColor?: string; $textColor?: string}>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  background: ${(p) => p.$bgColor || '#ede9fe'};
  color: ${(p) => p.$textColor || '#5b21b6'};
`

const TypeText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--seo-text-secondary);
`

const CustomBadge = styled.span<{$bgColor?: string; $textColor?: string; $fontSize?: string}>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: ${(p) => p.$fontSize || '10px'};
  font-weight: 600;
  background: ${(p) => p.$bgColor || '#e0e7ff'};
  color: ${(p) => p.$textColor || '#3730a3'};
  white-space: nowrap;
`

const ScoreBadge = styled.span<{$score: number}>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background: ${(p) => {
    if (p.$score >= 80) return 'var(--seo-score-excellent-bg)'
    if (p.$score >= 60) return 'var(--seo-score-good-bg)'
    if (p.$score >= 40) return 'var(--seo-score-fair-bg)'
    return 'var(--seo-score-poor-bg)'
  }};
  color: ${(p) => {
    if (p.$score >= 80) return 'var(--seo-score-excellent-text)'
    if (p.$score >= 60) return 'var(--seo-score-good-text)'
    if (p.$score >= 40) return 'var(--seo-score-fair-text)'
    return 'var(--seo-score-poor-text)'
  }};
`

const IssueTag = styled.div`
  font-size: 11px;
  color: var(--seo-issue-color);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NonStringTitleWarning = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--seo-warning-bg);
  border: 1px solid var(--seo-warning-border);
  font-size: 10px;
  font-weight: 600;
  color: var(--seo-warning-text);
  line-height: 1.4;
  cursor: default;
  white-space: normal;
`

const MoreIssues = styled.div`
  font-size: 11px;
  color: var(--seo-more-issues);
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: var(--seo-more-issues-hover);
  }
`

const MoreIssuesWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const IssuesPopover = styled.div<{
  $left?: number
}>`
  position: fixed;
  bottom: auto;
  left: 0;
  transform: translateY(calc(-100% - 14px));
  background: var(--seo-popover-bg);
  color: var(--seo-popover-text);
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 50;
  box-shadow: 0 10px 25px var(--seo-shadow-hover);
  width: 280px;
  word-break: break-word;
  line-height: 1.5;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 12px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid var(--seo-popover-bg);
  }
`

const PopoverIssueItem = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`

const UpgradeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 60px 24px;
`

const UpgradeBox = styled.div`
  background: var(--seo-upgrade-bg);
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow:
    0 4px 24px var(--seo-shadow),
    0 1px 4px var(--seo-shadow);
  border: 1px solid var(--seo-upgrade-border);
`

const UpgradeLock = styled.div`
  font-size: 40px;
  margin-bottom: 16px;
`

const UpgradeTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 700;
  color: var(--seo-text-primary);
`

const UpgradeText = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--seo-text-secondary);
  line-height: 1.6;
`

const UpgradeCode = styled.pre`
  background: var(--seo-upgrade-code-bg);
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 12px;
  color: var(--seo-upgrade-code-text);
  text-align: left;
  margin: 0 0 24px;
  overflow-x: auto;
  line-height: 1.6;
  border: 1px solid var(--seo-upgrade-code-border);
`

const UpgradeButton = styled.a`
  display: inline-block;
  background: var(--seo-accent);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: var(--seo-accent-hover);
  }
`

const ReloadButton = styled.button`
  display: inline-block;
  background: transparent;
  color: var(--seo-text-secondary);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid var(--seo-btn-border);
  cursor: pointer;
  margin-top: 10px;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  &:hover {
    background: var(--seo-btn-hover-bg);
    color: var(--seo-text-primary);
    border-color: var(--seo-btn-hover-border);
  }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const DashboardRefreshButton = styled.button<{$spinning?: boolean}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--seo-btn-bg);
  color: var(--seo-btn-text);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--seo-btn-border);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
  box-shadow: 0 1px 2px var(--seo-shadow);

  svg {
    animation: ${(p) =>
      p.$spinning
        ? css`
            ${spin} 0.7s linear infinite
          `
        : 'none'};
  }

  &:hover {
    background: var(--seo-btn-hover-bg);
    border-color: var(--seo-btn-hover-border);
    box-shadow: 0 2px 6px var(--seo-shadow);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ThemeSwitcher = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: var(--seo-theme-picker-bg);
  border: 1px solid var(--seo-theme-picker-border);
  border-radius: 9px;
  padding: 3px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px var(--seo-shadow);
`

const getThemeButtonActiveStyles = (theme: 'light' | 'dark' | 'system') => {
  switch (theme) {
    case 'light':
      return css`
        background: #fff4ed;
        border: 1.5px solid #f97316;
        color: #ea6c0a;
        box-shadow:
          0 0 0 2px rgba(249, 115, 22, 0.15),
          0 1px 3px rgba(0, 0, 0, 0.08);
      `
    case 'dark':
      return css`
        background: #eff6ff;
        border: 1.5px solid #3b82f6;
        color: #2563eb;
        box-shadow:
          0 0 0 2px rgba(59, 130, 246, 0.15),
          0 1px 3px rgba(0, 0, 0, 0.08);
      `
    case 'system':
      return css`
        background: #f0fdf4;
        border: 1.5px solid #22c55e;
        color: #16a34a;
        box-shadow:
          0 0 0 2px rgba(34, 197, 94, 0.15),
          0 1px 3px rgba(0, 0, 0, 0.08);
      `
    default:
      return css`
        background: #f0fdf4;
        border: 1.5px solid #22c55e;
        color: #16a34a;
        box-shadow:
          0 0 0 2px rgba(34, 197, 94, 0.15),
          0 1px 3px rgba(0, 0, 0, 0.08);
      `
  }
}

const getThemeButtonHoverStyles = (theme: 'light' | 'dark' | 'system') => {
  switch (theme) {
    case 'light':
      return css`
        background: #fff4ed;
        border-color: rgba(249, 115, 22, 0.2);
        color: #ea6c0a;
      `
    case 'dark':
      return css`
        background: #eff6ff;
        border-color: rgba(59, 130, 246, 0.2);
        color: #2563eb;
      `
    case 'system':
      return css`
        background: #f0fdf4;
        border-color: rgba(34, 197, 94, 0.2);
        color: #16a34a;
      `
    default:
      return css`
        background: #f0fdf4;
        border-color: rgba(34, 197, 94, 0.2);
        color: #16a34a;
      `
  }
}

const ThemeButton = styled.button<{$active?: boolean; $theme: 'light' | 'dark' | 'system'}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  padding: 0;
  transition:
    background 0.18s,
    color 0.18s,
    border-color 0.18s,
    box-shadow 0.18s;

  /* Per-theme active colours */
  ${(p) =>
    p.$active
      ? getThemeButtonActiveStyles(p.$theme)
      : css`
          background: transparent;
          border: 1.5px solid transparent;
          color: var(--seo-text-muted);
        `}

  &:hover {
    ${(p) => (p.$active ? '' : getThemeButtonHoverStyles(p.$theme))}
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const MonitorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

// Sub-component so useIntentLink can be called at the top level of a component (not inside .map)
const DocTitleAnchor = ({
  id,
  type,
  structureTool,
  children,
}: {
  id: string
  type: string
  structureTool?: string
  children: ReactNode
}) => {
  const {basePath} = useWorkspace()
  const {onClick: intentOnClick, href: intentHref} = useIntentLink({
    intent: 'edit',
    params: {id, type},
  })
  // When a specific structure tool name is provided, build a tool-scoped intent URL so that
  // Sanity routes directly to that tool instead of letting the router pick the first match.
  const href = structureTool
    ? `${basePath}/${structureTool}/intent/edit/id=${id};type=${type}/`
    : intentHref
  const onClick = structureTool ? undefined : intentOnClick
  return (
    <DocTitleLink href={href} onClick={onClick} title="Open document">
      {children}
    </DocTitleLink>
  )
}

// Wrapper that applies DocTitleLink styles to the ChildLink <a> rendered by Sanity's pane router
const PaneLinkWrapper = styled.span`
  display: block;
  min-width: 0;
  overflow: hidden;

  a {
    font-size: 13px;
    font-weight: 600;
    color: var(--seo-link);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    display: block;
    transition: color 0.15s;

    &:hover {
      color: var(--seo-link-hover);
      text-decoration: underline;
    }
  }
`

// Sub-component for desk-structure split-pane navigation.
// Uses ChildLink from usePaneRouter to open the document editor to the right
// while keeping the SEO Health pane visible on the left.
const DocTitleAnchorPane = ({
  id,
  type,
  children,
}: {
  id: string
  type: string
  children: ReactNode
}) => {
  const {ChildLink} = usePaneRouter()
  return (
    <PaneLinkWrapper>
      <ChildLink childId={id} childParameters={{type}}>
        {children}
      </ChildLink>
    </PaneLinkWrapper>
  )
}

// Sub-component to safely call docBadge outside a .map expression
const DocBadgeRenderer = ({
  doc,
  docBadge,
}: {
  doc: DocumentWithSeoHealth & Record<string, unknown>
  docBadge: (
    _doc: DocumentWithSeoHealth & Record<string, unknown>,
  ) => {label: string; bgColor?: string; textColor?: string; fontSize?: string} | undefined
}) => {
  const badge = docBadge(doc)
  if (!badge) return null
  return (
    <CustomBadge $bgColor={badge.bgColor} $textColor={badge.textColor} $fontSize={badge.fontSize}>
      {badge.label}
    </CustomBadge>
  )
}

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid var(--seo-spinner-track);
  border-top-color: var(--seo-spinner-fill);
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin: 0 auto 12px;
`

const LoadingState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: var(--seo-text-secondary);
  font-size: 13px;
`

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: var(--seo-text-muted);
  font-size: 13px;
`

const DeprecationBanner = styled.div`
  background: var(--seo-deprecation-bg);
  border: 1px solid var(--seo-deprecation-border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: var(--seo-deprecation-text);
  margin-bottom: 16px;
  line-height: 1.6;
`

const DeprecationBannerLink = styled.a`
  color: var(--seo-deprecation-link);
  font-weight: 600;
  text-decoration: underline;
  &:hover {
    color: var(--seo-deprecation-text);
  }
`

const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--seo-btn-bg);
  color: var(--seo-btn-text);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 11px;
  border-radius: 7px;
  border: 1px solid var(--seo-btn-border);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  &:hover {
    background: var(--seo-btn-hover-bg);
    border-color: var(--seo-btn-hover-border);
  }
`

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  background: var(--seo-card-bg);
  border-top: 1px solid var(--seo-border);
  padding: 10px 20px;
  font-size: 12px;
  color: var(--seo-text-secondary);
`

const PaginationCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--seo-border);
  background: var(--seo-btn-bg);
  color: var(--seo-btn-text);
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: var(--seo-btn-hover-bg);
    border-color: var(--seo-btn-hover-border);
  }
`

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
`

const StatPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  background: var(--seo-card-bg);
  border: 1px solid var(--seo-border);
  color: var(--seo-text-secondary);
`

/**
 * Color palette for dynamic document type badges
 * Colors are randomly assigned based on type hash for visual variety
 * while maintaining consistency across sessions
 */
const TYPE_COLOR_PALETTE: Array<{bg: string; text: string}> = [
  {bg: '#dbeafe', text: '#0c4a6e'}, // Blue
  {bg: '#dcfce7', text: '#14532d'}, // Green
  {bg: '#fce7f3', text: '#500724'}, // Pink
  {bg: '#fed7aa', text: '#7c2d12'}, // Orange
  {bg: '#e9d5ff', text: '#581c87'}, // Purple
  {bg: '#f3e8ff', text: '#3f0f5c'}, // Deep Purple
  {bg: '#ccfbf1', text: '#134e4a'}, // Teal
  {bg: '#ddd6fe', text: '#3730a3'}, // Indigo
  {bg: '#fca5a5', text: '#7f1d1d'}, // Red
  {bg: '#a7f3d0', text: '#065f46'}, // Emerald
  {bg: '#fbbf24', text: '#78350f'}, // Amber
  {bg: '#c4b5fd', text: '#3b0764'}, // Violet
  {bg: '#f0fdf4', text: '#15803d'}, // Light Green
  {bg: '#fef2f2', text: '#991b1b'}, // Light Red
  {bg: '#f5f3ff', text: '#5b21b6'}, // Light Purple
  {bg: '#fffbeb', text: '#92400e'}, // Light Amber
]

/**
 * Get dynamic color for a document type based on type name hash
 * Same type always gets the same color, but assignment is not fixed
 */
const getTypeColor = (type: string): {bg: string; text: string} => {
  // Generate consistent hash from type string using simple arithmetic
  let hash = 0
  for (let i = 0; i < type.length; i += 1) {
    const char = type.charCodeAt(i)
    hash = Math.abs(hash * 31 + char)
  }

  // Use modulo to get index within palette range
  const colorIndex = hash % TYPE_COLOR_PALETTE.length
  return TYPE_COLOR_PALETTE[colorIndex]
}

const getStatusCategory = (score: number): SeoHealthMetrics['status'] => {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'fair'
  if (score > 0) return 'poor'
  return 'missing'
}

interface RenderLicenseState {
  licenseKey?: string
  validateLicense: (forceRefresh?: boolean) => Promise<void>
}

const RenderLicenseLoading = ({text}: {text?: ReactNode}) => (
  <LoadingState style={{padding: '80px 24px'}}>
    <Spinner />
    {text ?? 'Verifying license…'}
  </LoadingState>
)

const RenderLicenseInvalid = ({licenseKey, validateLicense}: RenderLicenseState) => (
  <UpgradeContainer>
    <UpgradeBox>
      {licenseKey ? (
        <>
          <UpgradeLock>❌</UpgradeLock>
          <UpgradeTitle>Invalid License Key</UpgradeTitle>
          <UpgradeText>
            The license key you provided is invalid or has been revoked. Please check your key and
            update it in the plugin config.
          </UpgradeText>
          <UpgradeCode>{`seofields({
    healthDashboard: {
      licenseKey: 'YOUR_LICENSE_KEY', // ← replace with a valid key
    },
  })`}</UpgradeCode>
          <UpgradeButton
            href="https://sanity-plugin-seofields.thehardik.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get a New License Key →
          </UpgradeButton>
          <br />
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <ReloadButton onClick={() => validateLicense(true)}>
            Click here If You Just Updated Your Key
          </ReloadButton>
        </>
      ) : (
        <>
          <UpgradeLock>🔒</UpgradeLock>
          <UpgradeTitle>SEO Health Dashboard</UpgradeTitle>
          <UpgradeText>
            This feature requires a license key. Add your key to the plugin config to unlock the
            full dashboard.
          </UpgradeText>
          <UpgradeCode>{`// sanity.config.ts
  import { seofields } from 'sanity-plugin-seofields'
  
  export default defineConfig({
    plugins: [
      seofields({
        healthDashboard: {
          licenseKey: 'SEOF-XXXX-XXXX-XXXX',
        },
      }),
    ],
  })`}</UpgradeCode>
          <UpgradeButton
            href="https://sanity-plugin-seofields.thehardik.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get a License Key →
          </UpgradeButton>
        </>
      )}
    </UpgradeBox>
  </UpgradeContainer>
)

const scoreMetaTitle = (title?: string): {score: number; issues: string[]} => {
  const issues: string[] = []
  let score = 0

  if (title && title.length >= 50 && title.length <= 60) {
    score = 15
  } else if (title && title.length > 0) {
    score = 10
    if (title.length < 50) issues.push('Meta title too short (< 50 chars)')
    if (title.length > 60) issues.push('Meta title too long (> 60 chars)')
  } else {
    issues.push('Missing meta title')
  }

  return {score, issues}
}

const scoreMetaDescription = (description?: string): {score: number; issues: string[]} => {
  const issues: string[] = []
  let score = 0

  if (description && description.length >= 120 && description.length <= 160) {
    score = 15
  } else if (description && description.length > 0) {
    score = 10
    if (description.length < 120) issues.push('Meta description too short (< 120 chars)')
    if (description.length > 160) issues.push('Meta description too long (> 160 chars)')
  } else {
    issues.push('Missing meta description')
  }

  return {score, issues}
}

const scoreOpenGraph = (openGraph?: Record<string, unknown>): {score: number; issues: string[]} => {
  const issues: string[] = []
  let score = 0

  if (openGraph) {
    if (openGraph.title) score += 6
    else issues.push('Missing OG title')

    if (openGraph.description) score += 6
    else issues.push('Missing OG description')

    if (openGraph.image) score += 6
    else issues.push('Missing OG image')

    if (openGraph.type) score += 7
    else issues.push('Missing OG type')
  } else {
    issues.push('Open Graph not configured')
  }

  return {score, issues}
}

const scoreTwitterCard = (twitter?: Record<string, unknown>): {score: number; issues: string[]} => {
  const issues: string[] = []
  let score = 0

  if (twitter) {
    if (twitter.title) score += 5
    else issues.push('Missing Twitter title')

    if (twitter.description) score += 5
    else issues.push('Missing Twitter description')

    if (twitter.image) score += 5
    else issues.push('Missing Twitter image')
  } else {
    issues.push('Twitter Card not configured')
  }

  return {score, issues}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateHealthScore = (doc: any): SeoHealthMetrics => {
  if (!doc.seo) {
    return {score: 0, status: 'missing', issues: ['SEO fields not configured']}
  }

  const {title, description, keywords, robots, canonicalUrl, openGraph, twitter} = doc.seo
  let score = 0
  const issues: string[] = []

  const titleResult = scoreMetaTitle(title)
  score += titleResult.score
  issues.push(...titleResult.issues)

  const descResult = scoreMetaDescription(description)
  score += descResult.score
  issues.push(...descResult.issues)

  // Image
  if (doc.seo.metaImage) score += 10
  else issues.push('Missing meta image')

  // Keywords
  if (keywords && keywords.length > 0) score += 10
  else issues.push('No keywords defined')

  // Robots
  if (robots && !robots.noIndex) score += 5
  else if (!robots) score += 5

  // Canonical URL
  if (canonicalUrl) score += 0 // bonus, not counted in base

  const ogResult = scoreOpenGraph(openGraph)
  score += ogResult.score
  issues.push(...ogResult.issues)

  const twResult = scoreTwitterCard(twitter)
  score += twResult.score
  issues.push(...twResult.issues)

  // Image Completeness bonus (+5 pts when all three images are present)
  const hasMetaImage = !!doc.seo.metaImage
  const hasOgImage = !!(openGraph && openGraph.image)
  const hasTwitterImage = !!(twitter && twitter.image)
  if (hasMetaImage && hasOgImage && hasTwitterImage) {
    score += 5
  } else {
    const missingImages: string[] = []
    if (!hasMetaImage) missingImages.push('meta image')
    if (!hasOgImage) missingImages.push('OG image')
    if (!hasTwitterImage) missingImages.push('Twitter image')
    issues.push(`Missing images for full score: ${missingImages.join(', ')}`)
  }

  const status = getStatusCategory(score)
  return {score, status, issues}
}

const resolveTypeLabel = (type: string, typeLabels?: Record<string, string>): string =>
  typeLabels?.[type] ?? type

/**
 * Builds the GROQ projection snippet for the title field.
 * - undefined / 'title'        → `title`
 * - 'name'                     → `"title": name`
 * - { post: 'title', product: 'name' } → `"title": select(_type == "post" => title, _type == "product" => name, title)`
 */
const buildTitleProjection = (titleField?: string | Record<string, string>): string => {
  if (!titleField || titleField === 'title') return 'title'
  if (typeof titleField === 'string') return `"title": ${titleField}`
  const cases = Object.entries(titleField)
    .map(([type, field]) => `_type == "${type}" => ${field}`)
    .join(', ')
  return `"title": select(${cases}, title)`
}

export interface SeoHealthDashboardProps {
  icon?: string
  title?: string
  description?: string
  showTypeColumn?: boolean
  showDocumentId?: boolean
  /**
   * Limit the dashboard to specific document type names.
   * If both queryTypes and customQuery are provided, customQuery takes precedence.
   */
  queryTypes?: string[]
  /**
   * When using `queryTypes`, also filter by `seo != null`.
   * Set to `false` to include documents of those types even without an seo field.
   * Defaults to `true`.
   */
  queryRequireSeo?: boolean
  /**
   * A fully custom GROQ query used to fetch documents.
   * Must return objects with at least: _id, _type, title, seo, _updatedAt
   * Takes precedence over queryTypes.
   */
  customQuery?: string
  /**
   * The Sanity API version to use for the client (e.g. '2023-01-01').
   * Defaults to '2023-01-01'.
   */
  apiVersion?: string
  /**
   * License key for the SEO Health Dashboard.
   * Obtain a key at https://sanity-plugin-seofields.thehardik.in
   */
  licenseKey?: string
  /**
   * Map raw `_type` values to human-readable display labels used in the
   * Type column and the Type filter dropdown.
   * Any type without an entry falls back to the raw `_type` string.
   *
   * @example
   * typeDisplayLabels={{ productDrug: 'Products', singleCondition: 'Condition' }}
   */
  typeDisplayLabels?: Record<string, string>
  /**
   * Controls how the type is rendered in the Type column.
   * - `'badge'` (default) — coloured pill, consistent with score badges
   * - `'text'` — plain text, useful for dense layouts
   */
  typeColumnMode?: 'badge' | 'text'
  /**
   * The document field to use as the display title.
   *
   * - `string` — use this field for every document type (e.g. `'name'`)
   * - `Record<string, string>` — per-type mapping; unmapped types fall back to `title`
   *
   * @example
   * // Same field for all types
   * titleField: 'name'
   *
   * @example
   * // Different field per type
   * titleField: { post: 'title', product: 'name', category: 'label' }
   */
  titleField?: string | Record<string, string>
  /**
   * Callback function to render a custom badge next to the document title.
   * Receives the full document and should return badge data or undefined.
   *
   * @example
   * getDocumentBadge: (doc) => {
   *   if (doc.services === 'NHS')
   *     return { label: 'NHS', bgColor: '#e0f2fe', textColor: '#0369a1' }
   *   if (doc.services === 'Private')
   *     return { label: 'Private', bgColor: '#fef3c7', textColor: '#92400e' }
   * }
   */
  getDocumentBadge?: (
    doc: DocumentWithSeoHealth & Record<string, unknown>,
  ) => {label: string; bgColor?: string; textColor?: string; fontSize?: string} | undefined
  /**
   * Custom text shown while the license key is being verified.
   * Defaults to `"Verifying license…"`.
   */
  loadingLicense?: ReactNode
  /**
   * Custom text shown while documents are being fetched.
   * Defaults to `"Loading documents…"`.
   */
  loadingDocuments?: ReactNode
  /**
   * Custom text shown when the query returns zero results.
   * Defaults to `"No documents found"`.
   */
  noDocuments?: ReactNode
  /**
   * Enable preview/demo mode to show dummy data.
   * Useful for testing, documentation, or showcasing the dashboard.
   * When enabled, displays realistic sample documents with various SEO scores.
   * Defaults to `false`.
   */
  previewMode?: boolean
  /**
   * When `true`, clicking a document title opens the document editor as a split
   * pane to the right, keeping the SEO Health pane visible on the left.
   * This uses Sanity's pane router and requires the component to be rendered
   * inside a desk-structure pane context (i.e. via `createSeoHealthPane`).
   *
   * When `false` (default), clicking navigates to the document via the standard
   * intent-link system (full navigation).
   *
   * This is set to `true` automatically by `createSeoHealthPane`.
   */
  openInPane?: boolean
  /**
   * The `name` of the Sanity structure tool that contains the monitored documents.
   * When provided, clicking a document title navigates directly to that tool's
   * intent URL (`/{basePath}/{structureTool}/intent/edit/id=…;type=…/`) instead of
   * using the generic intent resolver, which always picks the first registered tool.
   *
   * Required when you have multiple structure tools and the documents live in a
   * non-default one (e.g. `name: 'common'`).
   *
   * @example
   * structureTool: 'common'
   */
  structureTool?: string
  /**
   * @internal — populated by the plugin when deprecated config keys are detected.
   * Each entry carries the migration hint, the version it was deprecated in, and
   * the matching changelog URL so the banner can group warnings by release.
   */
  _deprecationWarnings?: DeprecationWarning[]
  /**
   * Whether the export (CSV / JSON) feature is enabled.
   * Defaults to `true`.
   */
  exportEnabled?: boolean
  /**
   * Which export formats to offer.
   * Defaults to `['csv', 'json']`.
   */
  exportFormats?: Array<'csv' | 'json'>
  /**
   * Render compact inline stat pills in the header instead of the full stats grid.
   * Defaults to `false`.
   */
  compactStats?: boolean
}

/**
 * Generate dummy data for preview mode showing various SEO health scenarios
 */
const generateDummyData = (): DocumentWithSeoHealth[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dummyDocs: any[] = [
    {
      _id: 'preview-post-1',
      _type: 'post',
      title: 'Getting Started with SEO Best Practices',
      slug: {current: 'getting-started-seo'},
      _updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      seo: {
        title: 'Getting Started with SEO Best Practices | My Blog',
        description:
          'Learn the fundamentals of SEO optimization to improve your website visibility and search rankings.',
        keywords: ['seo', 'best practices', 'optimization'],
        metaImage: {_type: 'image', asset: {_ref: 'image-123', _type: 'reference'}},
        openGraph: {
          title: 'SEO Best Practices Guide',
          description: 'Master SEO optimization',
          image: {_type: 'image', asset: {_ref: 'image-123', _type: 'reference'}, alt: 'SEO Guide'},
          type: 'article',
        },
        twitter: {
          title: 'SEO Best Practices',
          description: 'Learn SEO optimization',
          image: {_type: 'image', asset: {_ref: 'image-123', _type: 'reference'}, alt: 'Guide'},
          card: 'summary_large_image',
        },
      },
    },
    {
      _id: 'preview-post-2',
      _type: 'post',
      title: 'Advanced Analytics Strategy',
      slug: {current: 'advanced-analytics'},
      _updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      seo: {
        title: 'Advanced Analytics',
        description: 'Strategy tips',
        keywords: ['analytics', 'data'],
        openGraph: {
          title: 'Analytics Guide',
        },
      },
    },
    {
      _id: 'preview-page-1',
      _type: 'page',
      title: 'About Us',
      slug: {current: 'about'},
      _updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      seo: {
        title: 'About',
        keywords: ['company', 'team'],
        metaImage: {_type: 'image', asset: {_ref: 'image-456', _type: 'reference'}},
      },
    },
    {
      _id: 'preview-post-3',
      _type: 'post',
      title: 'Content Marketing Trends for 2024',
      slug: {current: 'content-marketing-trends'},
      _updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      seo: {
        title: 'Content Marketing Trends 2024',
        description:
          'Discover the latest content marketing trends and strategies to engage your audience effectively.',
        keywords: ['content marketing', 'trends', 'strategy', 'engagement'],
        metaImage: {_type: 'image', asset: {_ref: 'image-789', _type: 'reference'}},
        openGraph: {
          title: 'Content Marketing Trends 2024',
          description: 'Latest trends in content marketing',
          image: {_type: 'image', asset: {_ref: 'image-789', _type: 'reference'}, alt: 'Trends'},
          type: 'article',
        },
        twitter: {
          title: 'Content Marketing Trends',
          description: 'Discover the latest trends',
          card: 'summary',
        },
      },
    },
    {
      _id: 'preview-post-4',
      _type: 'product',
      title: 'Pro Plan',
      slug: {current: 'pro-plan'},
      _updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      seo: {
        title: 'Pro',
        keywords: ['pricing'],
      },
    },
    {
      _id: 'preview-page-2',
      _type: 'page',
      title: 'Contact',
      slug: {current: 'contact'},
      _updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      seo: {
        openGraph: {
          title: 'Get in Touch',
        },
      },
    },
    {
      _id: 'preview-post-5',
      _type: 'post',
      title: 'Mobile Optimization Guide',
      slug: {current: 'mobile-optimization'},
      _updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      seo: {
        title: 'Mobile Optimization Guide: Best Practices for Responsive Design',
        description:
          'Complete guide to mobile optimization including responsive design, performance tips, and user experience best practices for modern web development.',
        keywords: ['mobile', 'optimization', 'responsive', 'performance'],
        metaImage: {_type: 'image', asset: {_ref: 'image-mobile', _type: 'reference'}},
        openGraph: {
          title: 'Mobile Optimization Best Practices',
          description: 'Master mobile web optimization',
          image: {_type: 'image', asset: {_ref: 'image-mobile', _type: 'reference'}, alt: 'Mobile'},
          type: 'article',
        },
        twitter: {
          title: 'Mobile Optimization Tips',
          description: 'Responsive design best practices',
          image: {_type: 'image', asset: {_ref: 'image-mobile', _type: 'reference'}, alt: 'Mobile'},
          card: 'summary_large_image',
        },
      },
    },
  ]

  // Calculate health scores and return
  return dummyDocs.map((doc) => ({
    ...doc,
    health: calculateHealthScore(doc),
  }))
}

const VALIDATION_ENDPOINT = 'https://sanity-plugin-seofields.thehardik.in/api/validate-license'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

const SeoHealthDashboard = ({
  icon = '📊',
  title = 'SEO Health Dashboard',
  description = 'Monitor and optimize SEO fields across all your documents',
  showTypeColumn = true,
  showDocumentId = true,
  queryTypes,
  queryRequireSeo = true,
  customQuery,
  apiVersion = '2023-01-01',
  licenseKey,
  typeDisplayLabels,
  typeColumnMode = 'badge',
  titleField,
  getDocumentBadge,
  loadingLicense,
  loadingDocuments,
  noDocuments,
  previewMode = false,
  openInPane = false,
  structureTool,
  _deprecationWarnings,
  exportEnabled = true,
  exportFormats = ['csv', 'json'],
  compactStats = false,
}: SeoHealthDashboardProps): ReactElement => {
  const resolvedTypeLabels = typeDisplayLabels
  const resolvedDocBadge = getDocumentBadge

  // Deprecation warnings forwarded from the plugin config resolver
  const allDeprecationWarnings = useMemo(() => _deprecationWarnings ?? [], [_deprecationWarnings])

  // Group warnings by version so the banner renders one changelog link per release.
  const deprecationGroups = useMemo(() => {
    const groups = new Map<string, {version: string; changelogUrl: string; keys: string[]}>()
    for (const w of allDeprecationWarnings) {
      if (!groups.has(w.version)) {
        groups.set(w.version, {version: w.version, changelogUrl: w.changelogUrl, keys: []})
      }
      groups.get(w.version)!.keys.push(w.key)
    }
    return Array.from(groups.values())
  }, [allDeprecationWarnings])
  const client = useClient({apiVersion})
  const [licenseStatus, setLicenseStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')
  const [documents, setDocuments] = useState<DocumentWithSeoHealth[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>(() => {
    try {
      return localStorage.getItem('seo-dashboard-filter-status') ?? 'all'
    } catch {
      return 'all'
    }
  })
  const [filterType, setFilterType] = useState<string>(() => {
    try {
      return localStorage.getItem('seo-dashboard-filter-type') ?? 'all'
    } catch {
      return 'all'
    }
  })
  const [sortBy, setSortBy] = useState<'score' | 'title'>('score')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('seo-dashboard-page-size')
      return stored ? Number(stored) : 25
    } catch {
      return 25
    }
  })
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [activePopover, setActivePopover] = useState<{
    top: number
    left: number
    issues: string[]
  } | null>(null)

  // Theme state
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('seo-dashboard-theme')
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    } catch {
      // ignore
    }
    return 'system'
  })
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const resolvedTheme = (() => {
    if (themeMode === 'system') {
      return systemPrefersDark ? 'dark' : 'light'
    }
    return themeMode
  })()
  const currentVars = themeVars[resolvedTheme]

  const handleThemeChange = useCallback((mode: ThemeMode) => {
    setThemeMode(mode)
    try {
      localStorage.setItem('seo-dashboard-theme', mode)
    } catch {
      // ignore
    }
  }, [])

  const handleThemeChangeLight = useCallback(() => handleThemeChange('light'), [handleThemeChange])
  const handleThemeChangeDark = useCallback(() => handleThemeChange('dark'), [handleThemeChange])
  const handleThemeChangeSystem = useCallback(
    () => handleThemeChange('system'),
    [handleThemeChange],
  )

  const handleFilterStatusChange = useCallback((value: string) => {
    setFilterStatus(value)
    try {
      localStorage.setItem('seo-dashboard-filter-status', value)
    } catch {
      // ignore
    }
    setCurrentPage(1)
  }, [])

  const handleFilterTypeChange = useCallback((value: string) => {
    setFilterType(value)
    try {
      localStorage.setItem('seo-dashboard-filter-type', value)
    } catch {
      // ignore
    }
    setCurrentPage(1)
  }, [])

  const validateLicense = useCallback(
    async (forceRefresh = false) => {
      // Preview mode bypasses license validation
      if (previewMode) {
        setLicenseStatus('valid')
        return
      }

      // No key provided
      if (!licenseKey) {
        setLicenseStatus('invalid')
        return
      }

      const projectId = client.config().projectId ?? ''
      const cacheKey = `seofields_license_${projectId}`

      if (forceRefresh) {
        try {
          sessionStorage.removeItem(cacheKey)
        } catch {
          // ignore storage errors
        }
      }

      // Check sessionStorage cache
      if (!forceRefresh) {
        try {
          const cached = sessionStorage.getItem(cacheKey)
          if (cached) {
            const {valid, ts} = JSON.parse(cached) as {valid: boolean; ts: number}
            if (Date.now() - ts < CACHE_TTL_MS) {
              setLicenseStatus(valid ? 'valid' : 'invalid')
              return
            }
          }
        } catch {
          // ignore storage errors
        }
      }

      setLicenseStatus('loading')

      try {
        const res = await fetch(VALIDATION_ENDPOINT, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({licenseKey, projectId}),
        })
        const valid = res.ok
        setLicenseStatus(valid ? 'valid' : 'invalid')
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({valid, ts: Date.now()}))
        } catch {
          // ignore storage errors
        }
      } catch {
        // Network error — fail open to avoid blocking legitimate users
        setLicenseStatus('valid')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [licenseKey, previewMode],
  )

  useEffect(() => {
    validateLicense()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [licenseKey, previewMode])

  const handleMouseEnterIssues = (el: HTMLDivElement | null, issues: string[]) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const popoverWidth = 280
    const viewportWidth = window.innerWidth

    // Align popover left edge to trigger left edge, clamp within viewport
    let left = rect.left
    if (left + popoverWidth > viewportWidth - 10) left = viewportWidth - popoverWidth - 10
    if (left < 10) left = 10

    setActivePopover({top: rect.top, left, issues})
  }

  const JSONStringifiedQueryTypes = JSON.stringify(queryTypes)
  const JSONStringifiedTitleField = JSON.stringify(titleField)

  const fetchDocuments = useCallback(
    async (isManualRefresh = false) => {
      try {
        if (isManualRefresh) {
          setIsRefreshing(true)
        } else {
          setLoading(true)
        }

        // Use dummy data in preview mode
        if (previewMode) {
          setDocuments(generateDummyData())
          return
        }

        let groqQuery: string
        let params: Record<string, unknown> = {}

        if (customQuery) {
          // Mode 3: fully custom GROQ (user-provided)
          groqQuery = customQuery
        } else if (queryTypes && queryTypes.length > 0) {
          // Mode 2: filter by specific document types (excluding drafts)
          const seoFilter = queryRequireSeo ? ' && seo != null' : ''
          const titleProj = buildTitleProjection(titleField)
          groqQuery = `*[_type in $types${seoFilter} && !(_id in path("drafts.**"))]{
            _id,
            _type,
            ${titleProj},
            slug,
            seo,
            _updatedAt
          }`
          params = {types: queryTypes}
        } else {
          // Mode 1: default — all documents with an seo field (excluding drafts)
          const titleProj = buildTitleProjection(titleField)
          groqQuery = `*[seo != null && !(_id in path("drafts.**"))]{
            _id,
            _type,
            ${titleProj},
            slug,
            seo,
            _updatedAt
          }`
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await client.fetch(groqQuery, params, {perspective: 'published'})

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const docsWithHealth: DocumentWithSeoHealth[] = result.map((doc: any) => ({
          ...doc,
          health: calculateHealthScore(doc),
        }))

        setDocuments(docsWithHealth)
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
        setIsRefreshing(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      client,
      customQuery,
      queryRequireSeo,
      JSONStringifiedQueryTypes,
      JSONStringifiedTitleField,
      previewMode,
    ],
  )

  useEffect(() => {
    fetchDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    client,
    customQuery,
    queryRequireSeo,
    JSONStringifiedQueryTypes,
    JSONStringifiedTitleField,
    previewMode,
  ])

  const handleRefresh = useCallback(() => {
    fetchDocuments(true)
  }, [fetchDocuments])

  const uniqueDocumentTypes = useMemo(() => {
    const types = new Set(documents.map((doc) => doc._type))
    return Array.from(types).sort()
  }, [documents])

  const filteredAndSortedDocs = useMemo(() => {
    let filtered = documents

    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc._id?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((doc) => doc.health.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((doc) => doc._type === filterType)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'score') {
        return b.health.score - a.health.score
      }
      return (a.title || '').localeCompare(b.title || '')
    })

    return sorted
  }, [documents, searchQuery, filterStatus, filterType, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedDocs.length / pageSize))

  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredAndSortedDocs.slice(start, start + pageSize)
  }, [filteredAndSortedDocs, currentPage, pageSize])

  const handleExportCSV = useCallback(() => {
    const exportDocs = filteredAndSortedDocs
    const rows = exportDocs.map((doc) => ({
      id: doc._id,
      type: doc._type,
      title: typeof doc.title === 'string' ? doc.title : '',
      score: doc.health.score,
      status: doc.health.status,
      issues: doc.health.issues.join(' | '),
    }))
    const header = 'id,type,title,score,status,issues'
    const csvRows = rows.map((r) =>
      [
        r.id,
        r.type,
        `"${r.title.replace(/"/g, '""')}"`,
        r.score,
        r.status,
        `"${r.issues.replace(/"/g, '""')}"`,
      ].join(','),
    )
    const csv = [header, ...csvRows].join('\n')
    const blob = new Blob([csv], {type: 'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'seo-health-export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredAndSortedDocs])

  const handleExportJSON = useCallback(() => {
    const exportDocs = filteredAndSortedDocs
    const blob = new Blob([JSON.stringify(exportDocs, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'seo-health-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredAndSortedDocs])

  const stats = useMemo(() => {
    const total = documents.length
    const excellent = documents.filter((d) => d.health.score >= 80).length
    const good = documents.filter((d) => d.health.score >= 60 && d.health.score < 80).length
    const fair = documents.filter((d) => d.health.score >= 40 && d.health.score < 60).length
    const poor = documents.filter((d) => d.health.score > 0 && d.health.score < 40).length
    const missing = documents.filter((d) => d.health.score === 0).length

    const avgScore =
      total > 0 ? Math.round(documents.reduce((sum, d) => sum + d.health.score, 0) / total) : 0

    return {total, excellent, good, fair, poor, missing, avgScore}
  }, [documents])

  const handleMouseLeave = useCallback(() => {
    setActivePopover(null)
  }, [])

  // Reset to page 1 whenever filters, search, or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus, filterType, sortBy])

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isEditable =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (e.key === '/' && !isEditable) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const renderDashboardContent = () => (
    <>
      {/* Header */}
      <PageHeader>
        <div>
          <PageTitle>
            <span>
              {icon} {title}
            </span>
            {previewMode && <PreviewBadge>Preview Mode</PreviewBadge>}
          </PageTitle>
          <PageSubtitle>{description}</PageSubtitle>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0}}>
          <ThemeSwitcher>
            <ThemeButton
              $theme="light"
              $active={themeMode === 'light'}
              onClick={handleThemeChangeLight}
              title="Light theme"
            >
              <SunIcon />
            </ThemeButton>
            <ThemeButton
              $theme="dark"
              $active={themeMode === 'dark'}
              onClick={handleThemeChangeDark}
              title="Dark theme"
            >
              <MoonIcon />
            </ThemeButton>
            <ThemeButton
              $theme="system"
              $active={themeMode === 'system'}
              onClick={handleThemeChangeSystem}
              title="System default"
            >
              <MonitorIcon />
            </ThemeButton>
          </ThemeSwitcher>
          <DashboardRefreshButton
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            $spinning={isRefreshing}
            title="Refresh documents"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </DashboardRefreshButton>
        </div>
      </PageHeader>
      {/* Deprecation warning banner */}
      {deprecationGroups.length > 0 && (
        <DeprecationBanner>
          <strong>⚠️ Deprecated config keys detected:</strong>{' '}
          {deprecationGroups.map((group, gi) => (
            <span key={group.version}>
              {group.keys.map((w, i) => (
                <span key={w}>
                  <code style={{background: '#fef9c3', padding: '1px 4px', borderRadius: 3}}>
                    {w.split('→')[0].trim()}
                  </code>
                  {' → '}
                  <code style={{background: '#dcfce7', padding: '1px 4px', borderRadius: 3}}>
                    {w.split('→')[1].trim()}
                  </code>
                  {i < group.keys.length - 1 ? ' · ' : ''}
                </span>
              ))}{' '}
              (
              <DeprecationBannerLink
                href={group.changelogUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {group.version} changelog
              </DeprecationBannerLink>
              ){gi < deprecationGroups.length - 1 ? ' · ' : ''}
            </span>
          ))}{' '}
          — Please update your config.
        </DeprecationBanner>
      )}
      {/* Stats */}
      {!loading && compactStats && (
        <StatsRow>
          <StatPill>📋 {stats.total}</StatPill>
          <StatPill>🟢 Excellent: {stats.excellent}</StatPill>
          <StatPill>🟡 Good: {stats.good}</StatPill>
          <StatPill>🟠 Fair: {stats.fair}</StatPill>
          <StatPill>🔴 Poor/Missing: {stats.poor + stats.missing}</StatPill>
          <StatPill>📊 Avg: {stats.avgScore}%</StatPill>
          <StatPill>🗂️ Types: {uniqueDocumentTypes.length}</StatPill>
        </StatsRow>
      )}
      {/* Stats Grid */}
      {!loading && !compactStats && (
        <StatsGrid>
          <StatCard>
            <StatLabel>Total Docs</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Avg Score</StatLabel>
            <StatValue>{stats.avgScore}%</StatValue>
          </StatCard>
          <StatCard $accent="#10b981">
            <StatLabel>Excellent (80+)</StatLabel>
            <StatValue>{stats.excellent}</StatValue>
          </StatCard>
          <StatCard $accent="#f59e0b">
            <StatLabel>Good (60–79)</StatLabel>
            <StatValue>{stats.good}</StatValue>
          </StatCard>
          <StatCard $accent="#f97316">
            <StatLabel>Fair (40–59)</StatLabel>
            <StatValue>{stats.fair}</StatValue>
          </StatCard>
          <StatCard $accent="#ef4444">
            <StatLabel>Poor / Missing</StatLabel>
            <StatValue>{stats.poor + stats.missing}</StatValue>
          </StatCard>
        </StatsGrid>
      )}
      {/* Controls */}
      <ControlsBar>
        <SearchWrapper>
          <SearchIconSvg>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </SearchIconSvg>
          <SearchInput
            ref={searchInputRef}
            placeholder="Search documents... (press / to focus)"
            value={searchQuery}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(e: {currentTarget: HTMLInputElement}) =>
              setSearchQuery(e.currentTarget.value)
            }
          />
        </SearchWrapper>
        <StyledSelect
          value={filterStatus}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e: {currentTarget: HTMLSelectElement}) =>
            handleFilterStatusChange(e.currentTarget.value)
          }
        >
          <option value="all">All Status</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
          <option value="missing">Missing</option>
        </StyledSelect>
        {uniqueDocumentTypes.length > 1 && (
          <StyledSelect
            value={filterType}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(e: {currentTarget: HTMLSelectElement}) =>
              handleFilterTypeChange(e.currentTarget.value)
            }
          >
            <option value="all">All Types</option>
            {uniqueDocumentTypes.map((type) => (
              <option key={type} value={type}>
                {resolveTypeLabel(type, resolvedTypeLabels)}
              </option>
            ))}
          </StyledSelect>
        )}
        <StyledSelect
          value={sortBy}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e: {currentTarget: HTMLSelectElement}) =>
            setSortBy(e.currentTarget.value as 'score' | 'title')
          }
        >
          <option value="score">Sort by Score</option>
          <option value="title">Sort by Title</option>
        </StyledSelect>
        {exportEnabled && exportFormats.includes('csv') && (
          <ExportButton onClick={handleExportCSV} title="Export all filtered as CSV">
            ⬇ CSV
          </ExportButton>
        )}
        {exportEnabled && exportFormats.includes('json') && (
          <ExportButton onClick={handleExportJSON} title="Export all filtered as JSON">
            ⬇ JSON
          </ExportButton>
        )}
      </ControlsBar>
      {/* Documents Table */}
      <TableCard>
        {loading && (
          <LoadingState>
            <Spinner />
            {loadingDocuments ?? 'Loading documents…'}
          </LoadingState>
        )}
        {!loading &&
          (filteredAndSortedDocs.length === 0 ? (
            <EmptyState>{noDocuments ?? 'No documents found'}</EmptyState>
          ) : (
            <>
              <TableHeader>
                <ColTitle>Title</ColTitle>
                {showTypeColumn && <ColType>Type</ColType>}
                <ColScore>Score</ColScore>
                <ColIssues>Top Issues</ColIssues>
              </TableHeader>
              {paginatedDocs.map((doc) => {
                return (
                  <TableRow key={doc._id}>
                    <ColTitle>
                      <TitleWrapper>
                        <TitleCell>
                          {doc.title !== null && typeof doc.title !== 'string' ? (
                            <NonStringTitleWarning title="title is not a string — use pt::text(title) in your query.groq projection to convert Portable Text to a plain string">
                              ⚠ title is not a string — use pt::text(title) in query.groq
                            </NonStringTitleWarning>
                          ) : (
                            <>
                              {openInPane ? (
                                <DocTitleAnchorPane id={doc._id} type={doc._type}>
                                  {typeof doc.title === 'string'
                                    ? doc.title || 'Untitled'
                                    : 'Untitled'}
                                </DocTitleAnchorPane>
                              ) : (
                                <DocTitleAnchor
                                  id={doc._id}
                                  type={doc._type}
                                  structureTool={structureTool}
                                >
                                  {typeof doc.title === 'string'
                                    ? doc.title || 'Untitled'
                                    : 'Untitled'}
                                </DocTitleAnchor>
                              )}
                            </>
                          )}
                          {showDocumentId && <DocId>{doc._id}</DocId>}
                          {resolvedDocBadge && (
                            <DocBadgeRenderer
                              doc={doc as DocumentWithSeoHealth & Record<string, unknown>}
                              docBadge={resolvedDocBadge}
                            />
                          )}
                        </TitleCell>
                      </TitleWrapper>
                    </ColTitle>
                    {showTypeColumn && (
                      <ColType>
                        {typeColumnMode === 'text' ? (
                          <TypeText>{resolveTypeLabel(doc._type, resolvedTypeLabels)}</TypeText>
                        ) : (
                          (() => {
                            const typeColor = getTypeColor(doc._type)
                            return (
                              <TypeBadge $bgColor={typeColor.bg} $textColor={typeColor.text}>
                                {resolveTypeLabel(doc._type, resolvedTypeLabels)}
                              </TypeBadge>
                            )
                          })()
                        )}
                      </ColType>
                    )}
                    <ColScore>
                      <ScoreBadge $score={doc.health.score}>{doc.health.score}%</ScoreBadge>
                    </ColScore>
                    <ColIssues>
                      {doc.health.issues.slice(0, 2).map((issue) => (
                        <IssueTag key={`issue-${doc._id}-${issue}`}>• {issue}</IssueTag>
                      ))}
                      {doc.health.issues.length > 2 && (
                        <MoreIssuesWrapper
                          // eslint-disable-next-line react/jsx-no-bind
                          onMouseEnter={function (e: {currentTarget: HTMLDivElement}) {
                            handleMouseEnterIssues(
                              e.currentTarget as HTMLDivElement,
                              doc.health.issues.slice(2),
                            )
                          }}
                          onMouseLeave={handleMouseLeave}
                        >
                          <MoreIssues>+{doc.health.issues.length - 2} more issues</MoreIssues>
                        </MoreIssuesWrapper>
                      )}
                    </ColIssues>
                  </TableRow>
                )
              })}
              <PaginationBar>
                <span>
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredAndSortedDocs.length)}
                  –{Math.min(currentPage * pageSize, filteredAndSortedDocs.length)} of{' '}
                  {filteredAndSortedDocs.length} documents
                </span>
                <PaginationCenter>
                  <PaginationButton
                    disabled={currentPage === 1}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    title="Previous page"
                  >
                    ‹
                  </PaginationButton>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <PaginationButton
                    disabled={currentPage >= totalPages}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    title="Next page"
                  >
                    ›
                  </PaginationButton>
                </PaginationCenter>
                <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                  <span>Per page:</span>
                  <StyledSelect
                    value={pageSize}
                    style={{height: 30, fontSize: 12, padding: '0 28px 0 8px'}}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={(e: {currentTarget: HTMLSelectElement}) => {
                      const size = Number(e.currentTarget.value)
                      setPageSize(size)
                      try {
                        localStorage.setItem('seo-dashboard-page-size', String(size))
                      } catch {
                        // ignore
                      }
                      setCurrentPage(1)
                    }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </StyledSelect>
                </div>
              </PaginationBar>
            </>
          ))}
      </TableCard>
      {/* Single shared popover rendered outside the table */}
      {activePopover && (
        <IssuesPopover
          style={{
            top: activePopover.top,
            left: activePopover.left,
            transform: 'translateY(calc(-100% - 10px))',
          }}
        >
          {activePopover.issues.map((issue) => (
            <PopoverIssueItem key={issue}>⚠️ {issue}</PopoverIssueItem>
          ))}
        </IssuesPopover>
      )}
    </>
  )

  return (
    <DashboardContainer style={currentVars as CSSProperties}>
      {licenseStatus === 'loading' && <RenderLicenseLoading text={loadingLicense} />}
      {licenseStatus === 'invalid' && (
        <RenderLicenseInvalid licenseKey={licenseKey} validateLicense={validateLicense} />
      )}
      {licenseStatus === 'valid' && renderDashboardContent()}
    </DashboardContainer>
  )
}

export default SeoHealthDashboard
