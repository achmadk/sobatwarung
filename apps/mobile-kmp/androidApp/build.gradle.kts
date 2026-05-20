plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.multiplatform)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.sqldelight)
}

android {
    namespace = "id.biz.sobatwarung"
    compileSdk = 35

    defaultConfig {
        applicationId = "id.biz.sobatwarung"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    sourceSets {
        getByName("main") {
            kotlin.srcDirs("src")
        }
    }
}

dependencies {
    implementation(projects.shared)
    implementation(libs.androidx.activity.compose)
}

kotlin {
    targets.configureEach {
        if (this is org.jetbrains.kotlin.gradle.plugin.mpp.KotlinAndroidTarget) {
            compilations.all {
                kotlinOptions {
                    jvmTarget = "17"
                }
            }
        }
    }
}
