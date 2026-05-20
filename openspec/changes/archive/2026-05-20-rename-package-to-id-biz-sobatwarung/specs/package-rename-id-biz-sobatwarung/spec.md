## ADDED Requirements

### Requirement: Package namespace rename

The system SHALL rename the mobile-kmp app package namespace from `com.sobatwarung` to `id.biz.sobatwarung` across all source files.

#### Scenario: Kotlin source files renamed

- **WHEN** the rename is applied to Kotlin source files
- **THEN** all `package com.sobatwarung` declarations SHALL be replaced with `package id.biz.sobatwarung`
- **AND** all `import com.sobatwarung.*` statements SHALL be replaced with `import id.biz.sobatwarung.*`

#### Scenario: AndroidManifest.xml renamed

- **WHEN** the AndroidManifest.xml is updated
- **THEN** the `package` attribute in `<manifest>` SHALL be `id.biz.sobatwarung.mobile`
- **AND** the `android:name` attributes referencing `com.sobatwarung` SHALL be updated to `id.biz.sobatwarung`

#### Scenario: SQLDelight schema package updated

- **WHEN** SQLDelight schema is regenerated
- **THEN** the generated database classes SHALL use `id.biz.sobatwarung.db` package

#### Scenario: Build verification

- **WHEN** the project is built after the rename
- **THEN** the build SHALL succeed without any package-not-found errors
- **AND** all existing functionality SHALL work identically to before the rename
