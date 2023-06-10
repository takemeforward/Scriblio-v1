function theme(argument) {
    const element = document.body;
    const card = document.querySelectorAll(".card");

    element.classList.toggle("dark-mode");

    card.forEach((c)=>{
        c.classList.toggle("card-dark");
    })
    // card.classList.toggle("card-dark");
}