use wasm_bindgen::prelude::*;
use chacha20poly1305::{
    aead::{Aead, KeyInit},
    ChaCha20Poly1305, Nonce,
};
use ed25519_dalek::{Signature, Signer, SigningKey, Verifier, VerifyingKey};
use x25519_dalek::{PublicKey, StaticSecret};
use rand::rngs::OsRng;

#[wasm_bindgen]
pub struct KeyPair {
    secret: StaticSecret,
    public: Vec<u8>,
}

#[wasm_bindgen]
impl KeyPair {
    #[wasm_bindgen(constructor)]
    pub fn new() -> KeyPair {
        let secret = StaticSecret::random_from_rng(OsRng);
        let public = PublicKey::from(&secret).to_bytes().to_vec();
        KeyPair { secret, public }
    }

    #[wasm_bindgen(getter)]
    pub fn public_key(&self) -> Vec<u8> {
        self.public.clone()
    }

    pub fn derive_shared(&self, peer_public: &[u8]) -> Vec<u8> {
        let peer_pub = PublicKey::from_bytes(peer_public.try_into().unwrap()).unwrap();
        let shared = self.secret.diffie_hellman(&peer_pub);
        shared.as_bytes().to_vec()
    }
}

#[wasm_bindgen]
pub fn encrypt(plaintext: &[u8], key: &[u8]) -> Vec<u8> {
    let key_array: [u8; 32] = key.try_into().unwrap();
    let cipher = ChaCha20Poly1305::new(key_array.into());
    let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);

    let ciphertext = cipher
        .encrypt(&nonce, plaintext)
        .expect("encryption failed");

    let mut result = nonce.to_vec();
    result.extend(ciphertext);
    result
}

#[wasm_bindgen]
pub fn decrypt(ciphertext: &[u8], key: &[u8]) -> Result<Vec<u8>, JsValue> {
    if ciphertext.len() < 12 {
        return Err(JsValue::from_str("Ciphertext too short"));
    }

    let key_array: [u8; 32] = key.try_into().unwrap();
    let cipher = ChaCha20Poly1305::new(key_array.into());
    let nonce = Nonce::from_slice(&ciphertext[..12]);
    let ciphertext = &ciphertext[12..];

    cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub struct SignatureResult {
    bytes: Vec<u8>,
}

#[wasm_bindgen]
impl SignatureResult {
    #[wasm_bindgen(getter)]
    pub fn bytes(&self) -> Vec<u8> {
        self.bytes.clone()
    }
}

#[wasm_bindgen]
pub fn sign(message: &[u8], signing_key: &[u8]) -> Vec<u8> {
    let key: SigningKey = SigningKey::from_bytes(signing_key.try_into().unwrap());
    let signature = key.sign(message);
    signature.to_bytes().to_vec()
}

#[wasm_bindgen]
pub fn verify(message: &[u8], signature: &[u8], public_key: &[u8]) -> bool {
    let sig = Signature::from_bytes(signature.try_into().unwrap());
    let key = VerifyingKey::from_bytes(public_key.try_into().unwrap()).unwrap();
    key.verify(message, &sig).is_ok()
}
