# Contributing

Thanks for your interest in contributing to `@callowayisweird/gmodstore-sdk`.

## Setup

```bash
git clone https://github.com/CallowayIsWeird/gmodstore-sdk.git
cd gmodstore-sdk
npm install
npm run build
```

## Development

```bash
npm run generate   # Regenerate types from openapi.json
npm run build      # Generate + bundle (ESM/CJS/types)
npm run lint       # Type-check without emitting
npm test           # Run tests
```

## Updating the API spec

If the GModStore API spec has changed:

1. Download the latest spec from https://www.gmodstore.com/openapi
2. Replace `openapi.json`
3. Run `npm run generate` to regenerate types
4. Update resource methods if new endpoints were added
5. Run `npm run build` to verify

## Pull Requests

- Follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`)
- Keep PRs focused on a single change
- Ensure `npm run build` and `npm run lint` pass
