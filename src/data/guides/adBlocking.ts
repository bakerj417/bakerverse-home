/**
 * Data for /guides/ad-blocking. Every address, price, URL and date the
 * page shows lives here so there is one place to recheck before publish.
 */

/**
 * TODO(joseph): PUBLISH SWITCH. While false the page is served with
 * `noindex, nofollow`. When you are ready to publish, flip this to true,
 * then add the page to the nav/footer and the sitemap by hand.
 * The page is deliberately NOT linked from the nav or footer yet.
 */
export const GUIDE_IS_PUBLISHED = false;

export const GUIDE_PATH = '/guides/ad-blocking';

/** Last time the copy and facts were reviewed. */
export const GUIDE_UPDATED_ISO = '2026-11-23';
export const GUIDE_UPDATED_LABEL = 'November 23, 2026';

/** Placeholder values only. Never put real addresses or names here. */
export const PLACEHOLDERS = {
  tailnetIp: '100.x.y.z',
  lanIp: '192.168.1.x',
  tailnetName: 'demo-tailnet',
} as const;

export const ADGUARD_DNS = {
  /** Default (blocks ads and trackers). */
  primary: '94.140.14.14',
  secondary: '94.140.15.15',
  /** Family protection (also blocks adult content). */
  familyPrimary: '94.140.14.15',
  familySecondary: '94.140.15.16',
  /** Non-filtering. Do NOT use as a Tailscale nameserver for ad blocking. */
  nonFilteringPrimary: '94.140.14.140',
  nonFilteringSecondary: '94.140.14.141',
  dohUrl: 'https://dns.adguard-dns.com/dns-query',
} as const;

/** A domain that ad-blocking DNS lists block. Used in verify steps. */
export const TEST_DOMAIN = 'doubleclick.net';

export const LIMITS = {
  /** UNVERIFIED. Recheck on the NextDNS pricing page before publishing. */
  nextDnsFreeQueriesPerMonth: '300,000',
  /** Recheck at publish. */
  tailscalePersonalUsers: 6,
} as const;

export const COSTS = {
  pathA: '$0',
  pathB: 'Hardware you already own, or a few dollars a month for a small cloud server',
  pathC: '$0 if you already have the NAS',
  pathD: '$0',
} as const;

export const URLS = {
  tailscaleDns: 'https://tailscale.com/kb/1054/dns',
  tailscalePiHole: 'https://tailscale.com/kb/1114/pi-hole',
  tailscalePricing: 'https://tailscale.com/pricing',
  tailscaleDownload: 'https://tailscale.com/download',
  tailscaleOtherVpns: 'https://tailscale.com/docs/reference/faq/other-vpns',
  tailscaleExitNodes: 'https://tailscale.com/kb/1103/exit-nodes',
  tailscaleSubnets: 'https://tailscale.com/kb/1019/subnets',
  tailscaleAcls: 'https://tailscale.com/kb/1018/acls',
  tailscaleKeyExpiry: 'https://tailscale.com/kb/1028/key-expiry',
  tailscaleAdminDns: 'https://login.tailscale.com/admin/dns',
  tailscaleNextDns: 'https://tailscale.com/docs/integrations/nextdns',
  tailscaleControlD: 'https://tailscale.com/blog/controld',
  adguardPublicDns: 'https://adguard-dns.io/en/public-dns.html',
  adguardHomeStart: 'https://adguard-dns.io/kb/adguard-home/getting-started/',
  adguardHomeDocker: 'https://hub.docker.com/r/adguard/adguardhome',
  /** Third-party test page. Not checked for accuracy by me. */
  blockTestPage: 'https://d3ward.github.io/toolz/adblock.html',
} as const;

export type PathId = 'a' | 'b' | 'c' | 'd';

const NOT_TESTED = 'Not tested by me yet. Steps are from the official docs.';

/**
 * Per-path test status. When a path is tested, set `testedOn` and
 * `versions` and leave `status` as the formatted line.
 */
export interface PathStatus {
  readonly testedOn: string | null;
  readonly versions: string | null;
}

export const PATH_STATUS: Readonly<Record<PathId, PathStatus>> = {
  a: { testedOn: null, versions: null },
  b: { testedOn: null, versions: null },
  c: { testedOn: null, versions: null },
  d: { testedOn: null, versions: null },
};

export function statusLine(id: PathId): string {
  const { testedOn, versions } = PATH_STATUS[id];
  if (!testedOn) return NOT_TESTED;
  return `Tested on ${testedOn}${versions ? ` (${versions})` : ''}.`;
}

export const CHANGELOG = [
  {
    iso: '2026-11-23',
    label: 'November 23, 2026',
    note: 'First draft. No path has been tested yet.',
  },
] as const;

export interface ComparisonRow {
  readonly id: PathId;
  readonly name: string;
  readonly cost: string;
  readonly time: string;
  readonly hardware: string;
  readonly away: string;
  readonly privacy: string;
}

export const COMPARISON: readonly ComparisonRow[] = [
  {
    id: 'a',
    name: 'A. No hardware',
    cost: COSTS.pathA,
    time: 'About 15 minutes',
    hardware: 'None',
    away: 'Yes, on every device with Tailscale',
    privacy: 'AdGuard DNS sees your lookups',
  },
  {
    id: 'b',
    name: 'B. Your own AdGuard Home',
    cost: COSTS.pathB,
    time: 'About an hour',
    hardware: 'Any always-on box',
    away: 'Yes, on every device with Tailscale',
    privacy: 'Lookups stay with you and your chosen upstream',
  },
  {
    id: 'c',
    name: 'C. On a NAS',
    cost: COSTS.pathC,
    time: 'One to two hours',
    hardware: 'A NAS that runs Docker',
    away: 'Yes, with Tailscale on the NAS',
    privacy: 'Lookups stay with you and your chosen upstream',
  },
  {
    id: 'd',
    name: 'D. Home only',
    cost: COSTS.pathD,
    time: 'About 15 minutes',
    hardware: 'None, or the box from B or C',
    away: 'No',
    privacy: 'Depends on what the router points at',
  },
];
