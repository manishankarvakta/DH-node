import {
  KeyHelper,
  SignedPublicPreKeyType,
  SignalProtocolAddress,
  SessionBuilder,
  PreKeyType,
  SessionCipher,
  MessageType,
} from "@privacyresearch/libsignal-protocol-typescript";


const createID = async (name: string, store: SignalProtocolStore) => {
    const registrationId = KeyHelper.generateRegistrationId()
    storeSomewhereSafe(`registrationID`, registrationId)
  
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
    storeSomewhereSafe('identityKey', identityKeyPair)
  
    const baseKeyId = makeKeyId()
    const preKey = await KeyHelper.generatePreKey(baseKeyId)
    store.storePreKey(`${baseKeyId}`, preKey.keyPair)
  
    const signedPreKeyId = makeKeyId()
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
    store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)
  
    // Now we register this with the server or other directory so all users can see them.
    // You might implement your directory differently, this is not part of the SDK.
  
    const publicSignedPreKey: SignedPublicPreKeyType = {
      keyId: signedPreKeyId,
      publicKey: signedPreKey.keyPair.pubKey,
      signature: signedPreKey.signature,
    }
  
    const publicPreKey: PreKeyType = {
      keyId: preKey.keyId,
      publicKey: preKey.keyPair.pubKey,
    }
  
    directory.storeKeyBundle(name, {
      registrationId,
      identityPubKey: identityKeyPair.pubKey,
      signedPreKey: publicSignedPreKey,
      oneTimePreKeys: [publicPreKey],
    })
  }