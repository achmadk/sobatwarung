## Why

The mobile-kmp app currently uses `com.sobatwarung` as its package namespace, but business branding and Java/Kotlin package conventions suggest using a proper reverse domain (`id.biz.sobatwarung`) that properly identifies the business entity.

## What Changes

- Rename package namespace from `com.sobatwarung` to `id.biz.sobatwarung` across all Kotlin source files in mobile-kmp
- Update AndroidManifest.xml package references
- Update SQLDelight generated code package
- Update Koin dependency injection module references
- Update all import statements in Kotlin files

## Capabilities

### New Capabilities

- `package-rename-id-biz-sobatwarung`: Rename the mobile-kmp app package namespace from `com.sobatwarung` to `id.biz.sobatwarung`

### Modified Capabilities

- `mobile-kmp-app`: Update existing mobile-kmp spec to reflect the new package namespace

## Impact

- All Kotlin source files in `apps/mobile-kmp/` must have package declarations updated
- AndroidManifest.xml namespace will change
- SQLDelight schema package references will change
- Generated database classes will have different package location
- Koin modules will reference new package paths
- No behavioral changes - purely a refactoring task
