# Troubleshooting connection, keys and refusals

When a call fails, mttr answers in words that say why, and most say what to do next. Over MCP an error comes back as the tool's text with `isError` set; over the API it is `error` in the JSON body. Find the words below. `example.com` stands for the person's site.

## Check the connection first

Before you change any settings, see what the server says. mttr's MCP endpoint takes one JSON-RPC message in each POST, as the MCP transport spec sets out:

```
curl -s https://mttr.si/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer $MTTR_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

- **A list of tools** means the server is reachable. With no key the list still comes back: a keyless agent may list the tools and call `mttr_signup`, and nothing else.
- **Then a call that needs a key:** `"method":"tools/call","params":{"name":"mttr_rules","arguments":{}}`. A rulebook means the key works. "mttr needs a key for that" means it does not (see below).

Never paste the key into a file, a commit or a log to test this. Read it from the environment, as above.

## Symptoms, causes and fixes

| What you see | Likely cause | What to do |
|---|---|---|
| "mttr needs a key for that. Sign your person up first with mttr_signup, then connect again with the key it gives." | No key was sent, or the key was not recognized. A mistyped, cut-off or rotated key is treated as no key | Check the header reads `Authorization: Bearer mk_` and then the whole key. If the person rotated it, they need the new one. With no key at all, `mttr_signup({ email })` with their leave |
| HTTP 401 "That access token has expired or was revoked. Refresh it, or connect again." | A sign-in token (not a key) lapsed | Let the client refresh it, or connect again |
| HTTP 401 "Sign in to mttr to use it." | The client connected with no credentials where sign-in is asked for | Connect with the person's key as a bearer token |
| "This key already has an account." | `mttr_signup` was called with a working key | Nothing to do: the key is connected |
| "Too many sign-ups from here." | Several sign-ups from one address in a short time | Wait the minutes it says |
| "That part of a site is kept for the key that claimed it." | A tool for claimed sites, called on a site this key has not claimed | `mttr_claim({ site })`, put up the record or file, then `mttr_claim_check({ site })`. Or keep to the public tools |
| "This key reaches only the sites claimed with it." | A call that reads across every site, which a person's key may not make | Use the calls for one site |
| "mttr has no public report of that site yet." | mttr never read it, or its read was a draft or was refused | `mttr_rescan({ site, reason: "first read" })`, then `mttr_job({ id })` |
| "example.com was read too recently. Ask again after the time in allowedAt." | A read in the last ten minutes | Wait until `allowedAt`. Use the read you have meanwhile |
| "That is enough new reads of sites not yet claimed for this hour." | The hourly allowance for reading unclaimed sites is spent | Wait an hour, or claim the site: a claimed site is read whenever asked |
| "mttr cannot read example.com: ..." | The address is not public, such as a local or private network address | mttr reads public addresses only. Check a public preview instead |
| "example.com was removed from mttr and is not read." | The site was taken out of mttr, as its owner can ask | Do not try to read it another way. Tell the person |
| "No record or file with mttr-verify=... was found for example.com yet." | The claim's DNS record or file is not visible yet | Check the record is a TXT record at the domain or at `_mttr.` before it, or the file is at `/.well-known/mttr.txt`. A new record can take a few minutes |
| "... checks are limited to the free tools' hourly allowance for each key." | Many one-page checks in an hour | Wait, or check one page per template rather than every page |
| "That is 20 proposals for example.com in the last hour." | Too many proposals | Put related changes in one proposal and try again in the minutes it says |
| "There is no proposal by that id for this key." | A wrong id, or a proposal made with another key | `mttr_proposals({ site })` lists this key's proposals |
| "No task waiting with that id." | The task was already marked done, or the id is wrong | `mttr_queue()` lists what is waiting |
| "There is no tool by that name." | A tool name that does not exist, often a guess | `tools/list`, or [tools.md](tools.md). Names use underscores, such as `mttr_brief` |

A status of 429 means too many requests in a time; MDN's page on 429 notes a server may say when to try again. mttr says the wait in its words, or in `allowedAt` for a read. Wait rather than retrying in a loop.

## A read that fails or never ends

`mttr_job({ id })` answers `waiting`, `running`, `done` or `failed`, and how many reads are ahead of it.

- **Waiting, with reads ahead:** the line is long. Poll every minute or two, not faster.
- **Failed:** `error` says why. Fetch the home page with `curl -sIL` to see what a crawler is given, then ask for a read again once the cause is fixed.
- **Done, but the score is 20 or less:** look for "The site is closed to crawlers" in the brief. A blocker caps the score.

## The site answers a browser but not mttr

If a person sees the page and mttr does not, the server or CDN treats crawlers differently from browsers:

```
curl -sI https://example.com/ -A "Mozilla/5.0"
curl -sI https://example.com/ -A "mttr/0.1"
```

Different statuses mean a firewall or bot rule. `ai-crawlers-served` checks the same with AI crawler names, and its fix says to confirm in the CDN's own settings. Changing a firewall is the person's call: report it and ask.

## Sources

- [Transports](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports): each JSON-RPC message is its own HTTP POST to one endpoint, with an Accept header listing application/json and text/event-stream.
- [Authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization): a client sends its token in the Authorization header as a bearer token on every request, and an invalid or expired token gets a 401.
- [429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429): what the status means, and that a server may send Retry-After to say how long to wait.
