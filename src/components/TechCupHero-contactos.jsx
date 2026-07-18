import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function TechCupHero() {
  return (
    <div style={{ background: "#0E0619", minHeight: "600px", padding: "48px 40px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "32px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Columna izquierda: texto + CTAs */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#7C6CF4",
              marginBottom: "10px",
            }}
          >
            Temporada 2026-I
          </span>
          <h1
            style={{
              fontSize: "44px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FFFFFF",
              margin: "0 0 16px",
            }}
          >
            Más que un torneo,
            <br />
            tu cancha te espera
          </h1>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#A9A2C3",
              margin: "0 0 28px",
              maxWidth: "440px",
            }}
          >
            Campus Norte · Cancha 1, Escuela Colombiana de Ingeniería. Del 5 de
            marzo al 15 de junio de 2026.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "flex-start" }}>
            <div
              style={{
                background: "linear-gradient(to bottom right, rgb(2, 99, 225), rgb(235, 24, 54))",
                borderRadius: "22px",
                padding: "4px",
                boxShadow: "0 0 80px 24px rgba(168, 85, 247, 0.6)",
              }}
            >
              <div
                style={{
                  background: "#251143",
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 32px",
                }}
              >
                <img
                  src="/images/mercado-pago.jpg"
                  alt="Mercado Pago"
                  style={{
                    width: "220px",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.5,
                color: "#A9A2C3",
                margin: 0,
              }}
            >
              Recibimos pagos por PSE, tarjetas de crédito/débito y todos los
              medios disponibles en Mercado Pago.
            </p>
          </div>
        </div>

        {/* Columna derecha: imagen de la mascota con íconos flotantes */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "3 / 4",
              borderRadius: "20px",
              overflow: "hidden",
              background: "#15101F",
              border: "1px solid #2A2438",
            }}
          >
            <video
              src="/videos/contacto.mp4"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>

          <FloatingIcon icon={<Mail size={16} color="#7C6CF4" />} style={{ top: "8%", left: "-18px" }} />
          <FloatingIcon icon={<MapPin size={16} color="#7C6CF4" />} style={{ top: "45%", right: "-18px" }} />
          <FloatingIcon icon={<Clock size={16} color="#7C6CF4" />} style={{ bottom: "6%", left: "6%" }} />
        </div>
      </div>

      {/* Tarjetas de contacto */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          maxWidth: "1200px",
          margin: "40px auto 0",
        }}
      >
        <ContactCard icon={<Mail size={18} color="#7C6CF4" />} title="Correo" value="techcup@escuelaing.edu.co" />
        <ContactCard icon={<MapPin size={18} color="#7C6CF4" />} title="Ubicación" value="Campus Norte · Cancha 1" />
        <ContactCard icon={<Phone size={18} color="#7C6CF4" />} title="Teléfono" value="+57 (1) 668 3600" />
      </div>
    </div>
  );
}

function FloatingIcon({ icon, style }) {
  return (
    <div
      style={{
        position: "absolute",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#15101F",
        border: "1px solid #2A2438",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {icon}
    </div>
  );
}

function ContactCard({ icon, title, value }) {
  return (
    <div
      style={{
        background: "#15101F",
        border: "1px solid #2A2438",
        borderRadius: "14px",
        padding: "18px",
      }}
    >
      {icon}
      <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", margin: "10px 0 2px" }}>{title}</p>
      <p style={{ fontSize: "13px", color: "#A9A2C3", margin: 0 }}>{value}</p>
    </div>
  );
}
