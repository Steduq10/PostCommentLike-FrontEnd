import { commentsI, PostI } from "./models/models.js";

import { createPost, getAllPost, editPost, deletePost } from "./request/asyncRequest.js";





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
    //<button class= "single-post-delete-button-${post.id}">Delete</button>
   // <button class= "single-post-edit-button-${post.id}">Edit</button>`
    
    const deleteButton:HTMLButtonElement = document.createElement('button')
    deleteButton.className = 'single-post-delete-button'
    deleteButton.innerText = 'Delete'
    deleteButton.addEventListener('click', ()=> handleDelete(post))

    const editButton:HTMLButtonElement = document.createElement('button')
    editButton.className = 'single-post-edit-button'
    editButton.innerText = 'Edit'
    editButton.addEventListener('click', ()=> handleEdit(post))
    
    singlePostContainer.innerHTML = singlePostContent;
    singlePostContainer.append(deleteButton, editButton)
    
    materializeComments(post.comments, singlePostContainer)
    divRoot.append(singlePostContainer);
}

function materializeComments(comments:commentsI[],postContainer: HTMLDivElement){
    comments.forEach(comment => renderComment(comment, postContainer))
}

function renderComment(comment:commentsI, postContainer:HTMLDivElement){
    const singleCommentContainer: HTMLDivElement = document.createElement('div')
    singleCommentContainer.className = `single_comment_container-${comment.id}`
    singleCommentContainer.classList.add("single_comment_container")
    const singleCommentContent:string=`
    <p class="single-comment-content-${comment.id}">${comment.content}</p>
    <button class= "single-comment-delete-button-${comment.id}">Delete</button>
    <button class= "single-comment-edit-button-${comment.id}">Edit</button>`

    singleCommentContainer.innerHTML = singleCommentContent;
    postContainer.append(singleCommentContainer);

}

const formPost: HTMLFormElement|null =
document.querySelector('.post-form')

let posts:PostI[];

getAllPost().then(response =>{
  posts = response
  materializePost(posts)
  //recreatePost(post)
})


//let state:PostI[] = []

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
          //state.push(newPost)
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
         postDiv.remove()
         const newState:PostI[] = posts.map(specialistPatientDiv => post.id === specialistPatientDiv.id?post:post)
         posts = newState;
       }
     })
   }

   function recreatePost(posts:PostI[]){
    posts.forEach(posts => createPost(posts))
  }   