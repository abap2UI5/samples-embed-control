# AGENTS.md — AI Assistant Guide for abap2UI5 samples-embed-control

> This file follows the cross-tool AGENTS.md convention and is the single
> agent instruction file of this repository. `CLAUDE.md` next to it is a
> pointer at this file, nothing more.

## What this repository is

The examples of the npm package
[`@abap2ui5/embed-control`](https://www.npmjs.com/package/@abap2ui5/embed-control)
- the UI5 custom control `z2ui5.embed.Container`, which runs an abap2UI5 app
inside any UI5 app - and the branches that deliver them. The control itself
is developed in
[abap2UI5/embed-control](https://github.com/abap2UI5/embed-control); here it
is an npm dependency like in any app.

`main` is the source: a UI5 freestyle app (`freestyle/`), a Fiori elements
app with the control in two custom sections of its object page
(`fiori-elements/`), a Fiori elements app for OData V2 with the control in
two object page extensions and the RAP service it reads
(`fiori-elements-v2/`), a generic UI Integration Card for SAP Build Work
Zone (`card/`), Playwright tests that drive them against a live abap2UI5
backend (`test/e2e/`), and the build of the branches `standard` and `rap`
(`scripts/build-bsp.mjs`), which the `deliver` workflow writes.

**Language:** English for all code, comments, docs, commit messages, PRs.

## Layout

| Path | |
|---|---|
| `freestyle/` | The freestyle example: a plain UI5 app, `includeDependency` and the `z2ui5.embed` resourceRoot, `ui5-middleware-simpleproxy` to the backend - `ui5.yaml` to an SAP system (`npm start`), `ui5-local.yaml` to abap2UI5 in Node on `localhost:3000` (`npm run start-local`, what the e2e tests use), `ui5-1.71.yaml` for the tests only. Delivered as `freestyle/` and as the BSP - its README is written for both places |
| `fiori-elements/` | The Fiori elements example: SAPUI5, list report and object page on a mock OData V4 service (`@sap-ux/ui5-middleware-fe-mockserver`, `webapp/localService/`), the control in two custom sections of the object page, each its own session (`webapp/ext/`) |
| `fiori-elements-v2/` | The Fiori elements example for OData V2: SAPUI5, list report and object page (`sap.suite.ui.generic.template`) on a mock of the RAP service in `abap/`, under the paths the binding has in a system (`webapp/localService/`), the control in two view extensions, after the facets `General` and `Language` (`webapp/ext/`). Delivered on `standard`, and on `rap` as BSP with the service |
| `fiori-elements-v2/abap/` | The RAP service of that example and the two abap2UI5 apps it starts on a system, in abapGit's format: CDS view entity on `T005T`, metadata extension, service definition, OData V2 binding, `Z2UI5_CL_EMBED_COUNTRY`, `Z2UI5_CL_EMBED_LANGUAGES`. The successor of abap2UI5-addons/fiori-elements-integration. Delivered as `src/01` of `rap` |
| `card/` | The card example: a UI Integration Card of type `Component`, generic - the class it runs is a card parameter, the backend a card destination the host resolves (`webapp/Component.js`, `onCardReady`) - with `webapp/dt/Configuration.js` for the host's configuration editor and a preview page in `webapp/test/` that `ui5 build` leaves out |
| `test/e2e/` | Playwright tests of the examples, one spec file each (`playwright.config.mjs`) |
| `scripts/build-bsp.mjs` | The branches, built with abap2UI5's tools into `out/standard/` and `out/rap/` |
| `README.md` | The README of `main` and, with a first line of its own, of both branches |
| `abaplint.jsonc` | abaplint over the examples' ABAP, against abap2UI5's main (`npm run abaplint`) |
| `.github/workflows/` | `ci.yaml` (checks, the branch build, e2e against abap2UI5 main and the 1.145.0 floor - on every pull request and every night), `deliver.yaml` (on every push to `main`: the same CI, then the branches) |

## The control comes from npm

- **Never copy the control into this repository**, and never link it from
  a checkout of embed-control in a commit. Every example names
  `@abap2ui5/embed-control` by version range, the workspace installs one copy
  at its root from the registry, in the version `package-lock.json` names,
  and the branches carry that copy. A new version arrives as a bump of the
  lockfile (dependabot's `embed-control` group, or by hand after a release).
- **One copy, at the root.** Keep the ranges of all examples the same: an
  example with a copy of its own in its `node_modules` would keep that copy
  when embed-control's CI puts the control of its commit at the root. `ci.yaml`
  (job `check`) and `build-bsp.mjs` fail on it.
- **An example that needs a change to the control waits for its release.**
  The change goes to embed-control first; the example follows here with the
  bump of the version that has it.
- **Nor the abap2UI5 frontend.** The control loads it at run time from the
  abap2UI5 service it talks to (`?z2ui5-bundle`); nothing here pins it, and
  a limitation of the frontend is fixed in abap2UI5, not worked around here.

## Tested from two sides

`ci.yaml` tests the examples with the control from npm.
abap2UI5/embed-control's CI checks out `main` of this repository, puts the
control of its commit into `node_modules/@abap2ui5/embed-control` and runs
`npm run bsp` and `npx playwright test` here - with the arguments of the
matrix in `ci.yaml` - so a change to the control is tested against these
examples before it is published. Keep that interface stable:

- `npm ci`, `npm run bsp` (with `ABAP2UI5_DIR`) and `npx playwright test`
  from the root, the backend on `localhost:3000`, nothing else.
- The Playwright projects `ui5-1.136`, `ui5-1.71`, `fiori-elements`,
  `fiori-elements-v2` and `card`, and the tag `@after-1.145.0` for a test the
  backend floor cannot pass - embed-control's floor leg names them. A
  renamed project goes into embed-control's `ci.yaml` in the same breath.
- A change here that breaks with the control of embed-control's `main` -
  but not with the published one - breaks embed-control's CI. Change the
  examples so that both pass, or land the control first.

## Rules for the examples

- **UI5 1.71 is the floor of the control.** The freestyle example runs on it
  in the e2e tests (`freestyle/ui5-1.71.yaml`, the `ui5-1.71` project); keep
  it free of anything newer.
- **abap2UI5 1.145.0 is the backend floor**, 1.146.0 what a host that routes
  by the hash needs (the Fiori elements apps and the card). The READMEs name
  both, and every example's README runs the local backend from
  `@abap2ui5/node-runtime` on npm (its version is the abap2UI5 release). A
  test that needs a newer backend is tagged `@after-1.145.0`.
- **`thirdparty/`, not `resources/`.** The control is served and built under
  `thirdparty/z2ui5/embed/` and registered with a relative resourceRoot in
  each manifest - an app deployed to an ABAP system answers every
  `<app>/resources/` path from the system's UI5.
- **An example's README is its README on the branch as well** - write it for
  someone who cloned `standard`, no links into `main`-only files.

## Rules for the examples' dev server

- **`npm start` goes to an SAP system, `npm run start-local` to
  `localhost:3000`** - `ui5.yaml` and `ui5-local.yaml`, the split the SAP
  Fiori tools generate. The two differ in the proxy's `baseUri` only; keep
  everything else in step. The e2e tests serve `ui5-local.yaml`.
- **The system's URL stays in `ui5.yaml`, never in `.env`.**
  `ui5-middleware-simpleproxy` loads `.env` itself, and a value from there
  wins over the YAML - a `UI5_MIDDLEWARE_SIMPLE_PROXY_BASEURI` in `.env`
  would send `start-local` to the system too. `.env` carries the user only.
- **No middleware of our own for abap2UI5's CSRF check.** The standard
  proxy sends `X-Forwarded-Host` (`xfwd`), and abap2UI5 compares the
  browser's `Origin` with it (`check_trust_forwarded_host`, on by default
  in every release the control supports). Do not bring back a middleware
  that drops `Origin`; a proxy that does not send the header is the thing to
  fix.

## The branches

`standard`: `freestyle/`, `fiori-elements/`, `fiori-elements-v2/` and
`card/` as UI5 projects, `src/` the freestyle app as the BSP `Z2UI5_HOST`, to
try the control on any abap2UI5 system with a plain abapGit pull. `rap`:
`src/01` the RAP service of `fiori-elements-v2` and the abap2UI5 app it
starts, `src/02` that example as the BSP `Z2UI5_HOST_FE` - one pull on a
system with RAP. `deliver.yaml` builds them with `build-bsp.mjs` and
abap2UI5's BSP tools (its main) and force-pushes each as one commit on top
of `main`.

- **Never commit to a branch, and never open a pull request against one.**
  The next delivery replaces it. Change `main`.
- **No frontend in the trees.** A branch is the example apps, their ABAP and
  the control from npm, nothing else.
- **A branch is one abapGit repository with its BSP in `src/02`** - where
  abap2UI5's `check-pages` looks for it - and an identity of its own: BSP
  name and ICF nodes (`BRANCHES` in `build-bsp.mjs`), so every branch
  installs next to the other and next to abap2UI5/frontend. A new branch
  goes into `BRANCHES` and into the loop of `deliver.yaml`.
- **`standard` stays installable on every abap2UI5 system.** ABAP that needs
  more - RAP, OData - goes onto a branch of its own, as `rap` does; an
  abapGit pull fails on the objects a system cannot activate.
- **Every example is delivered under its name, as git has it**, without
  what only the tests use (`ui5-1.71.yaml` - `TESTS_ONLY` in
  `build-bsp.mjs`). A new example goes into `EXAMPLES` there, into the
  workspaces of `package.json` and into the checks of `ci.yaml`. Only an app
  whose service a branch brings becomes a BSP: the freestyle app on
  `standard`, the Fiori elements app for OData V2 on `rap`, with its RAP
  service. The one for OData V4 mocks a service no system has, and a card is
  deployed to its host. The BSP of `rap` leaves the mock service out and
  starts `Z2UI5_CL_EMBED_COUNTRY` and `Z2UI5_CL_EMBED_LANGUAGES` instead of
  the hello world app - the one patch of an example (`patch` in `BRANCHES`,
  a list of replacements), because the UI5 project has to run locally too,
  where only abap2UI5's own apps exist.
- **`README.md` shows the package's three places in `freestyle/` and where
  each example places the control**, linked on the branch; the build fails
  when one of them no longer has what the README shows (`SHOWN`).
- **The guards in `build-bsp.mjs` are assumptions about abap2UI5's tools**
  (the short texts they write, the page paths bsp_rename touches). One that
  fails means the tools moved: follow them, do not loosen the guard.

## Rules for the examples' ABAP

`fiori-elements-v2/abap/` is ABAP in abapGit's file format, pulled into
systems from the branch `rap`. abaplint (`npm run abaplint`,
`abaplint.jsonc`, in the `check` job) checks it against abap2UI5's main, the
CDS sources included; activation it cannot check.

- **Never hand-write the metadata sidecar of an object type nobody has
  exported from a real system.** The sidecars here follow the ones
  abap2UI5-addons/fiori-elements-integration exported (DDLS, DDLX, SRVD,
  SRVB, CLAS); a new object type - a table, a behavior definition - is
  created in a system once and committed as abapGit serializes it.
- **Only DDIC objects every target system has.** `T005T` is on every
  standard ABAP system; ABAP Cloud does not release it.
- **The mock mirrors the service.** `webapp/localService/` answers under the
  paths of the binding, with its entity set, its property names and the
  annotations of the metadata extension. A change to the CDS view, the
  metadata extension or the service definition changes the mock in the same
  commit - the app is tested against the mock only.
- **The app class is built like any abap2UI5 app** - `z2ui5_cl_ui5_view_builder`
  in the house chain layout, lifecycle checks in one IF chain - and only
  with API of the release the READMEs name (1.146.0). The abap2UI5 linter
  (`npx @abap2ui5/linter`) finds the rest.
- Object names stay within 25 characters, the budget of abap2UI5's
  namespace rename.

## Validation

```bash
npm ci
npm run lint && npm run format:check
npm run abaplint       # the examples' ABAP, against abap2UI5's main
npm run build          # ui5 build of the examples - the control lands in dist/thirdparty/
ABAP2UI5_DIR=../abap2UI5 npm run bsp   # the branches, with abap2UI5's page checks
npx playwright test    # needs an abap2UI5 backend with ?z2ui5-bundle on :3000 - see README
```

All text files are LF-only, formatted with Prettier (`.prettierrc`).
