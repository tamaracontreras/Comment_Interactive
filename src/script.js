const mainComments = document.querySelectorAll('.comment__container')
const commentReplies = document.querySelectorAll('.comment__container-reply')
let comments = []

const firstWord = (text) => {
  const splitedString = text.split(' ');
  const marked = document.createElement('span');
  const paragraph = document.createElement('p');
  const restString = document.createTextNode(splitedString.slice(1).join(' '))
  marked.classList.add('blue')
  marked.innerHTML = `${splitedString[0]} `
  paragraph.append(marked)
  paragraph.append(restString)
  return paragraph
}

const plusValue = (elem) => {
  elem.closest('.counter').querySelector('.counter__value').innerHTML =
  Number.parseInt(elem.closest('.counter').querySelector('.counter__value').innerHTML) + 1
}
const minusValue = (elem) => {
  elem.closest('.counter').querySelector('.counter__value').innerHTML =
  Number.parseInt(elem.closest('.counter').querySelector('.counter__value').innerHTML) - 1
}

function moveCursorToEnd(e) { 
  e.focus()
  if (typeof e.selectionStart == "number") {
    e.selectionStart = e.selectionEnd = e.value.length;
  } else if (typeof e.createTextRange != "undefined") {           
      let range = e.createTextRange();
      range.collapse(false);
      range.select();
  }
}

const sendComment = (src, username) => {
   const div = document.createElement('div')
   div.classList.add('comment__container')
   // div.classList.add('comment__container-reply')
   div.classList.add('current__user')
   const text = document.querySelector('.comment__input').value
   const currentComm = `
   <div class="comment__card">
     <div class="comment__counter counter">
       <div class="counter__plus">
       <img src="./images/icon-plus.svg" alt="plus">
       </div>
       <div class="counter__value">0</div>
       <div class="counter__minus">
         <img src="./images/icon-minus.svg" alt="minus">
         </div>
     </div>
     <div class="comment__main">
       <div class="comment__header header">
         <div class="header__user user">
           <div class="user__avatar">
             <img src="${src}" alt="avatar">
           </div>
           <div class="user__name"><a href="#" class="id">${username}</a></div>
           <div class="user__marker">you</div>
           <div class="user__time">1 minutes ago</div>
         </div>
         <div class="user__action">
           <div class="header__delete"><img src="./images/icon-delete.svg" alt="Reply"> Delete</div>
           <div class="header__update"><img src="./images/icon-edit.svg" alt="Reply"> Edit</div>
         </div>
        
       </div>
       <div class="comment__text">
         ${text}
       </div>
     </div>
   </div>`
   if(text !== ''){
    div.innerHTML = currentComm
    comments.push(div)
    return div
   }
}

const getData = async () => {
  return await fetch('./data.json')
  .then(async (response) => { 
    try {
      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  });
} 

localStorage.clear()

// const saveComments = () => {
// mainComments.forEach(comment => {
//   comment = {
//     name: name,
//     img: img,
//     text: text,
//     and so on...;
//   }

//   comments.push(comment)
// })
// localStorage.setItem('comments', JSON.stringify(comments)) // push comment into 
// comments arr
//}
// }

// const showComments = () => {
  // need to know about reply
  // idk how to do it 
// }

// if(localStorage.length === 0){
  getData().then(data => {
    for(let i = 0; i <= data.comments.length-1; i++){
      console.log(data.comments[i])
      mainComments[i].querySelector('.user__name a').textContent = data.comments[i].user.username
      mainComments[i].querySelector('.comment__text').textContent = data.comments[i].content
      mainComments[i].querySelector('.counter__value').textContent = data.comments[i].score
      mainComments[i].querySelector('.user__avatar img').src = data.comments[i].user.image.webp
      mainComments[i].querySelector('.user__time').textContent = data.comments[i].createdAt
      if(data.comments[i].replies.length > 0){
        for(let c = 0; c <= data.comments[i].replies.length-1; c++){
            console.log(data.comments[i].replies[c])
            commentReplies[c].querySelector('.comment__text').innerHTML = `<span class="blue">@${data.comments[i].replies[c].replyingTo}</span> ${data.comments[i].replies[c].content}`;
            commentReplies[c].querySelector('.counter__value').textContent = data.comments[i].replies[c].score
            commentReplies[c].querySelector('.user__avatar img').src = data.comments[i].replies[c].user.image.webp
            commentReplies[c].querySelector('.user__name a').textContent = data.comments[i].replies[c].user.username
            commentReplies[c].querySelector('.user__time').textContent = data.comments[i].replies[c].createdAt
        }
      } 
  }
  })
//   saveComments()
// } else{
//   // localStorage.getItem('comments', mainComments)
// }

getData().then(data => {
  document.querySelector('.comment__send').onclick = () => {
    if(sendComment(data.currentUser.image.webp, data.currentUser.username) != undefined){
      document.querySelector('main').append(sendComment(data.currentUser.image.webp, data.currentUser.username))
      document.querySelector('.comment__input').value = ''
    }
   }

   document.querySelector('main').addEventListener('click', (elem) => {
    if(elem.target.classList.contains('header__delete')){
      document.querySelector('.popup').style.display = "flex"
      document.querySelector("body").style.overflowY = "hidden"
      document.querySelector('.popup').style.marginTop = window.pageYOffset + "px"

      document.querySelector('.popup__cancel').onclick = () => {
        document.querySelector('.popup').style.display = "none"
        document.querySelector("body").style.overflowY = "auto"
      }

      document.querySelector('.popup__delete').onclick = () => {
        elem.target.closest('.current__user').parentNode.removeChild(elem.target.closest('.current__user'))
        document.querySelector('.popup').style.display = "none"
        document.querySelector("body").style.overflowY = "auto"
      }
        
    } 
    else if(elem.target.classList.contains('header__reply')){
      const replyBlock = document.createElement('div')
      replyBlock.classList.add('comment__container')
      replyBlock.classList.add('comment__container-reply')
      replyBlock.classList.add('add')
      replyBlock.innerHTML = `
      <div class="add__container">
        <div class="add__avatar">
          <img src="./images/avatars/image-juliusomo.webp" alt="">
        </div>
        <textarea type="text" placeholder="Add a comment..." class="comment__input">@${elem.target.closest('.comment__container').querySelector('.user__name a').textContent}</textarea>
        <button class="comment__send">Reply</button>
      </div>`
      elem.target.closest('.comment__container').append(replyBlock)
      moveCursorToEnd(elem.target.closest('.comment__container').querySelector('.comment__input'))

      elem.target.closest('.comment__container').querySelector('.comment__send').onclick = () => {
        const reply = sendComment(data.currentUser.image.webp, data.currentUser.username)
        const text = reply.querySelector('.comment__text').textContent.trim()
        reply.querySelector('.comment__text').textContent = ''
        reply.classList.add('comment__container-reply')
        reply.querySelector('.comment__text').append(firstWord(text))
        elem.target.closest('.comment__container').append(reply)
        elem.target.closest('.comment__container').removeChild(replyBlock)
      }
    }
    else if(elem.target.classList.contains('header__update')){
      const updText = elem.target.closest('.comment__container').querySelector('.comment__text')
      const textArea = document.createElement('textarea')
      textArea.value = updText.textContent.trim()
      textArea.classList.add('comment__input')
      const updBtn = document.createElement('button')
      updBtn.textContent = 'Edit'
      updBtn.classList.add("comment__send")
      updBtn.style.alignSelf = "flex-end"
      elem.target.closest('.comment__main').removeChild(updText)
      elem.target.closest('.comment__main').append(textArea)
      elem.target.closest('.comment__main').append(updBtn)

      updBtn.onclick = () => {
          updText.textContent = ''
          updText.append(firstWord(textArea.value))
          elem.target.closest('.comment__main').append(updText)
          elem.target.closest('.comment__main').removeChild(textArea)
          elem.target.closest('.comment__main').removeChild(updBtn)
      }
    }

    else if(elem.target.getAttribute('alt') === 'plus'){
      plusValue(elem.target)
    }
    else if(elem.target.getAttribute('alt') === 'minus'){
      minusValue(elem.target)
    }
 })  
})