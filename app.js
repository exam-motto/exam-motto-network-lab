import { calcIPv4, calcIPv6Membership } from './network.js';
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function renderRows(rows) { return `<dl>${rows.map(([k,v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`; }
document.getElementById('ipv4-form').addEventListener('submit', event => {
  event.preventDefault();
  const out = document.getElementById('ipv4-result');
  try {
    const r = calcIPv4(document.getElementById('ipv4').value);
    out.innerHTML = renderRows([['Normalized input',r.input],['Subnet mask',r.mask],['Network address',r.network],['Broadcast address',r.broadcast],['Total addresses',r.total],['Usable addresses',r.usable],['Host range',`${r.first} — ${r.last}`]]) + `<p>${esc(r.note)}</p>`;
  } catch(e) { out.textContent = `Input error: ${e.message}`; }
});
document.getElementById('ipv6-form').addEventListener('submit', event => {
  event.preventDefault();
  const out = document.getElementById('ipv6-result');
  try {
    const r = calcIPv6Membership(document.getElementById('ipv6-net').value, document.getElementById('ipv6-candidate').value);
    out.innerHTML = `<p class="result">${r.match ? 'Yes — same IPv6 network' : 'No — different IPv6 network'}</p>` + renderRows([['Reference network',`${r.network}/${r.prefix}`],['Candidate address',r.candidate],['Explanation',r.explanation]]);
  } catch(e) { out.textContent = `Input error: ${e.message}`; }
});
