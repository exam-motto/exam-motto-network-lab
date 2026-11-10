/** Pure networking arithmetic for the Exam-Motto Network Lab. No dependencies. */

export function parseIPv4(value) {
  if (typeof value !== 'string' || !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value.trim())) throw new Error('Enter a valid IPv4 address (four octets).');
  const octets = value.trim().split('.').map(Number);
  if (octets.some(n => n > 255)) throw new Error('Each IPv4 octet must be 0–255.');
  return octets.reduce((acc, n) => (acc * 256) + n, 0) >>> 0;
}
export function formatIPv4(value) {
  const v = value >>> 0;
  return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join('.');
}
export function calcIPv4(cidr) {
  if (typeof cidr !== 'string') throw new Error('Enter an IPv4 address and prefix.');
  const bits = cidr.trim().split('/');
  if (bits.length !== 2 || !/^\d{1,2}$/.test(bits[1])) throw new Error('Use the format 192.168.14.77/27.');
  const prefix = Number(bits[1]);
  if (prefix < 0 || prefix > 32) throw new Error('IPv4 prefix must be between 0 and 32.');
  const ip = parseIPv4(bits[0]);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32-prefix);
  const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(0, total - 2);
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  return {
    input: `${formatIPv4(ip)}/${prefix}`,
    prefix, network: formatIPv4(network), mask: formatIPv4(mask),
    broadcast: formatIPv4(broadcast), total, usable,
    first: formatIPv4(first), last: formatIPv4(last),
    note: prefix === 31 ? 'Point-to-point /31: both addresses may be used under RFC 3021.' :
      prefix === 32 ? '/32: one host address, not a conventional multi-host subnet.' :
      'For ordinary IPv4 subnets, exclude the network and broadcast addresses.'
  };
}

/** Parse standard hexadecimal IPv6 notation, including :: compression. */
export function parseIPv6(value) {
  if (typeof value !== 'string') throw new Error('Enter an IPv6 address.');
  const s = value.trim().toLowerCase();
  if (!s || s.includes('%') || s.includes('.') || !/^[\da-f:]+$/.test(s)) throw new Error('Enter hexadecimal IPv6 notation (no zone ID or embedded IPv4).');
  if ((s.match(/::/g) || []).length > 1 || s.includes(':::')) throw new Error('IPv6 address contains invalid compression.');
  const hasGap = s.includes('::');
  const pieces = hasGap ? s.split('::') : [s];
  if (pieces.length > 2) throw new Error('Invalid IPv6 compression.');
  const parseSide = t => !t ? [] : t.split(':');
  const before = parseSide(pieces[0]);
  const after = hasGap ? parseSide(pieces[1]) : [];
  const groups = [...before, ...after];
  if (groups.some(g => !/^[\da-f]{1,4}$/.test(g))) throw new Error('Each IPv6 group must contain 1–4 hexadecimal digits.');
  const omitted = 8 - groups.length;
  if ((!hasGap && groups.length !== 8) || (hasGap && omitted < 1)) throw new Error('IPv6 address must expand to exactly eight groups.');
  const expanded = [...before, ...Array(hasGap ? omitted : 0).fill('0'), ...after].map(g => parseInt(g, 16));
  let bits = 0n;
  for (const g of expanded) bits = (bits << 16n) | BigInt(g);
  return bits;
}
export function formatIPv6(bits) {
  const chunks = Array.from({length: 8}, (_, i) => Number((bits >> BigInt((7-i)*16)) & 0xffffn));
  let bestStart = -1, bestLen = 0;
  for (let i = 0; i < 8;) {
    if (chunks[i] !== 0) { i++; continue; }
    let j = i; while (j < 8 && chunks[j] === 0) j++;
    if (j-i > bestLen && j-i >= 2) { bestStart = i; bestLen = j-i; }
    i = j;
  }
  if (bestStart < 0) return chunks.map(n=>n.toString(16)).join(':');
  const left = chunks.slice(0, bestStart).map(n=>n.toString(16)).join(':');
  const right = chunks.slice(bestStart + bestLen).map(n=>n.toString(16)).join(':');
  return `${left}::${right}`;
}
export function calcIPv6Membership(networkCidr, candidate) {
  if (typeof networkCidr !== 'string' || networkCidr.split('/').length !== 2) throw new Error('Enter an IPv6 prefix like 2001:db8:12:34::/64.');
  const [base, rawPrefix] = networkCidr.trim().split('/');
  if (!/^\d{1,3}$/.test(rawPrefix)) throw new Error('IPv6 prefix must be 0–128.');
  const prefix = Number(rawPrefix);
  if (prefix > 128) throw new Error('IPv6 prefix must be 0–128.');
  const baseBits = parseIPv6(base);
  const hostBits = parseIPv6(candidate);
  const mask = prefix === 0 ? 0n : ((1n << BigInt(prefix)) - 1n) << BigInt(128-prefix);
  const network = baseBits & mask;
  const candidateNetwork = hostBits & mask;
  return { prefix, network: formatIPv6(network), candidate: formatIPv6(hostBits), match: network === candidateNetwork,
    explanation: `Compare the first ${prefix} bits of both addresses. The candidate's masked prefix is ${formatIPv6(candidateNetwork)}/${prefix}; the reference prefix is ${formatIPv6(network)}/${prefix}.` };
}
