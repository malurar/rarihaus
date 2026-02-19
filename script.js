/*Welcome to the script file! Your 1st time here, you should update
  the BASIC INFO section to include your name and website/social 
  media link (if desired). Most of the time, you will just come
  here to update the POSTS ARRAY. However, you can also edit or
  add your own scripts to do whatever you like!*/

//TABLE OF CONTENTS
  // 1. Basic Info
  // 2. Posts Array
  // 3. Creating HTML Sections to Be Inserted (Header, Footer, etc)
  // 4. Inserting the Sections Into our Actual HTML Pages

// 1. CONFIGURACIÓN BÁSICA
let blogName = "Mi Blog";
let authorName = "Autor";
let authorLink = ""; 

let postsArray = [
  ["posts/2020-11-11-Un-titulo-tituloso.html"],
    ["posts/2020-11-10-Post-nuevo.html"],
    ["posts/2020-11-10-HTML-cheat-sheet.html"]
];

// 2. VARIABLES DE ESTADO Y UTILIDADES
let url = window.location.pathname;
const postDateFormat = /\d{4}\-\d{2}\-\d{2}\-/;
let currentBookIndex = 0;   // Índice del post en la lista
let subPaginaActual = 0;    // Hoja actual dentro del post largo
let paginasDelPost = [];    // Almacena el contenido dividido por hojas
const MAX_HEIGHT = 560;     // Altura máxima según tu CSS

function formatPostTitle(i) {
    if (postsArray[i].length > 1) return decodeURI(postsArray[i][1]);
    let name = postsArray[i][0];
    if (postDateFormat.test(name.slice(6, 17))) {
        return name.slice(17, -5).replace(/-/g, " ");
    } else {
        return name.slice(6, -5).replace(/-/g, " ");
    }
}

// 3. LÓGICA DE DISTRIBUCIÓN (Paginación interna)
function repartirContenidoEnHojas(container) {
    const izq = document.getElementById("izq");
    paginasDelPost = []; 
    subPaginaActual = 0;

    let elementos = Array.from(container.children);
    let paginaActual = [];
    let alturaAcumulada = 0;

    // Medidor invisible para calcular espacio real
    let medidor = document.createElement("div");
    medidor.style.visibility = "hidden";
    medidor.style.position = "absolute";
    medidor.style.width = (izq.clientWidth || 500) + "px";
    document.body.appendChild(medidor);

    elementos.forEach((el) => {
        let clon = el.cloneNode(true);
        medidor.appendChild(clon);
        let altoElemento = medidor.offsetHeight;

        // Si el elemento no cabe, cerramos esta página y abrimos otra
        if (alturaAcumulada + altoElemento > MAX_HEIGHT && paginaActual.length > 0) {
            paginasDelPost.push(paginaActual);
            paginaActual = [el.cloneNode(true)];
            alturaAcumulada = altoElemento;
        } else {
            paginaActual.push(el.cloneNode(true));
            alturaAcumulada += altoElemento;
        }
        medidor.innerHTML = ""; 
    });
    
    if (paginaActual.length > 0) paginasDelPost.push(paginaActual);
    document.body.removeChild(medidor);

    renderizarLibro();
}

// Muestra las páginas correspondientes en el libro
function renderizarLibro() {
    const izq = document.getElementById("izq");
    const der = document.getElementById("der");
    izq.innerHTML = "";
    der.innerHTML = "";

    let indiceIzq = subPaginaActual * 2;
    let indiceDer = (subPaginaActual * 2) + 1;

    if (paginasDelPost[indiceIzq]) {
        paginasDelPost[indiceIzq].forEach(el => izq.appendChild(el.cloneNode(true)));
    }
    if (paginasDelPost[indiceDer]) {
        paginasDelPost[indiceDer].forEach(el => der.appendChild(el.cloneNode(true)));
    }
// --- LÓGICA PARA OCULTAR FLECHAS ---
    const btnPrev = document.getElementById("prev");
    const btnNext = document.getElementById("next");

    if (btnPrev) {
        // Ocultamos el botón "Anterior" (izquierda) si:
        // Estamos en el post 0 Y en la primera hoja de ese post
        if (currentBookIndex === 0 && subPaginaActual === 0) {
            btnPrev.style.visibility = "hidden";
        } else {
            btnPrev.style.visibility = "visible";
        }
    }

    if (btnNext) {
        // Ocultamos el botón "Siguiente" (derecha) si:
        // Estamos en el último post Y en la última pareja de páginas
        let esUltimoPost = currentBookIndex === postsArray.length - 1;
        let esUltimaHoja = (subPaginaActual * 2) + 2 >= paginasDelPost.length;

        if (esUltimoPost && esUltimaHoja) {
            btnNext.style.visibility = "hidden";
        } else {
            btnNext.style.visibility = "visible";
        }
    }


}


function cargarPostEnLibro(index) {
    let postPath = postsArray[index][0];

    fetch(postPath)
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, "text/html");
            let content = doc.querySelector("#content");
            if (!content) return;

            // 1. Extraer la fecha del HTML original antes de borrarla
            let fechaOriginal = doc.querySelector("#postDate") ? doc.querySelector("#postDate").innerHTML : "";
            
            // Si el post no tiene fecha escrita, intentamos sacarla del nombre del archivo (formato Zonelets)
            if (!fechaOriginal && postDateFormat.test(postPath.slice(6, 17))) {
                let monthSlice = postPath.slice(11, 13);
                let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(monthSlice)-1];
                fechaOriginal = postPath.slice(14, 16) + " " + month + ", " + postPath.slice(6, 10);
            }

            // 2. Limpiamos elementos que no queremos del cuerpo del texto
            content.querySelectorAll("#nextprev, #postTitleH1, #postDate").forEach(el => el.remove());

            let temp = document.createElement("div");
            
            // 3. Insertar el Título
            let titulo = document.createElement("h1");
            titulo.textContent = formatPostTitle(index);
            temp.appendChild(titulo);

            // 4. Insertar la Fecha (si existe)
            if (fechaOriginal) {
                let fechaElemento = document.createElement("h2"); // Usamos h2 como en tu CSS
                fechaElemento.id = "postDateLibro"; // ID único por si quieres darle estilo
                fechaElemento.innerHTML = fechaOriginal;
                fechaElemento.style.marginBottom = "20px"; // Espacio antes del texto
                temp.appendChild(fechaElemento);
            }

            // 5. Pasar el resto del contenido
            while (content.firstChild) {
                temp.appendChild(content.firstChild);
            }

            // 6. Esperar imágenes y repartir
            let images = temp.querySelectorAll("img");
            if (images.length === 0) {
                repartirContenidoEnHojas(temp);
            } else {
                let loaded = 0;
                images.forEach(img => {
                    img.onload = img.onerror = () => {
                        loaded++;
                        if (loaded === images.length) repartirContenidoEnHojas(temp);
                    };
                });
            }
        })
        .catch(err => console.error("Error cargando post:", err));
}

// 4. INICIALIZACIÓN Y NAVEGACIÓN
document.addEventListener("DOMContentLoaded", function() {
    // Detectamos si estamos en la página de archivo
    const esPaginaArchivo = window.location.pathname.includes('archive.html');
    const libroExiste = document.getElementById("izq") && document.getElementById("der");

    if (esPaginaArchivo) {
        // MODO ARCHIVO: No cargamos posts, generamos la lista
        generarIndice();
    } 
    else if (libroExiste && postsArray.length > 0) {
        // MODO LIBRO: Cargamos el sistema normal de lectura
        
        // Verificar si venimos desde el índice con un post específico
        const urlParams = new URLSearchParams(window.location.search);
        const postParam = urlParams.get('post');
        if (postParam !== null) currentBookIndex = parseInt(postParam);

        cargarPostEnLibro(currentBookIndex);

        // Lógica de botones (se mantiene igual)
        const btnPrev = document.getElementById("prev");
        const btnNext = document.getElementById("next");

        if (btnNext) {
            btnNext.onclick = function() {
                if ((subPaginaActual * 2) + 2 < paginasDelPost.length) {
                    subPaginaActual++;
                    renderizarLibro();
                } else if (currentBookIndex < postsArray.length - 1) {
                    currentBookIndex++;
                    cargarPostEnLibro(currentBookIndex);
                }
            };
        }

        if (btnPrev) {
            btnPrev.onclick = function() {
                if (subPaginaActual > 0) {
                    subPaginaActual--;
                    renderizarLibro();
                } else if (currentBookIndex > 0) {
                    currentBookIndex--;
                    cargarPostEnLibro(currentBookIndex);
                }
            };
        }
    }
});


function generarIndice() {
    const izq = document.getElementById("izq");
    const der = document.getElementById("der");
    if (!izq || !der) return;

    izq.innerHTML = "<h1>Índice</h1>";
    der.innerHTML = "<h1>...</h1>";

    let ul = document.createElement("ul");
    ul.className = "lista-archivo"; // Para que le des estilo en CSS

    postsArray.forEach((post, i) => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        
        // Usamos tu función formatPostTitle para que los nombres se vean limpios
        a.textContent = formatPostTitle(i);
        a.href = "index.html?post=" + i;
        
        li.appendChild(a);
        ul.appendChild(li);
    });

    // En el archivo, mostramos la lista en la página izquierda
    izq.appendChild(ul);
}