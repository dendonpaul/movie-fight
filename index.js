//Other variables

//Fetch API data
const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "65384d8a",
      s: searchTerm,
    },
  });
  if (response.data.Response == "False") {
    return [];
  }
  return response.data.Search;
};

//Autocomplete Configs
const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster == "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}"/>
    ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "65384d8a",
        s: searchTerm,
      },
    });
    if (response.data.Response == "False") {
      return [];
    }
    return response.data.Search;
  },
};
//call autocomplete
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector(".autocomplete"),
  onOptionSelected(movie) {
    onMovieSelected(movie, document.querySelector(".movieContent"), "left");
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector(".autocomplete2"),
  onOptionSelected(movie) {
    onMovieSelected(movie, document.querySelector(".movieContent2"), "right");
  },
});

//Fetch individual movie details
let leftside;
let rightside;
const onMovieSelected = async (movie, loc, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "65384d8a",
      i: movie.imdbID,
    },
  });
  const option = movieTemplate(response.data);
  loc.innerHTML = option;

  if (side == "left") {
    leftside = response.data;
  } else {
    rightside = response.data;
  }

  if (leftside && rightside) {
    comparisonStart();
  }
};

//Comparison function
const comparisonStart = () => {
  document.querySelectorAll("input").disabled = true;
  const leftStats = document.querySelectorAll(".left .level-item");
  const rightStats = document.querySelectorAll(".right .level-item");

  leftStats.forEach((lstat, index) => {
    const rstat = rightStats[index];

    const lvalue = parseInt(lstat.dataset.value);
    const rvalue = parseInt(rstat.dataset.value);

    // if (lvalue > rvalue) {
    //   lstat.style.background = "green";
    //   rstat.style.background = "yellow";
    // } else {
    //   lstat.style.background = "yello";
    //   rstat.style.background = "green";
    // }
  });
};
//single movie template
const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);

  return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}"/>
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <div style="display:none">
    <article class="notification is-primary ">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary ">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary ">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    </div>
    <nav class="level">
        <div data-value=${metascore} class="level-item has-text-centered">
            <div>
            <p class="heading">Metascore</p>
            <p class="title">${movieDetail.Metascore}</p>
            </div>
        </div>
        <div data-value=${imdbRating} class="level-item has-text-centered">
            <div>
            <p class="heading">IMDB Rating</p>
            <p class="title">${movieDetail.imdbRating}</p>
            </div>
        </div>
        <div data-value=${dollars} class="level-item has-text-centered">
            <div>
            <p class="heading">Box Office</p>
            <p class="title">${movieDetail.BoxOffice}</p>
            </div>
        </div>
    </nav>
    `;
};
