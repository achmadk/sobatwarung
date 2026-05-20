## Context

The mobile-kmp app under `apps/mobile-kmp/` uses `com.sobatwarung` as its package namespace. This needs to be renamed to `id.biz.sobatwarung` to follow proper Java/Kotlin package naming conventions with a valid reverse domain name.

This is a straightforward refactoring task that involves:
- Finding all files with `com.sobatwarung` package declarations
- Replacing with `id.biz.sobatwarung`
- Updating import statements accordingly

## Goals / Non-Goals

**Goals:**
- Rename all package declarations from `com.sobatwarung` to `id.biz.sobatwarung`
- Ensure all import statements are updated
- Maintain identical code behavior after rename

**Non-Goals:**
- No changes to code logic or functionality
- Not modifying any Android app signing or build configurations
- Not changing any external API contracts

## Decisions

### Decision: Use Simple Find-and-Replace

Use a systematic find-and-replace approach across all Kotlin and XML files:
- Replace `package com.sobatwarung` with `package id.biz.sobatwarung`
- Replace `import com.sobatwarung` with `import id.biz.sobatwarung`
- Replace Android namespace `com.sobatwarung.mobile` with `id.biz.sobatwarung.mobile`

**Rationale**: This is a pure refactoring with no ambiguity. The package name is consistently used across all files.

### Decision: Order of Operations

1. Update Kotlin source files (package declarations and imports)
2. Update AndroidManifest.xml
3. Update SQLDelight schema package if applicable

**Rationale**: Kotlin files have the most references; updating them first ensures the package structure is correct before updating manifest.

## Risks / Trade-offs

[Risk] Missed file with hardcoded package reference
→ Mitigation: Use grep to find all occurrences before starting, verify with `grep -r "com.sobatwarung" apps/mobile-kmp/`

[Risk] SQLDelight generated code will have stale references after schema regeneration
→ Mitigation: Regenerate SQLDelight sources after the rename

[Risk] Build fails if any reference is missed
→ Mitigation: Full grep verification before building
