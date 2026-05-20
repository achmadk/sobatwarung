plugins {
    alias(libs.plugins.kotlin.multiplatform) apply false
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.compose.compiler.gradle) apply false
}

tasks.register("wrapper") {
    exec {
        commandLine("gradle", "wrapper", "--gradle-version", "8.5")
    }
}
