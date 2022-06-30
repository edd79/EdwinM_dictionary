const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    volume = wrapper.querySelector(".word i"),
    infoText = wrapper.querySelector(".info-text"),
    synonyms = wrapper.querySelector(".synonym .list"),
    removeIcon = wrapper.querySelector(".search span");
let audio;

const fetchApi = (word) => {
    infoText.style.color = "#000";
    wrapper.classList.remove("active");
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    synonyms.innerHTML = ""
    axios
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((res) => wordSearch(res.data, word))
        .catch((err) => console.log(err));

};

const wordSearch = (result, word) => {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    } else {
        wrapper.classList.add("active");

        let definitions = result[0].meanings[0].definitions[0];
        let phonetics = `${result[0].meanings[0].partOfSpeech}   ||   pronounced as ${result[0].phonetics[0].text}`;

        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;

        if (result[0].phonetics[0].audio) {
            audio = new Audio(result[0].phonetics[0].audio);
        } else {
            audio = new Audio("../noaudio.m4a");
        }

        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example || `No example available for ${word}`

        let similars = result[0].meanings[0].synonyms;

        for (var i = 0; i < similars.length; i++) {
            let similar = document.createElement("span");
            similar.innerHTML = similars[i];
            synonyms.appendChild(similar);
        }
    }
};

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML =
        "Type any existing word and press enter to get meaning, example, synonyms, etc.";
    wrapper.classList.remove("active");
});

volume.addEventListener("click", () => {
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() => {
        volume.style.color = "#999";
    }, 500);
});