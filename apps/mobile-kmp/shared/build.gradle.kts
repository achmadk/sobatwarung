plugins {
    alias(libs.plugins.kotlin.multiplatform)
    alias(libs.plugins.kotlin.plugin.serialization)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.sqldelight)
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = "17"
            }
        }
    }

    iosSimulatorArm64()
    iosX64()
    iosArm64()

    sourceSets {
        commonMain {
            dependencies {
                implementation(libs.kotlinx.coroutines.core)
                implementation(libs.kotlinx.serialization.json)
                implementation(libs.compose.ui)
                implementation(libs.compose.material3)
                implementation(libs.compose.foundation)
                implementation(libs.compose.navigation)
                implementation(libs.koin.core)
                implementation(libs.ktor.client.core)
                implementation(libs.ktor.client.content.negotiation)
                implementation(libs.ktor.serialization.kotlinx.json)
                implementation(libs.ktor.client.websockets)
                implementation(libs.sqldelight.runtime)
                implementation(libs.sqldelight.coroutines)
            }
        }

        androidMain {
            dependencies {
                implementation(libs.kotlinx.coroutines.android)
                implementation(libs.koin.android)
                implementation(libs.ktor.client.android)
                implementation(libs.sqldelight.android)
                implementation(libs.androidx.core.ktx)
                implementation(libs.androidx.lifecycle.runtime)
                implementation(libs.androidx.lifecycle.viewmodel)
                implementation(libs.androidx.activity.compose)
                implementation(libs.workmanager)
            }
        }

        iosMain {
            dependencies {
                implementation(libs.koin.core)
                implementation(libs.ktor.client.ios)
                implementation(libs.sqldelight.ios)
            }
        }
    }
}

sqldelight {
    database("SobatWarungDatabase") {
        packageName.set("id.biz.sobatwarung.db")
        sourceFolders.set(listOf("src/commonMain/sqldelight"))
    }
}
