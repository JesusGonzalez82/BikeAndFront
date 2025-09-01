import React from "react";
import { Typography} from "antd";

const { Title, Paragraph } = Typography;

export default function TermsOfUse() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
  <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>Términos de Uso</Title>

        <Paragraph>
          Bienvenido a Bike And Ride. Al acceder y usar nuestro sitio web, usted acepta cumplir con estos términos de uso.
        </Paragraph>

        <Paragraph>
          <strong>Uso del sitio:</strong> Usted se compromete a utilizar este sitio de manera responsable y a no realizar ninguna actividad que pueda dañar, sobrecargar o afectar el funcionamiento del sitio.
        </Paragraph>

        <Paragraph>
          <strong>Propiedad intelectual:</strong> Todo el contenido, incluyendo texto, imágenes, logotipos y diseño, es propiedad de Bike And Ride y está protegido por derechos de autor. No se permite su reproducción sin autorización.
        </Paragraph>

        <Paragraph>
          <strong>Limitación de responsabilidad:</strong> Bike And Ride no se hace responsable de daños directos o indirectos derivados del uso del sitio web o de la información proporcionada en él.
        </Paragraph>

        <Paragraph>
          <strong>Modificaciones:</strong> Nos reservamos el derecho de modificar estos términos en cualquier momento. Las actualizaciones se publicarán en esta página.
        </Paragraph>

        <Paragraph>
          Si tiene preguntas sobre estos términos, por favor <a href="mailto:jgblanco82@yahoo.es">contáctenos</a>.
        </Paragraph>
    </div>
  );
}
