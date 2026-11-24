/**
 * Data for /guides/ad-blocking. Every address, price, URL and date the
 * page shows lives here so there is one place to recheck before publish.
 */

/**
 * PUBLISH SWITCH. While false the page is served with `noindex, nofollow`.
 * Published 2026-11-23: linked from the footer. (No sitemap: the sitemap
 * integration is disabled in astro.config.mjs until the Astro 5 upgrade.)
 */
export const GUIDE_IS_PUBLISHED = true;

export const GUIDE_PATH = '/guides/ad-blocking';

/** Last time the copy and facts were reviewed. */
export const GUIDE_UPDATED_ISO = '2026-11-23';
export const GUIDE_UPDATED_LABEL = 'November 23, 2026';

/** Placeholder values only. Never put real addresses or names here. */
export const PLACEHOLDERS = {
  tailnetIp: '100.x.y.z',
  lanIp: '192.168.1.x',
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
  /** Default (filtering) IPv6 addresses. Optional. */
  ipv6Primary: '2a10:50c0::ad1:ff',
  ipv6Secondary: '2a10:50c0::ad2:ff',
  dohUrl: 'https://dns.adguard-dns.com/dns-query',
} as const;

/** A domain that ad-blocking DNS lists block. Used in verify steps. */
export const TEST_DOMAIN = 'doubleclick.net';

export const LIMITS = {
  /** Recheck on the NextDNS pricing page before publishing. */
  nextDnsFreeQueriesPerMonth: '300,000',
  /** Recheck at publish. */
  tailscalePersonalUsers: 6,
} as const;

/** Pinned AdGuard Home image tag. Recheck on Docker Hub at publish. */
export const ADGUARD_HOME_IMAGE_TAG = 'v0.107.80';

export const COSTS = {
  pathA: '$0',
  pathB: 'Hardware you already own',
  pathC: '$0 if you already have the NAS',
  pathD: '$0',
} as const;

export const URLS = {
  tailscaleDns: 'https://tailscale.com/docs/reference/dns-in-tailscale',
  tailscalePiHole: 'https://tailscale.com/docs/solutions/block-ads-all-devices-anywhere-using-raspberry-pi',
  tailscalePricing: 'https://tailscale.com/pricing',
  tailscaleDownload: 'https://tailscale.com/download',
  tailscaleOtherVpns: 'https://tailscale.com/docs/reference/faq/other-vpns',
  tailscaleExitNodes: 'https://tailscale.com/docs/features/exit-nodes',
  tailscaleSubnets: 'https://tailscale.com/docs/features/subnet-routers',
  tailscaleAcls: 'https://tailscale.com/docs/features/access-control/acls',
  tailscaleKeyExpiry: 'https://tailscale.com/docs/features/access-control/key-expiry',
  tailscaleClientPrefs: 'https://tailscale.com/docs/features/client/manage-preferences',
  tailscaleAdminDns: 'https://login.tailscale.com/admin/dns',
  tailscaleNextDns: 'https://tailscale.com/docs/integrations/nextdns',
  tailscaleControlD: 'https://tailscale.com/blog/controld',
  adguardPublicDns: 'https://adguard-dns.io/en/public-dns.html',
  adguardCheckPage: 'https://adguard-dns.io/en/support/make_sure.html',
  adguardPrivateRelay: 'https://adguard-dns.io/kb/private-dns/solving-problems/icloud-private-relay/',
  nextDnsPricing: 'https://nextdns.io/pricing',
  adguardHomeStart: 'https://adguard-dns.io/kb/adguard-home/getting-started/',
  adguardHomeDocker: 'https://hub.docker.com/r/adguard/adguardhome',
  /** Third-party test page. Optional; not checked for accuracy by me. */
  blockTestPage: 'https://d3ward.github.io/toolz/adblock.html',
} as const;

export type PathId = 'a' | 'b' | 'c' | 'd';

/** Tailscale version used in the Linux container test. */
export const TAILSCALE_TESTED_VERSION = 'v1.104.7';

/** Result of the mixed filtering and non-filtering nameserver test. */
export const MIXED_TEST = { blocked: 7, total: 20 } as const;

/** Date of the live lookups and the container sandbox test. */
export const TESTED_ISO = '2026-11-23';

export const PAGE_STATUS_LINE = `Written from the official docs. The Tailscale DNS settings steps were tested in a Linux test setup, not on real phones or laptops. The AdGuard Home steps were tested in a container sandbox on ${TESTED_ISO} (see each path). When in doubt, follow the official docs.`;

const ADGUARD_HOME_TESTED =
  'a blocked ad address answered 0.0.0.0, a normal site answered normally, an allow-list rule made the blocked site load, removing the rule blocked it again, and removing the container closed the port.';

/** Per-path test label. Update the text and date here when a path is tested. */
export const PATH_STATUS: Readonly<Record<PathId, string>> = {
  a: `Tested on ${TESTED_ISO}: the DNS settings steps, in a Linux test setup (Tailscale ${TAILSCALE_TESTED_VERSION} in a container, on a throwaway tailnet). With AdGuard's two filtering servers as global nameservers and Override DNS servers on, a blocked ad address answered 0.0.0.0 on 20 of 20 lookups. Turning the settings off again stopped the blocking, so undoing works. Not tested: real phones or laptops (iOS, Android, macOS, Windows), and Override off on a normal device. Those steps are from the official docs. The AdGuard public DNS addresses were also checked with a live lookup on ${TESTED_ISO}: a blocked ad address answered 0.0.0.0, the non-filtering address returned real addresses.`,
  b: `The AdGuard Home part (setup, blocking, allow-listing a site, removing it) was tested in a container on ${TESTED_ISO}: ${ADGUARD_HOME_TESTED} The Tailscale parts of this path (a home AdGuard Home as the nameserver) are from the official docs and not tested by me.`,
  c: `The AdGuard Home part (setup, blocking, allow-listing a site, removing it) was tested in a container on ${TESTED_ISO}, with port mapping, NOT with host networking or on a NAS: ${ADGUARD_HOME_TESTED} Host networking, the NAS specifics and the Tailscale parts are from the docs, not tested.`,
  d: 'Not tested by me. Steps are from the official docs and general router knowledge.',
};

export function statusLine(id: PathId): string {
  return PATH_STATUS[id];
}

export const CHANGELOG = [
  {
    iso: '2026-11-23',
    label: 'November 23, 2026',
    note: 'First draft, written from the official docs.',
  },
  {
    iso: '2026-11-23',
    label: 'November 23, 2026',
    note: 'Fact-check pass: safer cloud-box steps, first-aid box, parallel DNS behaviour, reverse steps.',
  },
  {
    iso: TESTED_ISO,
    label: 'November 23, 2026',
    note: 'Tailscale DNS settings tested in a Linux test setup; labels updated.',
  },
  {
    iso: TESTED_ISO,
    label: 'November 23, 2026',
    note: 'Labels made precise: AdGuard public DNS addresses checked live; AdGuard Home tested in a container sandbox.',
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
    privacy: 'Mostly your box; some lookups go to the fallback',
  },
  {
    id: 'c',
    name: 'C. On a NAS',
    cost: COSTS.pathC,
    time: 'One to two hours',
    hardware: 'A NAS that runs Docker',
    away: 'Yes, with Tailscale on the NAS',
    privacy: 'Mostly your box; some lookups go to the fallback, if you add one',
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
