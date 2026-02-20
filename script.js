// load si quiero cargar imagenes o estilos externos

window.onload = () => {
  // 1. DOM

  // const juego = document.getElementById("game");
  const contenedorTexto = document.getElementById("texto-contenedor");
  const resultadosWPM = document.getElementById("resultadosWPM");
  const resultadosAccuracy = document.getElementById("resultadosAccuracy");
  const btnReiniciar = document.getElementById("reload");
  const tiempo = document.getElementById("timer");
  const escritura = document.getElementById("escritura-contenedor");
  const seccionResultados = document.getElementById("resultados");

  // 2. Crear variables

  const textoFijo =
    "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.";
  let temporizador = 30;
  let intervalo = null;
  let tiempoInicio = null;
  let juegoFinalizado = false;

  // 3. Función para iniciar el juego

  function iniciarJuego() {
    // para añadir el texto en el div dnd va el texto separado por letras
    contenedorTexto.innerHTML = textoFijo
      .split("")
      .map((char) => `<span class="letra">${char}</span>`)
      .join("");
  }

  // 4. Funcion contador

  function contador() {
    // contador que empieza al empezar a escribir
    intervalo = setInterval(() => {
      // cuando empieza el intervalo va restando un segundo
      temporizador--;
      // y añado el tiempo que va quedando
      tiempo.innerText = temporizador;
      // si el tiempo llega a 0 se llama a la función finalizar el juego
      if (temporizador <= 0) {
        clearInterval(intervalo);
        finalizarJuego();
      }
    }, 1000);
  }

  // 5. Funcion empezar a escribir y comparar lo escrito con el texto y pintar

  function pintarLetras() {
    const letras = contenedorTexto.querySelectorAll(".letra");
    const textoEscrito = escritura.value.split("");

    letras.forEach((span, index) => {
      const caracterInput = textoEscrito[index];

      if (caracterInput == null) {
        span.classList.remove("correct", "incorrect");
      } else if (caracterInput === span.innerText) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
      }
    });
  }

  // 6. eventlisteners al escribir

  escritura.addEventListener("input", () => {
    if (juegoFinalizado) return;

    // Si es la primera vez que escribe, arranca contador
    if (!intervalo) {
      tiempoInicio = Date.now();
      contador();
    }

    pintarLetras();

    // Si llega al final del texto antes de los 30s
    if (escritura.value.length >= textoFijo.length) {
      finalizarJuego();
    }
  });

  // 7. Funcion Calcular resultados
  function calcularResultados() {
    let aciertos = 0;
    const textoEscrito = escritura.value.split("");

    textoEscrito.forEach((letra, i) => {
      if (letra === textoFijo[i]) aciertos++;
    });
    // datenow() devuelve el tiempo en milisegundos
    const segundos = (Date.now() - tiempoInicio) / 1000;
    const minutos = segundos / 60;

    // contar cuantas palabras correctas
    const palabrasCorrectas = aciertos / 5;
    const wpm = Math.round(palabrasCorrectas / minutos);

    // % de acierto
    const precision = Math.round((aciertos / textoEscrito.length) * 100);

    resultadosWPM.innerText = wpm;
    resultadosAccuracy.innerText = precision + "%";
  }

  // 8. Función de fin del juego

  // cuando el tiempo llegue a 0, para el juego
  // se calcula el wpm  y accuracy
  // se muestran los resultados y el boton de reinicio

  function finalizarJuego() {
    if (juegoFinalizado) return;
    juegoFinalizado = true;

    clearInterval(intervalo);
    intervalo = null;

    escritura.disabled = true;

    calcularResultados();

    // Mostrar resultados
    seccionResultados.style.display = "block";
  }

  // 9. función de reiniciar el juego

  function reiniciarJuego() {
    clearInterval(intervalo);

    temporizador = 30;
    intervalo = null;
    juegoFinalizado = false;
    tiempoInicio = null;

    tiempo.innerText = "30";

    escritura.value = "";
    escritura.disabled = false;

    resultadosWPM.innerText = "0";
    resultadosAccuracy.innerText = "0%";

    seccionResultados.style.display = "none";
    iniciarJuego();
    escritura.focus();
  }

  // 10. botón para reiniciar el juego
  btnReiniciar.addEventListener("click", reiniciarJuego);

  iniciarJuego();
};
