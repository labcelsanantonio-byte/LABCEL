export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Política de <span className="text-[#00C853]">Privacidad</span>
      </h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">1. Información que Recopilamos</h2>
          <p className="text-gray-600 mb-4">
            LABCEL San Antonio recopila la siguiente información cuando utiliza nuestros servicios:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Información personal:</strong> Nombre, correo electrónico, número de teléfono, dirección de envío.</li>
            <li><strong>Información de cuenta:</strong> Si inicia sesión con Google, recibimos su nombre, correo y foto de perfil.</li>
            <li><strong>Imágenes subidas:</strong> Las imágenes que sube para personalizar sus productos.</li>
            <li><strong>Información de pedidos:</strong> Historial de compras y preferencias.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">2. Uso de la Información</h2>
          <p className="text-gray-600 mb-4">
            Utilizamos su información personal para:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Procesar y entregar sus pedidos.</li>
            <li>Comunicarnos sobre el estado de su pedido.</li>
            <li>Enviar propuestas de diseño para su aprobación.</li>
            <li>Mejorar nuestros productos y servicios.</li>
            <li>Enviar comunicaciones de marketing (con su consentimiento).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">3. Protección de Datos</h2>
          <p className="text-gray-600">
            Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Las imágenes que sube se almacenan de forma segura y solo se utilizan para la fabricación de su producto personalizado.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">4. Comunicaciones</h2>
          <p className="text-gray-600 mb-4">
            Podemos contactarle a través de:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>WhatsApp:</strong> Para actualizaciones de pedidos y aprobación de diseños.</li>
            <li><strong>Correo electrónico:</strong> Para confirmaciones y notificaciones importantes.</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Puede optar por no recibir comunicaciones de marketing en cualquier momento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">5. Cookies y Tecnologías Similares</h2>
          <p className="text-gray-600">
            Utilizamos cookies para mantener su sesión iniciada y mejorar su experiencia de navegación. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">6. Compartir Información</h2>
          <p className="text-gray-600 mb-4">
            No vendemos ni alquilamos su información personal. Solo compartimos datos con:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Servicios de envío para la entrega de productos.</li>
            <li>Proveedores de servicios que nos ayudan a operar el negocio.</li>
            <li>Autoridades legales cuando sea requerido por ley.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">7. Sus Derechos</h2>
          <p className="text-gray-600 mb-4">
            Usted tiene derecho a:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Acceder a su información personal.</li>
            <li>Solicitar la corrección de datos inexactos.</li>
            <li>Solicitar la eliminación de su cuenta y datos.</li>
            <li>Oponerse al procesamiento de sus datos para marketing.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">8. Retención de Datos</h2>
          <p className="text-gray-600">
            Conservamos su información personal mientras tenga una cuenta activa o según sea necesario para proporcionarle servicios. Las imágenes subidas se conservan durante 30 días después de completar el pedido para atender posibles reclamos de garantía.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">9. Cambios a esta Política</h2>
          <p className="text-gray-600">
            Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios significativos a través de nuestro sitio web o por correo electrónico.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">10. Contacto</h2>
          <p className="text-gray-600">
            Para ejercer sus derechos o consultas sobre privacidad, contáctenos:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
            <li>Email: labcelsanantonio@gmail.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
