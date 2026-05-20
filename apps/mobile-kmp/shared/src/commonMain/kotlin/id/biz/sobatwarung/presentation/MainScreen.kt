package id.biz.sobatwarung.presentation

import androidx.compose.runtime.Composable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import id.biz.sobatwarung.domain.*

@Composable
fun MainScreen() {
    var currentAgentType by remember { mutableStateOf<AgentType?>(null) }

    if (currentAgentType == null) {
        AgentTypeSelectionScreen(
            onAgentTypeSelected = { agentType ->
                currentAgentType = agentType
            }
        )
    } else {
        when (currentAgentType) {
            AgentType.AGEN_UTAMA -> AgenUtamaMainScreen()
            AgentType.AGEN_MITRA -> AgenMitraMainScreen()
            null -> {}
        }
    }
}

@Composable
fun AgentTypeSelectionScreen(
    onAgentTypeSelected: (AgentType) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
    ) {
        Text(
            text = "Sobat Warung",
            style = MaterialTheme.typography.headlineLarge
        )
        Spacer(modifier = Modifier.height(32.dp))
        Text(
            text = "Pilih Tipe Agen Anda",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = { onAgentTypeSelected(AgentType.AGEN_UTAMA) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Agen Utama")
        }
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedButton(
            onClick = { onAgentTypeSelected(AgentType.AGEN_MITRA) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Agen Mitra")
        }
    }
}
