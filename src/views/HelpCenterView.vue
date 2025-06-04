<template>
  <!-- Help Center main container -->
  <section class="max-w-5xl mx-auto px-4 py-10 text-darkText dark:text-white">
    <!-- Page title -->
    <h1 class="text-3xl font-bold text-primary mb-6">Centro de ayuda</h1>

    <!-- Introduction paragraph -->
    <p class="mb-6">
      En esta sección encontrarás respuestas a las dudas más frecuentes sobre el uso de la plataforma <strong>GuaraníHost</strong>, ya seas un <em>usuario que desea reservar</em> o un <em>anfitrión interesado en ofrecer sus servicios</em>. Nuestro objetivo es garantizarte una experiencia fluida, segura y clara en cada etapa.
    </p>

    <!-- Section: Account and profile -->
    <h2 class="text-2xl font-semibold text-primary mt-8">1. Cuenta y perfil</h2>
    <h3 class="font-semibold mt-4">¿Cómo creo una cuenta?</h3>
    <p>
      Haz clic en "Registrarse" en la parte superior derecha, completa tus datos personales (nombre, correo, contraseña, teléfono) y acepta los términos de uso. Recibirás un correo de confirmación.
    </p>

    <h3 class="font-semibold mt-4">¿Puedo modificar mis datos personales?</h3>
    <p>
      Sí. Accede a tu perfil desde el menú y selecciona “Editar perfil”. Podrás cambiar tu información, excepto el correo electrónico (por seguridad).
    </p>

    <h3 class="font-semibold mt-4">¿Olvidé mi contraseña, qué hago?</h3>
    <p>
      En la pantalla de inicio de sesión, haz clic en “¿Olvidaste tu contraseña?” y sigue las instrucciones. Recibirás un correo para restablecerla.
    </p>

    <!-- Section: Bookings and payments -->
    <h2 class="text-2xl font-semibold text-primary mt-8">2. Reservas y pagos</h2>
    <h3 class="font-semibold mt-4">¿Cómo reservo una propiedad o experiencia?</h3>
    <p>
      Busca el alojamiento o tour deseado. Haz clic en “Reservar”, selecciona las fechas disponibles y completa el formulario. Una vez enviada la solicitud, deberás realizar el pago para confirmar.
    </p>

    <h3 class="font-semibold mt-4">¿Qué métodos de pago aceptan?</h3>
    <p>
      Actualmente trabajamos con <strong>transferencias bancarias nacionales</strong>. Al finalizar la reserva, recibirás los datos de cuenta y deberás adjuntar el comprobante en tu perfil.
    </p>

    <h3 class="font-semibold mt-4">¿Cómo sé que mi reserva está confirmada?</h3>
    <p>
      Recibirás una notificación por email y podrás ver el estado como “Confirmada” en tu historial de reservas una vez validado el pago por parte del anfitrión.
    </p>

    <h3 class="font-semibold mt-4">¿Puedo cancelar una reserva?</h3>
    <p>
      Sí. Desde tu perfil puedes cancelar la reserva si la política del anfitrión lo permite. El reembolso, si aplica, dependerá de los términos del alojamiento o tour reservado.
    </p>

    <!-- Section: Hosts -->
    <h2 class="text-2xl font-semibold text-primary mt-8">3. Anfitriones</h2>
    <h3 class="font-semibold mt-4">¿Quién puede ser anfitrión?</h3>
    <p>
      Cualquier persona que cuente con una propiedad vacacional o que organice actividades turísticas dentro de Paraguay. Es necesario tener acceso a internet y disponibilidad para atender solicitudes.
    </p>

    <h3 class="font-semibold mt-4">¿Cómo me registro como anfitrión?</h3>
    <p>
      Completa el formulario en la sección <strong>“Contacto”</strong> indicando tu intención de ser anfitrión. Nuestro equipo te responderá con los pasos para habilitar tu perfil.
    </p>

    <h3 class="font-semibold mt-4">¿Qué tipo de propiedades puedo publicar?</h3>
    <p>
      Cabañas, departamentos, casas rurales, posadas, estancias o cualquier alojamiento que cumpla con los requisitos mínimos de comodidad, higiene y seguridad.
    </p>

    <h3 class="font-semibold mt-4">¿Puedo ofrecer solo tours?</h3>
    <p>
      Sí. También puedes publicar tours sin estar asociado a una propiedad, siempre que se trate de una actividad estructurada y segura para los visitantes.
    </p>

    <!-- Section: Security and trust -->
    <h2 class="text-2xl font-semibold text-primary mt-8">4. Seguridad y confianza</h2>
    <h3 class="font-semibold mt-4">¿Es segura la plataforma?</h3>
    <p>
      Sí. Toda la información se transmite cifrada, se protege la privacidad de los datos personales, y las reservas están sujetas a verificación manual por parte del equipo de GuaraníHost.
    </p>

    <h3 class="font-semibold mt-4">¿Qué pasa si tengo un problema durante mi estancia?</h3>
    <p>
      Contacta directamente al anfitrión. Si no recibes respuesta o hay un problema grave, puedes comunicarte con nuestro equipo a través del correo <strong>soporte@guaranihost.com</strong> y se abrirá un caso de revisión.
    </p>

    <h3 class="font-semibold mt-4">¿Puedo dejar valoraciones?</h3>
    <p>
      Sí. Al finalizar tu estancia o tour, se habilitará una sección para calificar y dejar comentarios. Esto ayuda a otros usuarios y mejora la calidad del servicio.
    </p>

    <!-- Section: Technical assistance -->
    <h2 class="text-2xl font-semibold text-primary mt-8">5. Asistencia técnica</h2>
    <h3 class="font-semibold mt-4">La web no carga correctamente</h3>
    <p>
      Prueba cerrar sesión y volver a ingresar. Si el error persiste, borra la caché del navegador o prueba en modo incógnito. Si sigue sin funcionar, escríbenos a <strong>tecnico@guaranihost.com</strong>.
    </p>

    <h3 class="font-semibold mt-4">No puedo subir imágenes</h3>
    <p>
      Asegúrate de que los archivos tengan un formato válido (JPG, PNG) y no superen el límite de tamaño permitido (5 MB por imagen). Revisa tu conexión antes de intentar nuevamente.
    </p>

    <h3 class="font-semibold mt-4">No recibí el email de confirmación</h3>
    <p>
      Verifica tu carpeta de spam. Si no está allí, puedes solicitar el reenvío desde la página de login. En caso de no recibirlo, contáctanos por soporte técnico.
    </p>

    <!-- Final assistance -->
    <h2 class="text-2xl font-semibold text-primary mt-8">¿Aún tienes preguntas?</h2>
    <p>
      Si no encontraste lo que buscabas, puedes contactarnos directamente a través de la sección <strong><a href="/contact" class="underline text-primary">Contacto</a></strong> y nuestro equipo estará encantado de ayudarte.
    </p>
  </section>
</template>

<script setup lang="ts">
// This component is static and does not require script logic,
// but can be extended in the future to load dynamic help content or FAQs from an API.
</script>
