<script>
const texto = "Texto muy largo que debería continuar en el otro div...";
const Parrafo-izq = document.getElementById("Parrafo-izq");
const Parrafo-der = document.getElementById("Parrafo-der");

Parrafo-izq.textContent = texto;

if (Parrafo-izq.scrollHeight > Parrafo-izq.clientHeight) {
  let palabras = texto.split(" ");
  Parrafo-izq.textContent = "";

  while (palabras.length > 0) {
    Parrafo-izq.textContent += palabras[0] + " ";
    if (Parrafo-izq.scrollHeight > Parrafo-izq.clientHeight) {
      palabras.shift();
      break;
    }
    palabras.shift();
  }

  Parrafo-der.textContent = palabras.join(" ");
}
</script>