# Exam-Motto Network Address Lab

A free, dependency-free **IPv4 CIDR subnet calculator** and **IPv6 prefix membership checker** for networking learners.

**Try the full learning experience:** [Exam-Motto's CompTIA Network+ guide and study tools](https://exam-motto.com/exam/comptia-network-plus/).

## What it does

- Calculates IPv4 network address, subnet mask, broadcast address, first/last hosts, and usable host counts.
- Handles `/0`, `/31` point-to-point links (RFC 3021), and `/32` single-address cases.
- Checks whether an IPv6 address belongs to a prefix, including compressed addresses.
- Shows the network mask comparison to explain the result.
- Runs entirely in your browser; no sign-in, backend, analytics, or API keys.

## Run locally

Clone or download this repository, then run a local HTTP server in the folder:

```bash
python -m http.server 8000
```

Open http://localhost:8000 in a browser. (ES modules require HTTP; simply double-clicking `index.html` may not work.)

To run the automated calculation tests (Node.js 20+):

```bash
npm test
```

## Publish for free on GitHub Pages

1. Create a **public** GitHub repository named `exam-motto-network-lab`.
2. Upload the files **from this directory into the repository root** (do not upload the ZIP as a single file).
3. Go to **Settings → Pages**.
4. Set **Build and deployment → Deploy from a branch → main / (root)** and save.
5. Check the published GitHub Pages URL and test the IPv4 and IPv6 inputs.

## Known limitations

This example intentionally rejects IPv4-embedded IPv6 notation (e.g. `::ffff:192.0.2.1`), zone IDs (e.g. `%eth0`), and addresses with invalid groups. It performs static network calculations, not network probing or Cisco router simulation. It is not affiliated with CompTIA or Cisco and does not contain real exam questions.

## Contributing

Bug reports, example cases, corrections, and accessible UI improvements are welcome. Please do not submit proprietary or leaked certification exam content.

## License

MIT — see [LICENSE](LICENSE).
