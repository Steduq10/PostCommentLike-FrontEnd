import { commentsI, PostI } from "./models/models.js";

import { createPost, getAllPost, editPost, deletePost, createComment, editComment, deleteComment } from "./request/asyncRequest.js";


function showCommentForm(){
const commentContainer =document.querySelector('.form-new-comment') as HTMLDivElement;
   
  const formComment:string =`
  <form class="comment-form-" >
  <input placeholder="Comment" class="content-comment type="text"/>
  <button class="comment-form-button">Submit</button>
  </form>`

  commentContainer.innerHTML = formComment;

  const contentInput = document.querySelector('.content-comment-input') as HTMLInputElement;
  
  if(contentInput.value){
    
    const newComment: commentsI = {
      id: null,
      content: contentInput.value,
      //number_of_likes: 0,
      post_id_post: null,
    }
    

    createComment(newComment).then(
      response => {
        if(response.status === 200){
          
          comments2.push(newComment)

          //inputComment(newComment);  
          //contentInput.value = '';
        }
      }
    )
  }

}



function materializePost(posts:Array<PostI>){
    const divRoot = document.querySelector("#root") as HTMLDivElement;
    posts.forEach(post => renderPost(post, divRoot))
}

function renderPost(post:PostI, divRoot:HTMLDivElement){
  
    "container-post-${post.id}"
    const singlePostContainer = document.createElement('div');
    singlePostContainer.className = `single_post_container-${post.id}`
    singlePostContainer.classList.add("single_post_container")
    const singlePostContent =`
    <h2 class="single-post-title-${post.id}">${post.title}</h2>
    <p class="single-post-content-${post.id}">${post.content}</p>`
    
    const deleteButton:HTMLButtonElement = document.createElement('button')
    deleteButton.className = 'single-post-delete-button'
    deleteButton.innerText = 'Delete'
    deleteButton.addEventListener('click', ()=> handleDelete(post))

    const editButton:HTMLButtonElement = document.createElement('button')
    editButton.className = 'single-post-edit-button'
    editButton.innerText = 'Edit'
    editButton.addEventListener('click', ()=> handleEdit(post))

    const addComment:HTMLButtonElement = document.createElement('button')
    addComment.className = 'single-post-addComment-button'
    addComment.innerText = 'Comment'
    addComment.addEventListener('click', ()=> showCommentForm())

    

    singlePostContainer.innerHTML = singlePostContent;
    singlePostContainer.append(deleteButton, editButton, addComment)
    
    materializeComments(post.comments, singlePostContainer)
    divRoot.append(singlePostContainer);
}
let comments2:commentsI[];
function materializeComments(comments:Array<commentsI>,postContainer: HTMLDivElement){
 
  
  comments.forEach(comment => renderComment(comment, postContainer))
    
  
}



function renderComment(comment:commentsI, postContainer:HTMLDivElement){

    const singleCommentContainer: HTMLDivElement = document.createElement('div')
    singleCommentContainer.className = `single_comment_container-${comment.id}`
    singleCommentContainer.classList.add("single_comment_container")
    const singleCommentContent:string=`
    <p class="single-comment-content-${comment.id}">${comment.content}</p>`
   

    const deleteButton:HTMLButtonElement = document.createElement('button')
    deleteButton.className = 'single-comment-delete-button'
    deleteButton.innerText = 'Delete'
    deleteButton.addEventListener('click', ()=> handleCommentDelete(comment))
  
    const editButton:HTMLButtonElement = document.createElement('button')
    editButton.className = 'single-comment-edit-button'
    editButton.innerText = 'Edit'
    editButton.addEventListener('click', ()=> handleCommentEdit(comment))

    singleCommentContainer.innerHTML = singleCommentContent;
    singleCommentContainer.append(deleteButton,editButton)
    postContainer.append(singleCommentContainer);

}

const formPost: HTMLFormElement|null =
document.querySelector('.post-form')

let posts:PostI[];

getAllPost().then(response =>{
  posts = response
  materializePost(posts)
  
})




formPost?.addEventListener('submit', (e) => handleSubmit(e))

function handleSubmit(e:SubmitEvent){
  e.preventDefault()
  const titleInput = document.querySelector('.title-input') as HTMLInputElement;
  const contentInput = document.querySelector('.content-input') as HTMLInputElement;
  
  if(titleInput.value&&contentInput.value){
    
    const newPost: PostI = {
      id: null,
      title: titleInput.value,
      content: contentInput.value,
      number_of_likes: 0,
      comments: []
    }
    

    createPost(newPost).then(
      response => {
        if(response.status === 200){
          
          posts.push(newPost)

          inputPost(newPost);  
          titleInput.value = '';
          contentInput.value = '';
        }
      }
    )
  }
}

function inputPost(post:PostI){
    const postContainer = document.querySelector('.post-container') as HTMLDivElement
  
    const div:HTMLDivElement = document.createElement('div');
    div.className = 'single-post-container'
    div.classList.add(`post-${post.id}`)
    
    const titleH2:HTMLHeadElement = document.createElement('h2');
    titleH2.className = `single-post-title-${post.id}`
    titleH2.innerText = post.title
    
    const contentP:HTMLParagraphElement = document.createElement('p')
    contentP.className = `single-post-content-${post.id}`
    contentP.innerText = post.content
    
  
    const deleteButton:HTMLButtonElement = document.createElement('button')
    deleteButton.className = 'single-post-delete-button'
    deleteButton.innerText = 'Delete'
    deleteButton.addEventListener('click', ()=> handleDelete(post))
  
    const editButton:HTMLButtonElement = document.createElement('button')
    editButton.className = 'single-post-edit-button'
    editButton.innerText = 'Edit'
    editButton.addEventListener('click', ()=> handleEdit(post))
  
    div.append(titleH2, contentP, deleteButton, editButton) 
    postContainer.append(div)
  }

    function handleEdit(post:PostI){
    const titleInput = document.querySelector('.title-input') as HTMLInputElement;
    const contentInput = document.querySelector('.content-input') as HTMLInputElement;
    const submitButton = document.querySelector('.post-form-button') as HTMLButtonElement
    submitButton.classList.add('display_none')
  
    const editButton:HTMLButtonElement = document.createElement('button')
    editButton.className = 'form-edit-button'
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => executeEdition(post, titleInput, contentInput))

    const formContainer = document.querySelector('.form-container');
    formContainer?.append(editButton)
    
    titleInput.value = post.title
    contentInput.value = post.content;
  }

  function executeEdition(post:PostI, title:HTMLInputElement, content:HTMLInputElement){
  
  
    const postEdited:PostI = {
      id:post.id,
      title:title.value,
      content:content.value,
      number_of_likes: 0,
      comments: []
      
    }

    editPost(postEdited).then(response => {
    if(response.status === 200){
      const newState:PostI[] = posts.map(post => post.id === postEdited.id?postEdited:post)
      posts = newState;
    
      const h2Title = document.querySelector(`.single-post-title-${post.id}`) as HTMLHeadingElement
      h2Title.innerText = postEdited.title
      const pContent = document.querySelector(`.single-post-content-${post.id}`) as HTMLParagraphElement
      pContent.innerText = postEdited.content
      
      title.value = ''
      content.value = ''
      const submitButton = document.querySelector('.post-form-button') as HTMLButtonElement
      submitButton.classList.remove('display_none')
    
      const editButton = document.querySelector('.form-edit-button') as HTMLButtonElement
    
      editButton.remove()
    }
  })

}

function handleDelete(post:PostI){
  
  deletePost(post).then(response => {
    const postDiv = document.querySelector(`#post-${post.id}`) as HTMLDivElement
    if(response.status === 200){
      
      const newState:PostI[] = posts.map(specialistPatientDiv => post.id === specialistPatientDiv.id?post:post)
      posts = newState;
      postDiv.remove()
      
    }
  })
  

}



   function recreatePost(posts:PostI[]){
    posts.forEach(posts => createPost(posts))
  }   

function handleComment(){
const formComment: HTMLFormElement|null =
document.querySelector('.comment-form')



formComment?.addEventListener('submit', (e) => handleCommentSubmit(e))
}

//let comments:commentsI[];

function handleCommentSubmit(e:SubmitEvent){
  e.preventDefault()
  const contentInput = document.querySelector('.content-input') as HTMLInputElement;
  
  if(contentInput.value){
    
    const newComment: commentsI = {
      id: null,
      content: contentInput.value,
     // number_of_likes: 0,
     post_id_post: null,
    }
    

    createComment(newComment).then(
      response => {
        if(response.status === 200){
          
          comments2.push(newComment)

          inputComment(newComment);  
          contentInput.value = '';
        }
      }
    )
  }
}

function inputComment(comment:commentsI){
  const commentContainer = document.querySelector('.comment-container') as HTMLDivElement

  const div:HTMLDivElement = document.createElement('div');
  div.className = 'single-comment-container'
  div.classList.add(`comment-${comment.id}`)
  
  const contentP:HTMLParagraphElement = document.createElement('p')
  contentP.className = `single-comment-content-${comment.id}`
  contentP.innerText = comment.content
  

  const deleteButton:HTMLButtonElement = document.createElement('button')
  deleteButton.className = 'single-comment-delete-button'
  deleteButton.innerText = 'Delete'
  deleteButton.addEventListener('click', ()=> handleCommentDelete(comment))

  const editButton:HTMLButtonElement = document.createElement('button')
  editButton.className = 'single-comment-edit-button'
  editButton.innerText = 'Edit'
  editButton.addEventListener('click', ()=> handleCommentEdit(comment))

  div.append( contentP, deleteButton, editButton) 
  commentContainer.append(div)
}

  function handleCommentEdit(comment:commentsI){
  const contentInput = document.querySelector('.comment-content-input') as HTMLInputElement;
  const submitButton = document.querySelector('.comment-form-button') as HTMLButtonElement
  submitButton.classList.add('display_none')

  const editButton:HTMLButtonElement = document.createElement('button')
  editButton.className = 'comment-form-edit-button'
  editButton.innerText = 'Edit';
  editButton.addEventListener('click', () => executeCommentEdition(comment, contentInput))

  const commentformContainer = document.querySelector('.comment-form-container');
  commentformContainer?.append(editButton)
  
  
  contentInput.value = comment.content;
}

function executeCommentEdition(comment:commentsI, content:HTMLInputElement ){


  const commentEdited:commentsI = {
    id:comment.id,
    content:content.value,
   // number_of_likes: 0,
    post_id_post: comment.post_id_post,
    
    
  }

  editComment(commentEdited).then(response => {
  if(response.status === 200){
    const newState:commentsI[] = comments2.map(comment => comment.id === commentEdited.id?commentEdited:comment)
    comments2 = newState;
  
    const pContent = document.querySelector(`.single-comment-content-${comment.id}`) as HTMLParagraphElement
    pContent.innerText = commentEdited.content
    
    content.value = ''
    const submitButton = document.querySelector('.comment-form-button') as HTMLButtonElement
    submitButton.classList.remove('display_none')
  
    const editButton = document.querySelector('.comment-form-edit-button') as HTMLButtonElement
  
    editButton.remove()
  }
})

}

function handleCommentDelete(comment:commentsI){
    
  deleteComment(comment).then(response => {
    const commentDiv = document.querySelector(`#comment-${comment.id}`) as HTMLDivElement
    if(response.status === 200){
      commentDiv.remove()
      const newState:commentsI[] = posts.map(specialistPatientDiv => comment.id === specialistPatientDiv.id?comment:comment)
      comments2 = newState;
    }
  })
}