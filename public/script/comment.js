const seeMoreLink = document.querySelectorAll(".see-more-link");
const replyLink = document.querySelectorAll(".reply-link");
const addReply = document.querySelectorAll(".add-reply");
for(let i = 0; i<replyLink.length; i++){
    replyLink[i].addEventListener("click", ()=>{
        addReply[i].classList.toggle("hidden");
    })
}
const commentReplies = document.querySelectorAll(".comment-replies");
for(let i = 0; i<seeMoreLink.length; i++){
    seeMoreLink[i].addEventListener("click", ()=>{
        commentReplies[i].classList.toggle("hidden");
    })
}

const like = document.querySelector(".fa-heart");
like.addEventListener("click", ()=>{
    like.classList.add("fa-beat");
    setTimeout(() => {
        like.classList.toggle("fa-regular")
        like.classList.toggle("fa-solid");
        like.classList.remove("fa-beat");
        like.classList.toggle("color-red");
    }, 500);
    
})


const comment = document.querySelector(".fa-comment");

comment.addEventListener("click", ()=>{
    var commentInput = document.getElementById("commentInput");
    commentInput.style.display = "block";
    commentInput.focus();
    commentInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});


// I may have to debug this part of code after I publish it on online paltform
function showShareMenu(title){
    if (navigator.share) {
        navigator.share({
            title: `${title}`,
            text: 'Check out my latest blog!',
            url: `https://localhost:3000/posts/${encodeURIComponent(title)}`,
            socialShareOptions: {
              whatsapp: {
                text: 'Share on WhatsApp',
                url: `whatsapp://send?text=Check%20out%20my%20latest%20blog!%20https%3A%2F%2Flocalhost%3A3000%2Fposts%2F${encodeURIComponent(title)}`
              },
              instagram: {
                text: 'Share on Instagram',
                url: `https://www.instagram.com/?url=https%3A%2F%2Flocalhost%3A3000%2Fposts%2F${encodeURIComponent(title)}`
              }
            }
          })
          .then(() => {
            console.log('Shared successfully.');
          })
          .catch((error) => {
            console.log('Error sharing:', error);
          });
      } else {
        console.log('Web Share API not supported.');
        // Fallback behavior or show custom share menu
      }
}

