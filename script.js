let searchInput = document.getElementById("search-input");
let searchBtn = document.getElementById("searchBtn");
let clearBtn = document.getElementById("clearBtn");
let disRes = document.getElementById("disRes");
let container = document.getElementById("container");
let container2 = document.getElementById("container2");
let cardModel = document.getElementById("card-model");
let cardDetails = document.getElementById("card-details");

const apiKey = "279c39b8ccfeb812eaba0a4823756112";
async function getData() {
  let api = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
  );
  let data = await api.json();
  let exportData = data.results;
  createCard(exportData);
}

async function createCard(exportData) {
  console.log(exportData);
  container.innerHTML = "";
  exportData.forEach((results) => {
    if (
      results.poster_path !== null &&
      results.original_title !== null &&
      results.overview !== null &&
      results.release_date !== null
    ) {
      let card = document.createElement("div");
      card.classList.add(
        "bg-[#2c2c2c]", 
        "text-white", 
        "rounded-[8px]", 
        "overflow-hidden", 
        "shadow-2xl",
        "flex", 
        "flex-col",
        "justify-between",
        "hover:scale-95", 
        "duration-300",
        "cursor-pointer",
        "relative",
        "mt-10"
      );

      let posterUrl = `https://image.tmdb.org/t/p/w500${results.poster_path}`;
      card.innerHTML = `
        <div class="relative">
            <img class="w-full" src="${posterUrl}" alt="${results.original_title}">
            <div class="text-[#FFD700] bg-gray-900 flex flex-col justify-center items-center absolute bottom-[-15px] left-2 h-9 w-9 rounded-[50%] text-xs"><p class="relative font-bold">${Math.round((results.vote_average/10)*100)}<sup class="text-[7px]">%</sup></p></div>
        </div>
        <div class="p-4 flex flex-col items-start justify-between">
          <h2 class="text-2xl font-bold text-[#FFD700] mb-2">${results.original_title}</h2>
          <small class="text-gray-400">Released On: <span>${results.release_date}</span></small>
          <i id="likeIcon" class="fa-regular fa-heart text-3xl text-[#FFD700] active:scale-95 m-0 mt-1 transition-all"></i>
        </div>
      `;
      card.addEventListener('click', () => {
        showCardDetails(results,posterUrl);
      });
      let likeIcon = card.querySelector('#likeIcon');
      likeIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        likeIcon.classList.toggle("fa-solid");
        likedMovies(exportData,card);
      });
      container.appendChild(card);
    };
  });
};

function likedMovies(){
  // let likedMoviesHeading = document.getElementById('likedMoviesHeading');
  // if(container2.innerHTML !== ''){
  //   likedMoviesHeading.style.opacity = '1';
  // }else{
  //   likedMoviesHeading.style.opacity = '0';
  // }
  container2.innerHTML = '';
  let cards = Array.from(container.children);
  let likedCards = cards.filter(card => card.querySelector('#likeIcon').classList.contains('fa-solid'));
  console.log(likedCards);
  likedCards.forEach(card => {
    let cardClone = card.cloneNode(true);
    container2.appendChild(cardClone);
    let likeIcon = card.querySelector('#likeIcon');
    likeIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!likeIcon.classList.contains('fa-solid')) {
        container2.removeChild(cardClone);
      }
    });
  });
};

function showCardDetails(results,posterUrl){
  cardModel.style.opacity = '1';
  cardModel.style.zIndex = '10';
  cardDetails.innerHTML = `
    <i class="fa-solid fa-circle-xmark cursor-pointer text-xl absolute top-3 left-5" id="closeBtn"></i>
    <h2 class="text-2xl font-bold text-gray-900 mb-2 mt-5">${results.original_title}</h2>
    <div class="flex justify-center items-center gap-5">
        <img class="w-[40%]" src="${posterUrl}" alt="${results.original_title}">
        <p>${results.overview}</p>
    </div>
    <div class="mt-4 flex justify-center items-center gap-5">
      <p class="font-bold text-[#7b1a1a]">Rating: ${results.vote_average} / 10</p>
      <p class="text-[#7b1a1a] font-bold">Released On: ${results.release_date}</p>
    </div>
  `;
  let closeBtn = cardDetails.querySelector("#closeBtn");
  closeBtn.addEventListener('click', () => {
    cardModel.style.opacity = '0';
    cardModel.style.zIndex = '-10';
  });
};

async function searchMovies(){
  let input = searchInput.value.trim();
  let api = await fetch(`https://api.themoviedb.org/3/search/movie?query=${input}&include_adult=false&language=en-US&api_key=${apiKey}`);
  let data = await api.json();
  console.log(data);
  if(input){
    closeBtn.style.opacity = '1';
    disRes.innerHTML = `Display Results for <strong>${input}</strong>`;
    createCard(data.results);
  }else{
    closeBtn.style.opacity = '0';
    disRes.innerHTML = ``;
    alert('plz enter a valid keyword');
  }
};

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  disRes.innerHTML = ``;
  getData();
});

searchBtn.addEventListener('click',searchMovies);
searchInput.addEventListener('input',searchMovies);

getData();
