package id.biz.sobatwarung.presentation

import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color

val Primary = Color(0xFF2E7D32)
val PrimaryDark = Color(0xFF1B5E20)
val Secondary = Color(0xFFFF8F00)
val Background = Color(0xFFFAFAFA)
val Surface = Color(0xFFFFFFFF)
val Error = Color(0xFFD32F2F)
val OnPrimary = Color.White
val OnSecondary = Color.Black
val OnBackground = Color(0xFF212121)
val OnSurface = Color(0xFF212121)
val OnError = Color.White

val LightColorScheme = lightColorScheme(
    primary = Primary,
    onPrimary = OnPrimary,
    secondary = Secondary,
    onSecondary = OnSecondary,
    background = Background,
    onBackground = OnBackground,
    surface = Surface,
    onSurface = OnSurface,
    error = Error,
    onError = OnError
)

val DarkColorScheme = darkColorScheme(
    primary = Primary,
    onPrimary = OnPrimary,
    secondary = Secondary,
    onSecondary = OnSecondary,
    background = Color(0xFF121212),
    onBackground = Color.White,
    surface = Color(0xFF1E1E1E),
    onSurface = Color.White,
    error = Error,
    onError = OnError
)
