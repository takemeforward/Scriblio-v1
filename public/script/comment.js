let userData = null;
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
  like.classList.toggle("fa-solid");
  like.classList.toggle("fa-bounce");
  like.classList.toggle("color-red");
  setTimeout(() => {
    like.classList.remove("fa-bounce");
  }, 400);

  if(userData==null){
                const pageError = document.getElementById("page-error");
                pageError.classList.remove("hidden");
                pageError.textContent = "Login/Signup to like this post"
    setTimeout(() => {
                like.classList.add("fa-regular");
                like.classList.remove("fa-solid");
                like.classList.remove("color-red");
                pageError.classList.add("hidden");
                
    }, 1000);
    
  }
  else{
    $.ajax({
      type: 'POST',
      url: '/like',
      data: $('#likeForm').serialize(),
      success: function(response) {
        // Handle the server response
        console.log(response);
        if(response){
                like.classList.add("fa-solid");
                like.classList.remove("fa-regular");
                like.classList.add("color-red");
                const likeCount = document.getElementById("like-count").innerHTML;
                document.getElementById("like-count").innerHTML = (Number(likeCount) + 1);  // update like on the go

        }else{
                
                like.classList.add("fa-regular");
                like.classList.remove("fa-solid");
                like.classList.remove("color-red");
                const likeCount = document.getElementById("like-count").innerHTML;
                document.getElementById("like-count").innerHTML = (Number(likeCount) - 1);  // update like on the go
                console.log(Number(likeCount) - 1);
                window.alert("Like removed");
                
                
        }
        // Update the page dynamically based on the response
        // ...
      },
      error: function(error) {
        console.error(error);
      }
    });
  }
    
    
    
});


$(document).ready(function() {
  $('#commentInput').on('keydown', function(event) {
    if (event.keyCode === 13) { // Enter key
      event.preventDefault(); // Prevent default behavior
      submitComment(); // Manually trigger the submission
    }
  });

  function submitComment() {
    $.ajax({
      type: 'POST',
      url: '/comment',
      data: $('#commentForm').serialize(),
      success: function(response) {
        // Handle the server response
        console.log(response);
        if(response){
          window.location.reload();
        }
                
        // Update the page dynamically based on the response
        // ...
      },
      error: function(error) {
        console.error(error);
      }
    });
  }
});



// focus to comment section
const comment = document.querySelector(".fa-comment");

comment.addEventListener("click", ()=>{
    var commentInput = document.getElementById("commentInput");
    commentInput.style.display = "block";
    commentInput.focus();
    commentInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});


// I may have to debug this part of code after I publish it on online paltform
function showShareMenu(id) {
  if (navigator.share) {
    const title = id;
    const url = `https://scriblio.onrender.com/posts/${encodeURIComponent(id)}`;

    navigator.share({
      title: title,
      text: 'Check out my latest blog!',
      url: url,
      socialShareOptions: {
        whatsapp: {
          text: 'Share on WhatsApp',
          url: `whatsapp://send?text=Check%20out%20my%20latest%20blog!%20${encodeURIComponent(url)}`
        },
        instagram: {
          text: 'Share on Instagram',
          url: `https://www.instagram.com/?url=${encodeURIComponent(url)}`
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

// things to check when content is loaded
document.addEventListener("DOMContentLoaded",()=>{
  // get user login information
  // post liked information
  fetch("/userinfo")
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error: ' + response.status);
    }
  })
  .then(function(data) {
    userData = data;
    console.log(data); // Log the user login information
    
  })
  .catch((err)=>{
    console.log(err);
  })
})



function managePostLikes(userLoginInfo){

}