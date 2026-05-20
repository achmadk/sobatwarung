use chacha20poly1305::{
    aead::{Aead, KeyInit},
    ChaCha20Poly1305, Nonce,
};
use ed25519_dalek::{Signature, Signer, SigningKey, Verifier, VerifyingKey};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use x25519_dalek::{PublicKey, StaticSecret};
use zeroize::Zeroize;

#[derive(Clone, Serialize, Deserialize)]
pub struct SignedPayload {
    pub ciphertext: Vec<u8>,
    pub nonce: Vec<u8>,
    pub signature: Vec<u8>,
}

pub struct CryptoOps;

impl CryptoOps {
    pub fn generate_x25519_keypair() -> (Vec<u8>, Vec<u8>) {
        let secret = StaticSecret::random_from_rng(OsRng);
        let public = PublicKey::from(&secret);
        (secret.to_bytes().to_vec(), public.to_bytes().to_vec())
    }

    pub fn derive_shared_secret(private_key: &[u8], public_key: &[u8]) -> Vec<u8> {
        let secret = StaticSecret::from_bytes(private_key.try_into().unwrap());
        let peer = PublicKey::from_bytes(public_key.try_into().unwrap());
        let shared = secret.diffie_hellman(&peer);
        shared.as_bytes().to_vec()
    }

    pub fn encrypt_chacha20(plaintext: &[u8], key: &[u8]) -> Result<SignedPayload, String> {
        if key.len() != 32 {
            return Err("Key must be 32 bytes".to_string());
        }

        let key_array: [u8; 32] = key.try_into().unwrap();
        let cipher = ChaCha20Poly1305::new(key_array.into());
        let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);

        let ciphertext = cipher
            .encrypt(&nonce, plaintext)
            .map_err(|e| e.to_string())?;

        Ok(SignedPayload {
            ciphertext,
            nonce: nonce.to_vec(),
            signature: vec![],
        })
    }

    pub fn decrypt_chacha20(payload: &SignedPayload, key: &[u8]) -> Result<Vec<u8>, String> {
        if key.len() != 32 {
            return Err("Key must be 32 bytes".to_string());
        }

        let key_array: [u8; 32] = key.try_into().unwrap();
        let cipher = ChaCha20Poly1305::new(key_array.into());
        let nonce = Nonce::from_slice(&payload.nonce);

        cipher
            .decrypt(nonce, payload.ciphertext.as_ref())
            .map_err(|e| e.to_string())
    }

    pub fn sign_ed25519(message: &[u8], signing_key: &[u8]) -> Vec<u8> {
        let key: SigningKey = SigningKey::from_bytes(signing_key.try_into().unwrap());
        let signature = key.sign(message);
        signature.to_bytes().to_vec()
    }

    pub fn verify_ed25519(
        message: &[u8],
        signature: &[u8],
        public_key: &[u8],
    ) -> bool {
        let sig = match Signature::from_slice(signature) {
            Ok(s) => s,
            Err(_) => return false,
        };
        let key = match VerifyingKey::from_bytes(public_key.try_into().unwrap()) {
            Ok(k) => k,
            Err(_) => return false,
        };
        key.verify(message, &sig).is_ok()
    }
}
