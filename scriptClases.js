class Game {
  constructor(textoFijo) {
    // 1. DOM. Referencias a elementos
    this.contenedorTexto = document.getElementById("texto-contenedor");
    this.resultadosWPM = document.getElementById("resultadosWPM");
    this.resultadosAccuracy = document.getElementById("resultadosAccuracy");
    this.btnReiniciar = document.getElementById("reload");
    this.tiempo = document.getElementById("timer");
    this.escritura = document.getElementById("escritura-contenedor");
    this.seccionResultados = document.getElementById("resultados");

    // 2. Variables de estado
    this.textoFijo = textoFijo;
    this.temporizador = 30;
    this.intervalo = null;
    this.tiempoInicio = null;
    this.juegoFinalizado = false;

    // 6. Eventlisteners
    this.escritura.addEventListener("input", () => {
      if (this.juegoFinalizado) return;

      if (!this.intervalo) {
        this.tiempoInicio = Date.now();
        this.contador();
      }

      this.pintarLetras();

      if (this.escritura.value.length >= this.textoFijo.length) {
        this.finalizarJuego();
      }
    });

    // 10. Botón reiniciar
    this.btnReiniciar.addEventListener("click", () => this.reiniciarJuego());

    this.iniciarJuego();
  }

  // 3. Función para iniciar el juego
  iniciarJuego() {
    this.contenedorTexto.innerHTML = this.textoFijo
      .split("")
      .map((char) => `<span class="letra">${char}</span>`)
      .join("");
  }

  // 4. Funcion contador
  contador() {
    this.intervalo = setInterval(() => {
      this.temporizador--;
      this.tiempo.innerText = this.temporizador;
     
      if (this.temporizador <= 0) {
        clearInterval(this.intervalo); 
        this.finalizarJuego();
      }
    }, 1000);
  }

  // 5. Funcion pintar letras
  pintarLetras() {
    const letras = this.contenedorTexto.querySelectorAll(".letra");
    const textoEscrito = this.escritura.value.split("");

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

  // 7. Calcular resultados
  calcularResultados() {
    let aciertos = 0;
    const textoEscrito = this.escritura.value.split("");

    textoEscrito.forEach((letra, i) => {
      if (letra === this.textoFijo[i]) aciertos++;
    });

    const segundos = (Date.now() - this.tiempoInicio) / 1000;
    const minutos = segundos / 60;

    const palabrasCorrectas = aciertos / 5;
    const wpm = Math.round(palabrasCorrectas / minutos);
    const precision = Math.round((aciertos / textoEscrito.length) * 100);

    this.resultadosWPM.innerText = wpm;
    this.resultadosAccuracy.innerText = (precision || 0) + "%";
  }

  // 8. Función de fin del juego
  finalizarJuego() {
    if (this.juegoFinalizado) return;
    this.juegoFinalizado = true;

    clearInterval(this.intervalo);
    this.intervalo = null;
    this.escritura.disabled = true;

    this.calcularResultados();
    this.seccionResultados.style.display = "block";
  }

  // 9. función de reiniciar el juego
  reiniciarJuego() {
    clearInterval(this.intervalo);

    this.temporizador = 30;
    this.intervalo = null;
    this.juegoFinalizado = false;
    this.tiempoInicio = null;

    this.tiempo.innerText = "30";
    this.escritura.value = "";
    this.escritura.disabled = false;

    this.resultadosWPM.innerText = "0";
    this.resultadosAccuracy.innerText = "0%";

    this.seccionResultados.style.display = "none";
    this.iniciarJuego();
    this.escritura.focus();
  }
}

window.onload = () => {
  const texto = "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.";
  new Game(texto);
};