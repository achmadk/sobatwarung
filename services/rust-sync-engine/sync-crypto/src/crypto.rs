use chacha20poly1305::{
    aead::{Aead, KeyInit},
    ChaCha20Poly1305, Nonce,
};
use ed25519_dalek::{Signature, Signer, SigningKey, Verifier, VerifyingKey};
use rand::rngs::OsRng;
use x25519_dalek::{EphemeralSecret, PublicKey, StaticSecret};
use zeroize::Zeroize;

pub struct Crypto;

impl Crypto {
    pub fn generate_key_pair() -> (StaticSecret, PublicKey) {
        let secret = StaticSecret::random_from_rng(OsRng);
        let public = PublicKey::from(&secret);
        (secret, public)
    }

    pub fn derive_shared_secret(
        private_key: &StaticSecret,
        peer_public: &PublicKey,
    ) -> [u8; 32] {
        let shared = private_key.diffie_hellman(peer_public);
        *shared.as_bytes()
    }

    pub fn encrypt(plaintext: &[u8], key: &[u8; 32]) -> Vec<u8> {
        let cipher = ChaCha20Poly1305::new(key.into());
        let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);

        let ciphertext = cipher
            .encrypt(&nonce, plaintext)
            .expect("encryption failed");

        let mut result = nonce.to_vec();
        result.extend(ciphertext);
        result
    }

    pub fn decrypt(ciphertext: &[u8], key: &[u8; 32]) -> Result<Vec<u8>, String> {
        if ciphertext.len() < 12 {
            return Err("Ciphertext too short".to_string());
        }

        let cipher = ChaCha20Poly1305::new(key.into());
        let nonce = Nonce::from_slice(&ciphertext[..12]);
        let ciphertext = &ciphertext[12..];

        cipher
            .decrypt(nonce, ciphertext)
            .map_err(|e| e.to_string())
    }

    pub fn sign(message: &[u8], signing_key: &SigningKey) -> Signature {
        signing_key.sign(message)
    }

    pub fn verify(
        message: &[u8],
        signature: &Signature,
        verifying_key: &VerifyingKey,
    ) -> bool {
        verifying_key.verify(message, signature).is_ok()
    }
}
