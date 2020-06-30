const imageId = 5550 // Id from the fetched image
const url = {
  image: `https://randopic.herokuapp.com/images/${imageId}`,
  like: `https://randopic.herokuapp.com/likes/`,
  comments: `https://randopic.herokuapp.com/comments/`,
}

const $ = {
  image: document.querySelector('#image'),
  imageTitle: document.querySelector('#name'),
  likes: document.querySelector('#likes'),
  likeButton: document.querySelector('#like_button'),
  commentContainer: document.querySelector('#comments'),
  commentForm: document.querySelector('#comment_form'),
}

$.likeButton.addEventListener('click', increaseLikes)
$.commentForm.addEventListener('submit', newComment)

fetch(url.image)
  .then(response => response.json())
  .then(populatePageWithAPIData)

function populatePageWithAPIData(results){
  $.image.src = results.url
  $.imageTitle.textContent = results.name
  $.likes.textContent = results.like_count
  parseComments(results.comments)
}

function increaseLikes(){
  $.likes.textContent = +$.likes.textContent + 1
  boilerPlateFetch(url.like, 'POST', {image_id: imageId})
}

function parseComments(comments){
  comments.forEach(comment => appendComment(comment.content, comment.id))
}

function appendComment(comment, commentId){
  const $li = document.createElement('li')
  $li.textContent = comment
  $li.dataset.id = commentId
  $li.style.marginBottom = '1em'
  appendDeleteButton($li)
  $.commentContainer.append($li)
  return $li
}

function appendDeleteButton($li){
  const $remove = document.createElement('button')
  $remove.textContent = 'x'
  $remove.style.marginLeft = '1em'
  $remove.addEventListener('click', deleteComment)
  $li.append($remove)
}

function deleteComment(event){
  const parentElement = event.target.parentNode
  parentElement.remove()
  boilerPlateFetch(url.comments + parentElement.dataset.id, 'DELETE', {
    message: 'Comment successfully destroyed.'
  })
}

function newComment(event){
  event.preventDefault()
  const formData = new FormData($.commentForm)
  const comment = formData.get('comment')
  $.commentForm.reset()
  const $li = appendComment(comment, NaN)
  boilerPlateFetch(url.comments, 'POST', {
    image_id: imageId, 
    content: comment
  })
    .then(results => updateNewCommentFromAPI(results, $li))
}

function updateNewCommentFromAPI(comment, $li){
  $li.dataset.id = comment.id
}

async function boilerPlateFetch(url, method, body) {
  const response = await fetch(url, {
    method: method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body), 
  })
  return response.json()
}

