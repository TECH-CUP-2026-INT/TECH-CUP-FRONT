import pkg from 'mongodb';
const { MongoClient, UUID } = pkg;
const uri = 'mongodb+srv://juanbueno5555_db_user:h2ss1PLAhDZrohCd@cluster0.zrczynn.mongodb.net/identity_service?retryWrites=true';
const client = new MongoClient(uri);
await client.connect();
const id = client.db('identity_service');
const tc = client.db('techcup');

// Eliminar todos los OTPs
await id.collection('otp_tokens').deleteMany({});
console.log('OTPs eliminados');

// Eliminar todos los usuarios (excepto admin)
await id.collection('users').deleteMany({ email: { $ne: 'admin@escuelaing.edu.co' } });
console.log('Usuarios (no-admin) eliminados');

// Re-sincronizar
const otps = await tc.collection('otps').find({ usado: false }).sort({ fechaCreacion: -1 }).toArray();
let count = 0;
for (const otp of otps) {
  const uidBin = new UUID(otp.usuarioId.toString());
  const uidStr = otp.usuarioId.toString();
  
  const user = await tc.collection('usuarios').findOne({ _id: otp.usuarioId });
  if (user) {
    const ue = await id.collection('users').findOne({ _id: uidBin });
    if (!ue) {
      await id.collection('users').insertOne({
        _id: uidBin, fullName: user.nombreCompleto, email: user.correo,
        password: user.contrasenaHash, userType: user.tipoUsuario || 'STUDENT',
        role: 'PLAYER', status: 'ACTIVE', failedLoginAttempts: 0,
        createdAt: new Date(), updatedAt: new Date()
      });
    }
  }
  
  await id.collection('otp_tokens').insertOne({
    _id: uidStr + '-otp-sync', userId: uidBin,
    code: otp.codigoOTP, failedAttempts: 0, used: false,
    createdAt: new Date(), expiresAt: new Date(Date.now() + 600000)
  });
  count++;
  
  if (count <= 3) {
    console.log(`OTP: ${otp.codigoOTP} para ${user?.correo || uidStr}`);
  }
}
console.log(`Total sincronizados: ${count}`);
await client.close();
