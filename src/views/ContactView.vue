<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <!-- Title -->
    <h1 class="text-3xl font-bold text-primary text-center mb-6">¿Te gustaría ser anfitrión en GuaraníHost?</h1>

    <!-- Introduction paragraphs -->
    <p class="mb-4">
      Si cuentas con una propiedad vacacional o una experiencia turística única y deseas compartirla con viajeros locales o internacionales,
      ¡te invitamos a unirte a la comunidad de anfitriones de <strong>GuaraníHost</strong>!
    </p>
    <p class="mb-6">
      Nuestra plataforma te ofrece una vía directa y segura para ofrecer tu alojamiento o tour, administrar tus reservas y conectarte con personas que desean conocer lo mejor del Paraguay.
      No necesitas tener conocimientos técnicos: nosotros te guiamos en todo el proceso.
    </p>

    <!-- Requirements -->
    <h2 class="text-2xl font-semibold text-primary mb-2">¿Qué necesito para comenzar?</h2>
    <ul class="list-disc pl-6 mb-6">
      <li><strong>Una propiedad o experiencia turística:</strong> puede ser una cabaña, casa, departamento o una actividad organizada (como paseos, senderismo, rutas culturales, etc.).</li>
      <li><strong>Buena conexión a internet:</strong> para cargar imágenes, responder solicitudes y gestionar reservas.</li>
      <li><strong>Compromiso y hospitalidad:</strong> lo más importante es que ofrezcas una experiencia segura, auténtica y positiva para el viajero.</li>
    </ul>

    <!-- How it works -->
    <h2 class="text-2xl font-semibold text-primary mb-2">¿Cómo funciona?</h2>
    <ol class="list-decimal pl-6 mb-6">
      <li>Rellenas el formulario de contacto que aparece más abajo.</li>
      <li>Te contactaremos para verificar tu interés y asesorarte personalmente.</li>
      <li>Una vez aprobado, podrás publicar tu alojamiento o tour en la plataforma.</li>
      <li>Empezarás a recibir reservas y solicitudes directamente desde tu perfil.</li>
    </ol>

    <!-- Benefits -->
    <h2 class="text-2xl font-semibold text-primary mb-2">Beneficios de ser parte de GuaraníHost</h2>
    <ul class="list-disc pl-6 mb-6">
      <li>Presencia digital gratuita para tu propiedad o experiencia.</li>
      <li>Control total sobre tus fechas, precios y condiciones.</li>
      <li>Promoción en redes sociales y medios aliados.</li>
      <li>Soporte técnico y asesoramiento continuo.</li>
      <li>Acceso a un sistema de reservas profesional y confiable.</li>
    </ul>

    <!-- Contact form -->
    <h2 class="text-2xl font-semibold text-primary mb-4">Formulario de solicitud</h2>
    <form class="space-y-4">
      <!-- Name -->
      <div>
        <label for="name" class="block font-medium">Nombre completo:</label>
        <input type="text" id="name" name="name" placeholder="Ej: Juan Martínez" required class="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block font-medium">Correo electrónico:</label>
        <input type="email" id="email" name="email" placeholder="Ej: juan@email.com" required class="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
      </div>

      <!-- Phone -->
      <div>
        <label for="phone" class="block font-medium">Teléfono de contacto:</label>
        <input type="tel" id="phone" name="phone" placeholder="Ej: +595 981 123456" required class="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
      </div>

      <!-- Type -->
      <div>
        <label for="type" class="block font-medium">¿Qué deseas ofrecer?</label>
        <select id="type" name="type" required class="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900">
          <option value="">Selecciona una opción</option>
          <option value="property">Alojamiento (casa, cabaña, etc.)</option>
          <option value="tour">Paquete turístico / experiencia</option>
          <option value="both">Ambos</option>
        </select>
      </div>

      <!-- Description -->
      <div>
        <label for="message" class="block font-medium">Cuéntanos más sobre lo que deseas ofrecer:</label>
        <textarea id="message" name="message" rows="5" placeholder="Describe tu propiedad, ubicación o tipo de experiencia turística..." required class="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"></textarea>
      </div>

      <!-- Submit button -->
      <button type="submit" class="bg-primary text-white px-6 py-2 rounded hover:bg-indigo-700">Enviar solicitud</button>
    </form>

    <!-- Next steps -->
    <h2 class="text-2xl font-semibold text-primary mt-10 mb-2">¿Y luego qué sucede?</h2>
    <p class="mb-6">
      Una vez que recibamos tu solicitud, uno de nuestros agentes te contactará por correo o teléfono para brindarte apoyo personalizado.
      Te explicaremos cómo funciona la plataforma, cómo se gestionan las reservas y qué pasos seguir para comenzar a recibir viajeros.
    </p>
    <p class="mb-6">
      Además, te enviaremos toda la información necesaria sobre el proceso de publicación, gestión de reservas y condiciones asociadas al uso de la plataforma.
    </p>

    <!-- Support contact -->
    <h2 class="text-2xl font-semibold text-primary mb-2">¿Tienes dudas?</h2>
    <p>
      También puedes escribirnos directamente a <strong>anfitriones@guaranihost.com</strong> o visitar nuestro
      <a href="/help" class="text-primary underline">Centro de ayuda</a> para más información.
    </p>

    <!-- Final message -->
    <p class="mt-6 font-bold text-center">GuaraníHost: Impulsa tu propiedad. Comparte tu historia. Conecta con el mundo.</p>
  </div>
</template>

<script setup lang="ts">
// This view represents the public contact page for prospective hosts
// It contains descriptive sections and a form to apply as a host on GuaraníHost
// Currently, the form is static. Future enhancement may include backend integration with email or database.
</script>
