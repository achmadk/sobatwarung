package id.biz.sobatwarung

import android.app.Application
import id.biz.sobatwarung.di.initKoin
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger

class SobatWarungApp : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin {
            androidLogger()
            androidContext(this@SobatWarungApp)
        }
    }
}
