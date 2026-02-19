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

//-----------------------------

//-----------------------------
//==[ 1. BASIC INFO ]==
let blogName = "My Blog Name";
let authorName = "My Name Here";
let authorLink = ""; 

//-----------------------------
//==[ 2. POSTS ARRAY ]==
let postsArray = [
  [ "posts/2020-11-10-Post-Template.html" ],
  [ "posts/2020-11-10-HTML-cheat-sheet.html" ],
];

//-----------------------------
//==[ 3. GENERATING THE HTML SECTIONS TO BE INSERTED ]==
let url = window.location.pathname;
const postDateFormat = /\d{4}\-\d{2}\-\d{2}\-/;
let relativePath = url.includes("posts/") ? ".." : ".";

let headerHTML = '<ul> <li><a href="' + relativePath + '/index.html">Home</a></li>' + 
                 '<li><a href="' + relativePath + '/archive.html">Archive</a></li>' +
                 '<li><a href="' + relativePath + '/about.html">About</a></li> </ul>';

let footerHTML = "<hr><p>" + blogName + " is written by <a href='" + authorLink + "'>" + authorName + "</a>, built with <a href='https://zonelets.net/'>Zonelets</a>, and hosted by <a href='https://neocities.org/'>Neocities!</a></p>";

let currentIndex = -1;
let currentFilename = url.substring(url.lastIndexOf('posts/'));
if (!currentFilename.endsWith(".html")) currentFilename += ".html";

for (let i = 0; i < postsArray.length; i++) {
  if (postsArray[i][0] === currentFilename) currentIndex = i;
}

function formatPostTitle(i) {
  if (postsArray[i].length > 1) return decodeURI(postsArray[i][1]);
  else {
    if (postDateFormat.test(postsArray[i][0].slice(6,17))) {
      return postsArray[i][0].slice(17,-5).replace(/-/g," ");
    } else {
      return postsArray[i][0].slice(6,-5).replace(/-/g," ");
    }
  }
}

let currentPostTitle = "";
let niceDate = "";
if (currentIndex > -1) {
  currentPostTitle = formatPostTitle(currentIndex);
  if (postDateFormat.test(postsArray[currentIndex][0].slice(6,17))) {
    let monthSlice = postsArray[currentIndex][0].slice(11,13);
    let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(monthSlice)-1];
    niceDate = postsArray[currentIndex][0].slice(14,16) + " " + month + ", " + postsArray[currentIndex][0].slice(6,10);
  }
}

// Post List HTML
function formatPostLink(i) {
  let postTitle_i = postsArray[i].length > 1 ? decodeURI(postsArray[i][1]) :
                    postDateFormat.test(postsArray[i][0].slice(6,17)) ? postsArray[i][0].slice(17,-5).replace(/-/g," ") :
                    postsArray[i][0].slice(6,-5).replace(/-/g," ");

  if (postDateFormat.test(postsArray[i][0].slice(6,17))) {
    return '<li><a href="' + relativePath + '/'+ postsArray[i][0] +'">' + postsArray[i][0].slice(6,16) + " \u00BB " + postTitle_i + '</a></li>';
  } else {
    return '<li><a href="' + relativePath + '/'+ postsArray[i][0] +'">' + postTitle_i + '</a></li>';
  }
}

let postListHTML = "<ul>";
for (let i = 0; i < postsArray.length; i++) postListHTML += formatPostLink(i);
postListHTML += "</ul>";

let recentPostsCutoff = 3;
let recentPostListHTML = "<h2>Recent Posts:</h2><ul>";
let numberOfRecentPosts = Math.min(recentPostsCutoff, postsArray.length);
for (let i = 0; i < numberOfRecentPosts; i++) recentPostListHTML += formatPostLink(i);
if (postsArray.length > recentPostsCutoff) recentPostListHTML += '<li class="moreposts"><a href=' + relativePath + '/archive.html>\u00BB more posts</a></li></ul>';
else recentPostListHTML += "</ul>";

// Next / Previous Links
let nextprevHTML = "";
let nextlink = "";
let prevlink = "";

if (postsArray.length < 2) nextprevHTML = '<a href="' + relativePath + '/index.html">Home</a>';
else if (currentIndex === 0) {
  prevlink = postsArray[currentIndex + 1][0];
  nextprevHTML = '<a href="' + relativePath + '/index.html">Home</a> | <a href="'+ relativePath + '/' + prevlink +'">Previous Post \u00BB</a>';
} else if (currentIndex === postsArray.length - 1) {
  nextlink = postsArray[currentIndex - 1][0];
  nextprevHTML = '<a href="' + relativePath + '/' + nextlink +'">\u00AB Next Post</a> | <a href="' + relativePath + '/index.html">Home</a>';
} else if (0 < currentIndex && currentIndex < postsArray.length - 1) {
  nextlink = postsArray[currentIndex - 1][0];
  prevlink = postsArray[currentIndex + 1][0];
  nextprevHTML = '<a href="' + relativePath + '/'+ nextlink +'">\u00AB Next Post</a> | <a href="' + relativePath + '/index.html">Home</a> | <a href="' + relativePath + '/'+ prevlink +'">Previous Post \u00BB</a>';
}

// Insert sections
if (document.getElementById("nextprev")) document.getElementById("nextprev").innerHTML = nextprevHTML;
if (document.getElementById("postlistdiv")) document.getElementById("postlistdiv").innerHTML = postListHTML;
if (document.getElementById("recentpostlistdiv")) document.getElementById("recentpostlistdiv").innerHTML = recentPostListHTML;
if (document.getElementById("header")) document.getElementById("header").innerHTML = headerHTML;
if (document.getElementById("blogTitleH1")) document.getElementById("blogTitleH1").innerHTML = blogTitle;
if (document.getElementById("postTitleH1")) document.getElementById("postTitleH1").innerHTML = currentPostTitle;
if (document.getElementById("postDate")) document.getElementById("postDate").innerHTML = niceDate;
if (document.getElementById("footer")) document.getElementById("footer").innerHTML = footerHTML;
if (document.title === "Blog Post") document.title = currentPostTitle;

//==============================
//==[ FUNCION UNIFICADA PARA CARGAR POSTS EN LIBRO ]==
let currentBookIndex = 0;

function cargarPostEnLibro(index) {
  const izq = document.getElementById("izq");
  const der = document.getElementById("der");
  if (!izq || !der) return;

  izq.innerHTML = "";
  der.innerHTML = "";

  let postPath = postsArray[index][0];

  fetch(postPath)
    .then(response => response.text())
    .then(data => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(data, "text/html");
      let content = doc.querySelector("#content");
      if (!content) return;

      let cloned = content.cloneNode(true);
      cloned.querySelector("#nextprev")?.remove();
      cloned.querySelector("#postTitleH1")?.remove();
      cloned.querySelector("#postDate")?.remove();

      // Título incluido en el flujo
      let titulo = document.createElement("h1");
      titulo.textContent = formatPostTitle(index);
      cloned.insertBefore(titulo, cloned.firstChild);
 
      // Contenedor temporal
      let tempContainer = document.createElement("div");
      Array.from(cloned.children).forEach(el => tempContainer.appendChild(el));

      // Esperar imágenes antes de repartir
      let images = tempContainer.querySelectorAll("img");
      if (images.length === 0) repartirContenido();
      else {
        let loaded = 0;
        images.forEach(img => {
          img.onload = img.onerror = () => {
            loaded++;
            if (loaded === images.length) repartirContenido();
          };
        });
      }

      function repartirContenido() {
        let children = Array.from(tempContainer.children);
        izq.innerHTML = "";
        der.innerHTML = "";

        let maxHeight = izq.clientHeight;

        for (let el of children) {
          izq.appendChild(el);
          if (izq.scrollHeight > maxHeight) {
            izq.removeChild(el);
            der.appendChild(el);
          }
        }
      }
    })
    .catch(error => console.log("Error cargando post:", error));
}

//==============================
//==[ INICIALIZAR INDEX Y NAVEGACION ]==
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.endsWith("index.html") && postsArray.length > 0) {
    currentBookIndex = 0;
    cargarPostEnLibro(currentBookIndex);

    const prevBtn = document.getElementById("next");
    const nextBtn = document.getElementById("prev");

    if (prevBtn) prevBtn.addEventListener("click", () => {
      if (currentBookIndex < postsArray.length - 1) {
        currentBookIndex++;
        cargarPostEnLibro(currentBookIndex);
      }
    });

    if (nextBtn) nextBtn.addEventListener("click", () => {
      if (currentBookIndex > 0) {
        currentBookIndex--;
        cargarPostEnLibro(currentBookIndex);
      }
    });
  }
});


