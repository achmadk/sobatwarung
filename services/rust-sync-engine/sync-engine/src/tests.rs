#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vector_clock_increment() {
        let mut vc = crate::crdt::vector_clock::VectorClock::new();
        vc.increment("client1");
        assert_eq!(vc.clock.get("client1"), Some(&1));
    }

    #[test]
    fn test_vector_clock_merge() {
        let mut vc1 = crate::crdt::vector_clock::VectorClock::new();
        vc1.increment("client1");
        vc1.increment("client1");

        let mut vc2 = crate::crdt::vector_clock::VectorClock::new();
        vc2.increment("client1");
        vc2.increment("client2");

        vc1.merge(&vc2);

        assert_eq!(vc1.clock.get("client1"), Some(&2));
        assert_eq!(vc1.clock.get("client2"), Some(&1));
    }

    #[test]
    fn test_crypto_encrypt_decrypt() {
        let plaintext = b"Hello, World!";
        let key = crate::crypto::CryptoOps::generate_x25519_keypair();
        let shared = crate::crypto::CryptoOps::derive_shared_secret(&key.0, &key.1);

        let encrypted =
            crate::crypto::CryptoOps::encrypt_chacha20(plaintext, &shared).unwrap();
        let decrypted =
            crate::crypto::CryptoOps::decrypt_chacha20(&encrypted, &shared).unwrap();

        assert_eq!(plaintext.to_vec(), decrypted);
    }

    #[test]
    fn test_ed25519_sign_verify() {
        let message = b"Test message";
        let keypair = ed25519_dalek::SigningKey::generate(&mut rand::thread_rng());
        let public_key = keypair.verifying_key();

        let signature = CryptoOps::sign_ed25519(message, keypair.as_bytes());
        assert!(CryptoOps::verify_ed25519(
            message,
            &signature,
            public_key.as_bytes()
        ));
    }
}
