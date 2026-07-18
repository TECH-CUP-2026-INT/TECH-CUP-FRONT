/**
 * Watcher de OTPs - Sincroniza techcup.otps → identity_service.otp_tokens
 * 
 * Ejecutar: node sync-watcher.cjs
 * Corre cada 10 segundos y copia OTPs nuevos que no estén en identity_service
 */
const { MongoClient, UUID } = require('mongodb');

const MONGO_URI = 'mongodb+srv://juanbueno5555_db_user:h2ss1PLAhDZrohCd@cluster0.zrczynn.mongodb.net/identity_service?retryWrites=true';
const POLL_INTERVAL = 10000; // 10 segundos

async function sync() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const dbID = client.db('identity_service');
    const dbTC = client.db('techcup');

    const otpsTC = await dbTC.collection('otps')
      .find({ usado: false })
      .sort({ fechaCreacion: -1 })
      .toArray();

    let synced = 0;
    for (const otp of otpsTC) {
      const uid = otp.usuarioId;
      if (!uid) continue;
      const uidStr = typeof uid === 'string' ? uid : uid.toString();
      const uidBin = new UUID(uidStr); // Binary UUID para compatibilidad con Spring Data

      // Verificar si ya existe en identity_service
      const exists = await dbID.collection('otp_tokens').findOne({
        $or: [
          { _id: uidStr + '-otp-sync' },
          { userId: uidBin }
        ]
      });
      if (exists) continue;

      // Sincronizar usuario si no existe
      const userTC = await dbTC.collection('usuarios').findOne({ _id: uid });
      if (userTC) {
        const userExists = await dbID.collection('users').findOne({ _id: uidBin });
        if (!userExists) {
          await dbID.collection('users').insertOne({
            _id: uidBin,
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
          console.log(`[sync] Usuario ${userTC.correo} creado en identity_service`);
        }
      }

      // Insertar OTP en identity_service
      await dbID.collection('otp_tokens').insertOne({
        _id: uidStr + '-otp-sync',
        userId: uidBin, // Binary UUID para compatibilidad con Spring Data
        code: otp.codigoOTP,
        failedAttempts: 0,
        used: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
      console.log(`[sync] OTP ${otp.codigoOTP} sincronizado para ${uidStr}`);
      synced++;
    }

    if (synced > 0) {
      console.log(`[sync] ${synced} OTP(s) sincronizados`);
    }
  } catch (e) {
    console.error('[sync] Error:', e.message);
  } finally {
    await client.close();
  }
}

// Loop infinito
console.log('[sync] Watcher iniciado - revisando cada ${POLL_INTERVAL/1000}s');
sync().then(() => setInterval(sync, POLL_INTERVAL));
