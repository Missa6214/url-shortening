const hamburgerMenu = document.querySelector(".hamburger-menu");
const closeMenu = document.querySelector(".close-menu");
const nav = document.querySelector("nav");
const heroImg = document.querySelector(".hero-img");
const shortenInputLink = document.querySelector(".shorten-input-link");
const shortenBtn = document.querySelector(".shorten-btn");
const shortenForm = document.querySelector(".shorten-form");
const shortenLinkError = document.querySelector(".shorten-link-error");
const shortenLinkCards = document.querySelector(".shorten-link-cards");
const linkCardCopyBtns = document.querySelectorAll(".link-card__copy");
const toggles = [hamburgerMenu, closeMenu];

toggles.forEach((element) => {
    element.addEventListener("click", () => {
    nav.classList.toggle("visibility");
    hamburgerMenu.classList.toggle("visibility");
    closeMenu.classList.toggle("visibility");
    heroImg.classList.toggle("visibility")
    })
})

shortenForm.addEventListener("submit", (event) => {
    if (shortenInputLink.value.trim() === "") {
        event.preventDefault();
        shortenInputLink.classList.add("error");
        shortenInputLink.classList.add("error-border");
        shortenLinkError.classList.remove("hidden")
    }
})

userLinks.forEach((link) => {
    const div = document.createElement("div");
    div.classList.add("link-card");

    div.innerHTML = `
        <p class="link-card-original">${link.originalLink}</p>

        <hr>

        <div class="link-card-group">

            <div class="link-card-group-item">
            <button class="link-card_delete">
                <svg class="delete-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="#2acfcf" d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>
            </button>
            <a href="" class="link-card-short">${link.shortenLink}</a>
            </div>

          <button class="link-card__copy">Copy!</button>
        </div>
    `


    const deleBtn = div.querySelector(".link-card_delete");
    deleBtn.addEventListener("click", async () => {
        await fetch(`/links/${link.id}`, {
            method: "DELETE"
        });
        div.remove()
    });

      const btn = div.querySelector(".link-card__copy");

      btn.addEventListener("click", async () => {
        const url = btn.parentElement.querySelector(".link-card-short").textContent;
        await navigator.clipboard.writeText(url);

        btn.textContent = "Copied!";
        btn.classList.add("link-card__copied");

        setTimeout(() => {
            btn.textContent = "Copy!";
            btn.classList.remove("link-card__copied");
        }, 2000);
        
    })


    shortenLinkCards.appendChild(div);

})
