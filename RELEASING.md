# Releasing Hero’s Call

The source repository is [nessamurmur/heros-call](https://github.com/nessamurmur/heros-call).
Use a source checkout for these commands; the installation ZIP omits development
tools. Only this module folder belongs in the repository. Private research,
world data, PDFs and development fixtures stay outside it.

## Version policy

The first public version is **0.1.0**. Ordinary development commits do not change
the version. Accumulate changes under an Unreleased heading in CHANGELOG.md,
then choose 0.1.1 for fixes or 0.2.0 for the next feature release. Never replace a
published archive with different bytes under the same version. Development
checks and screenshots are not reasons to increment the version.

`module.json` is the version authority. When preparing a release, update its
version and versioned download URL, README.md, the dated CHANGELOG.md entry and
QA.md. Preserve the actual dates and scope of historical test results.

## Build locally

Use Node.js 22+ and Python 3.10+; no dependencies need installing.

```sh
npm test
npm run build
```

This creates `dist/heros-call-0.1.0.zip`, `dist/module.json` and `dist/SHA256SUMS`.
The archive contains the `heros-call/` installation folder, uncompiled module
source, unchanged art originals, documentation and licenses. Tests, tools and CI
files stay in the source repository. The builder rejects unrecognised runtime
files and symlinks, checks credited asset hashes, normalizes archive timestamps
and verifies ZIP integrity.

The build derives release URLs from the repository URL in module.json. To build
for a different GitHub repository, pass `--repository` to `tools/package.py`.
The generated manifest and the manifest inside the ZIP are byte-identical. The
builder does not create tags, upload files or publish anything.

## Publish a release

1. Run the tests and build from a clean checkout. Install the archive in a
   disposable Foundry 14 / Nimble 0.10.0 world and use the native smoke-test
   checklist in QA.md. Record results and any unverified coverage accurately.
2. Set the version, download URL and changelog release date, and commit the
   release changes. Push the source branch and inspect the validation workflow.
3. Tag the tested commit with a matching version and push that tag. For the
   initial release the commands are:

   ```sh
   git tag -a v0.1.0 -m "Hero's Call 0.1.0"
   git push origin v0.1.0
   ```

4. The **Release module** workflow runs the Node 22/24 checks, verifies that the
   tag matches module.json and a dated changelog section, then builds the assets.
   It creates a draft, uploads the ZIP, manifest and SHA256SUMS, and publishes it
   as the latest regular release only after every upload succeeds. It uses the
   repository's built-in GitHub token; no personal token is needed.
5. Verify the public manifest and ZIP download without authentication, and check
   a fresh Foundry installation. Optionally submit the package to Foundry's
   directory after those checks.

The publishing job has repository contents write permission; ordinary validation
has read permission only. An interrupted run can resume uploads to its draft.
Rerunning against an already public release fails rather than overwriting it.
Do not move or delete published version tags; make a new release for fixes.

## Foundry update URLs

The stable install/update manifest is:

```text
https://github.com/nessamurmur/heros-call/releases/latest/download/module.json
```

Its download field points at the matching version-specific ZIP, such as
`https://github.com/nessamurmur/heros-call/releases/download/v0.1.0/heros-call-0.1.0.zip`.
GitHub's automatically generated source ZIP is not the installable module archive.
The current workflow supports regular releases; prerelease channels need a
separate stable manifest because GitHub's latest link excludes prereleases.

See Foundry's [manifest documentation](https://foundryvtt.com/article/module-development/),
GitHub's [release asset links](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases)
and [latest-release API](https://docs.github.com/en/rest/releases/releases#get-the-latest-release).
