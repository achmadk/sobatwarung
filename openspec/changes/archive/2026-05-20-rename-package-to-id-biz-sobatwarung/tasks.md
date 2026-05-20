## 1. Verification

- [x] 1.1 Search for all occurrences of `com.sobatwarung` in apps/mobile-kmp/
- [x] 1.2 Document all files that need updating

## 2. Kotlin Source Files

- [x] 2.1 Update package declaration in `androidApp/src/main/kotlin/com/sobatwarung/MainActivity.kt`
- [x] 2.2 Update package declaration in `androidApp/src/main/kotlin/com/sobatwarung/SobatWarungApp.kt`
- [x] 2.3 Update package declarations in `shared/src/commonMain/kotlin/com/sobatwarung/domain/*.kt`
- [x] 2.4 Update package declarations in `shared/src/commonMain/kotlin/com/sobatwarung/data/*.kt`
- [x] 2.5 Update package declarations in `shared/src/commonMain/kotlin/com/sobatwarung/network/*.kt`
- [x] 2.6 Update package declarations in `shared/src/commonMain/kotlin/com/sobatwarung/sync/*.kt`
- [x] 2.7 Update package declarations in `shared/src/commonMain/kotlin/com/sobatwarung/agent/*.kt`
- [x] 2.8 Update package declarations in `shared/src/commonMain/kotlin/com/sobatwarung/presentation/**/*.kt`
- [x] 2.9 Update package declarations in `shared/src/androidMain/kotlin/com/sobatwarung/**/*.kt`
- [x] 2.10 Update package declarations in `shared/src/iosMain/kotlin/com/sobatwarung/*.kt`
- [x] 2.11 Update import statements in all Kotlin files

## 3. Android Resources

- [x] 3.1 Update AndroidManifest.xml namespace and references
- [x] 3.2 Verify strings.xml and themes.xml don't have package references

## 4. SQLDelight Schema

- [x] 4.1 Update SQLDelight schema package reference if needed
- [ ] 4.2 Regenerate SQLDelight Kotlin sources (requires build)

## 5. Verification

- [x] 5.1 Search for any remaining `com.sobatwarung` references
- [ ] 5.2 Build project to verify no package-not-found errors
