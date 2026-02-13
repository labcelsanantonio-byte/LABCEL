export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Términos y <span className="text-[#00C853]">Condiciones</span>
      </h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">1. Aceptación de los Términos</h2>
          <p className="text-gray-600">
            Al acceder y utilizar los servicios de LABCEL San Antonio, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">2. Productos Personalizados</h2>
          <p className="text-gray-600 mb-4">
            Nuestras fundas personalizadas se fabrican bajo demanda según las especificaciones del cliente. Al realizar un pedido:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Usted garantiza que tiene los derechos sobre las imágenes utilizadas.</li>
            <li>No aceptamos imágenes con contenido ofensivo, ilegal o que viole derechos de autor de terceros.</li>
            <li>El color y la calidad de impresión pueden variar ligeramente respecto a la vista previa en pantalla.</li>
            <li>Los productos personalizados no son reembolsables a menos que exista un defecto de fabricación.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">3. Proceso de Pedido</h2>
          <p className="text-gray-600 mb-4">
            El proceso de compra funciona de la siguiente manera:
          </p>
          <ol className="list-decimal pl-6 text-gray-600 space-y-2">
            <li>Seleccione el tipo de funda y modelo de teléfono.</li>
            <li>Suba su imagen personalizada y ajuste el diseño.</li>
            <li>Complete el formulario de envío y método de pago.</li>
            <li>Un administrador revisará su diseño y se comunicará para confirmar.</li>
            <li>Una vez aprobado, se procede a la fabricación y envío.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">4. Precios y Pagos</h2>
          <p className="text-gray-600 mb-4">
            Todos los precios están expresados en pesos mexicanos (MX) e incluyen impuestos aplicables. Los métodos de pago aceptados son:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Transferencia bancaria</li>
            <li>Pago contra entrega (en zonas disponibles)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">5. Envíos y Entregas</h2>
          <p className="text-gray-600">
            El tiempo de entrega estimado es de 5-10 días hábiles después de la confirmación del diseño. Los costos de envío se calcularán según la ubicación del cliente. LABCEL San Antonio no se hace responsable por retrasos causados por servicios de mensajería externos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">6. Devoluciones y Garantía</h2>
          <p className="text-gray-600 mb-4">
            Debido a la naturaleza personalizada de nuestros productos:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>No se aceptan devoluciones por cambio de opinión.</li>
            <li>Ofrecemos reemplazo gratuito en caso de defectos de fabricación.</li>
            <li>Cualquier reclamo debe realizarse dentro de las 48 horas posteriores a la recepción.</li>
            <li>Se requieren fotos del producto defectuoso para procesar garantías.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">7. Propiedad Intelectual</h2>
          <p className="text-gray-600">
            Todo el contenido del sitio web, incluyendo pero no limitado a logos, textos, gráficos e imágenes, es propiedad de LABCEL San Antonio y está protegido por las leyes de propiedad intelectual.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">8. Contacto</h2>
          <p className="text-gray-600">
            Para cualquier consulta sobre estos términos, puede contactarnos a través de:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
            <li>Email: labcelsanantonio@gmail.com</li>
            <li>WhatsApp: Disponible en nuestro sitio web</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
