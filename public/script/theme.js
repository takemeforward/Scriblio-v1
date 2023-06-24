function theme(argument) {
    const element = document.body;
    const card = document.querySelectorAll(".card");

    element.classList.toggle("dark-mode-l1");
    const formControl = document.querySelector(".form-control");
    formControl.classList.toggle("dark-mode-l2")
    card.forEach((c)=>{
        c.classList.toggle("card-dark");
    })
    // card.classList.toggle("card-dark");
}