document.addEventListener('DOMContentLoaded', () => {

  let imageId = 5550 //Enter the id from the fetched image here
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const $ = {
    image: document.querySelector('#image'),
    imageTitle: document.querySelector('#name'),
    likes: document.querySelector('#likes'),
    likeButton: document.querySelector('#like_button'),
    commentContainer: document.querySelector('#comments'),
    commentForm: document.querySelector('#comment_form'),
  }

  fetch(imageURL)
    .then(response => response.json())
    .then(receiveAPIData)

  function receiveAPIData(results){
    $.image.src = results.url
    $.imageTitle.textContent = results.name
    $.likes.textContent = results.like_count
    renderComments(results.comments)
  }

  $.likeButton.addEventListener('click', increaseLikes)
  $.commentForm.addEventListener('submit', newComment)

  function increaseLikes(event){
    $.likes.textContent = +$.likes.textContent + 1
    boilerPlateFetch(likeURL, 'POST', {image_id: imageId})
  }

  function renderComments(comments){
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
    boilerPlateFetch(commentsURL + parentElement.dataset.id, 'DELETE', {})
  }

  function newComment(event){
    event.preventDefault()
    const formData = new FormData($.commentForm)
    const comment = formData.get('comment')
    $.commentForm.reset()
    const $li = appendComment(comment, NaN)
    boilerPlateFetch(commentsURL, 'POST', {
      image_id: imageId, 
      content: comment
    })
      .then(results => updateCommentFromAPI(results, $li))
  }

  function updateCommentFromAPI(comment, $li){
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

})

