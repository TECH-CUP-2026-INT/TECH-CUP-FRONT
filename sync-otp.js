/**
 * Sync: Copia OTPs de techcup.otps → identity_service.otp_tokens
 * y crea usuarios faltantes en identity_service.users
 * 
 * Uso: node sync-otp.js
 */
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://juanbueno5555_db_user:h2ss1PLAhDZrohCd@cluster0.zrczynn.mongodb.net/identity_service?retryWrites=true';

async function sync() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const dbID = client.db('identity_service');
  const dbTC = client.db('techcup');

  // 1. Buscar OTPs en techcup que no están en identity_service
  const otpsTC = await dbTC.collection('otps').find({ usado: false }).sort({ fechaCreacion: -1 }).toArray();

  let synced = 0;
  for (const otp of otpsTC) {
    const userId = otp.usuarioId;
    const existing = await dbID.collection('otp_tokens').findOne({ userId });

    if (!existing) {
      // Crear usuario en identity_service si no existe
      const userTC = await dbTC.collection('usuarios').findOne({ _id: userId });
      if (userTC) {
        const userExists = await dbID.collection('users').findOne({ _id: userId });
        if (!userExists) {
          await dbID.collection('users').insertOne({
            _id: userId,
            fullName: userTC.nombreCompleto,
            email: userTC.correo,
            password: userTC.contrasenaHash,
            userType: userTC.tipoUsuario || 'STUDENT',
            role: userTC.tipoUsuario === 'REFEREE' ? 'REFEREE' : 'PLAYER',
            status: userTC.estado || 'ACTIVE',
            failedLoginAttempts: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`✅ Usuario ${userTC.correo} creado en identity_service`);
        }
      }

      // Crear OTP token
      await dbID.collection('otp_tokens').insertOne({
        _id: userId + '-otp-sync',
        userId: userId,
        code: otp.codigoOTP,
        failedAttempts: 0,
        used: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      });
      console.log(`✅ OTP ${otp.codigoOTP} sincronizado para usuario ${userId}`);
      synced++;
    }
  }

  console.log(`\n📊 Sincronizados: ${synced} OTPs`);
  
  // Mostrar últimos OTPs disponibles
  const available = await dbID.collection('otp_tokens').find({ used: false }).sort({ createdAt: -1 }).limit(5).toArray();
  if (available.length > 0) {
    console.log('\n🎯 Últimos OTPs disponibles para ingresar:');
    for (const a of available) {
      const user = await dbID.collection('users').findOne({ _id: a.userId });
      console.log(`   📧 ${user?.email || 'desconocido'} → Código: ${a.code}`);
    }
  }

  await client.close();
}

sync().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
