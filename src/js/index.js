import { createPost, getAllPost, editPost, deletePost, createComment } from "./request/asyncRequest.js";
window.showAllPost = showAllPost;
function showCommentForm() {
    const commentContainer = document.querySelector('.form-new-comment');
    const formComment = `
  <form class="comment-form-" >
  <input placeholder="Comment" class="content-comment" type="text"/>
  <button class="comment-form-button" onclick="inserComment()">Submit</button>
  </form>`;
    commentContainer.innerHTML = formComment;
}
function inserComment(inputId) {
    const contentInput = document.getElementById(inputId);
    console.log(contentInput.value);
    if (contentInput.value) {
        const id = inputId.split('-')[1];
        console.log(contentInput.value);
        const newComment = {
            // id: null,
            content: contentInput.value,
            //number_of_likes: 0,
            postIdPost: {
                id: Number(id)
            }
        };
        createComment(newComment).then(response => {
            if (response.status === 200) {
                comments.push(newComment);
                //inputComment(newComment);  
                //contentInput.value = '';
            }
        });
    }
}
function materializePost(posts) {
    const divRoot = document.querySelector("#root");
    posts.forEach(post => renderPost(post, divRoot));
}
function renderPost(post, divRoot) {
    "container-post-${post.id}";
    const singlePostContainer = document.createElement('div');
    singlePostContainer.className = `single_post_container-${post.id}`;
    singlePostContainer.classList.add("single_post_container");
    const singlePostContent = `
    <h2 class="single-post-title-${post.id}">${post.title}</h2>
    <p class="single-post-content-${post.id}">${post.content}</p>`;
    const deleteButton = document.createElement('button');
    deleteButton.className = 'single-post-delete-button';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => handleDelete(post));
    const editButton = document.createElement('button');
    editButton.className = 'single-post-edit-button';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => handleEdit(post));
    //const addComment:HTMLButtonElement = document.createElement('button')
    //addComment.className = 'single-post-addComment-button'
    //addComment.innerText = 'Comment'
    //addComment.addEventListener('click', ()=> showCommentForm())
    //const newCommentButton = document.createElement('button')
    //newCommentButton.addEventListener('click', ()=> )
    singlePostContainer.innerHTML = singlePostContent;
    singlePostContainer.append(deleteButton, editButton);
    materializeComments(post.comments, singlePostContainer);
    divRoot.append(singlePostContainer);
    //CREANDO BOTON DE FORMULARIO
    const newCommentForm = document.createElement('form');
    newCommentForm.classList.add('comment-form');
    const commentFormInput = document.createElement('input');
    commentFormInput.setAttribute('placeholder', 'Create new comment');
    commentFormInput.setAttribute('type', 'text');
    const commentFormButton = document.createElement('button');
    commentFormButton.innerText = "Comment";
    commentFormButton.setAttribute('type', 'button');
    commentFormInput.classList.add('content-input');
    const buttonId = `button-${post.id}`;
    const inputId = `input-${post.id}`;
    commentFormInput.id = inputId;
    commentFormButton.id = buttonId;
    commentFormButton.addEventListener('click', () => inserComment(inputId));
    newCommentForm.appendChild(commentFormInput);
    newCommentForm.appendChild(commentFormButton);
    singlePostContainer.appendChild(newCommentForm);
}
let comments;
function materializeComments(comments, postContainer) {
    comments.forEach(comment => renderComment(comment, postContainer));
}
function renderComment(comment, postContainer) {
    const singleCommentContainer = document.createElement('div');
    singleCommentContainer.className = `single_comment_container-${comment.id}`;
    singleCommentContainer.classList.add("single_comment_container");
    const singleCommentContent = `
    <p class="single-comment-content-${comment.id}">${comment.content}</p>`;
    const deleteButton = document.createElement('button');
    deleteButton.className = 'single-comment-delete-button';
    deleteButton.innerText = 'Delete';
    //deleteButton.addEventListener('click', ()=> handleCommentDelete(comment))
    const editButton = document.createElement('button');
    editButton.className = 'single-comment-edit-button';
    editButton.innerText = 'Edit';
    //editButton.addEventListener('click', ()=> handleCommentEdit(comment))
    singleCommentContainer.innerHTML = singleCommentContent;
    singleCommentContainer.append(deleteButton, editButton);
    postContainer.append(singleCommentContainer);
}
const formPost = document.querySelector('.post-form');
let posts;
function showAllPost() {
    const postDiv = document.getElementById('root');
    postDiv.innerHTML = '';
    getAllPost().then(response => {
        posts = response;
        materializePost(posts);
    });
}
formPost === null || formPost === void 0 ? void 0 : formPost.addEventListener('submit', (e) => handleSubmit(e));
function handleSubmit(e) {
    e.preventDefault();
    const titleInput = document.querySelector('.title-input');
    const contentInput = document.querySelector('.content-input');
    if (titleInput.value && contentInput.value) {
        const newPost = {
            id: null,
            title: titleInput.value,
            content: contentInput.value,
            number_of_likes: 0,
            comments: []
        };
        createPost(newPost).then(response => {
            if (response.status === 200) {
                //posts.push(newPost)
                //inputPost(newPost);  
                titleInput.value = '';
                contentInput.value = '';
            }
        }).then(() => showAllPost());
    }
}
function inputPost(post) {
    const postContainer = document.querySelector('.post-container');
    const div = document.createElement('div');
    div.className = 'single-post-container';
    div.classList.add(`post-${post.id}`);
    const titleH2 = document.createElement('h2');
    titleH2.className = `single-post-title-${post.id}`;
    titleH2.innerText = post.title;
    const contentP = document.createElement('p');
    contentP.className = `single-post-content-${post.id}`;
    contentP.innerText = post.content;
    const deleteButton = document.createElement('button');
    deleteButton.className = 'single-post-delete-button';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => handleDelete(post));
    const editButton = document.createElement('button');
    editButton.className = 'single-post-edit-button';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => handleEdit(post));
    div.append(titleH2, contentP, deleteButton, editButton);
    postContainer.append(div);
}
function handleEdit(post) {
    const titleInput = document.querySelector('.title-input');
    const contentInput = document.querySelector('.content-input');
    const submitButton = document.querySelector('.post-form-button');
    submitButton.classList.add('display_none');
    const editButton = document.createElement('button');
    editButton.className = 'form-edit-button';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => executeEdition(post, titleInput, contentInput));
    const formContainer = document.querySelector('.form-container');
    formContainer === null || formContainer === void 0 ? void 0 : formContainer.append(editButton);
    titleInput.value = post.title;
    contentInput.value = post.content;
}
function executeEdition(post, title, content) {
    const postEdited = {
        id: post.id,
        title: title.value,
        content: content.value,
        number_of_likes: 0,
        comments: []
    };
    editPost(postEdited).then(response => {
        if (response.status === 200) {
            const newState = posts.map(post => post.id === postEdited.id ? postEdited : post);
            posts = newState;
            const h2Title = document.querySelector(`.single-post-title-${post.id}`);
            h2Title.innerText = postEdited.title;
            const pContent = document.querySelector(`.single-post-content-${post.id}`);
            pContent.innerText = postEdited.content;
            title.value = '';
            content.value = '';
            const submitButton = document.querySelector('.post-form-button');
            submitButton.classList.remove('display_none');
            const editButton = document.querySelector('.form-edit-button');
            editButton.remove();
        }
    });
}
function handleDelete(post) {
    deletePost(post).then(response => {
        if (response.status === 200) {
            const newState = posts.map(specialistPatientDiv => post.id === specialistPatientDiv.id ? post : post);
            posts = newState;
            //postDiv.remove()
        }
    }).then(() => showAllPost());
}
function recreatePost(posts) {
    posts.forEach(posts => createPost(posts));
}
//function handleComment(){
//const formComment: HTMLFormElement|null =
//document.querySelector('.comment-form')
//formComment?.addEventListener('submit', (e) => handleCommentSubmit(e))
//}
//let comments:commentsI[];
/*
function handleCommentSubmit(e:SubmitEvent){
  e.preventDefault()
  const contentInput = document.querySelector('.content-input') as HTMLInputElement;
  
  if(contentInput.value){
    
    const newComment: commentsRequestI = {
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

  function handleCommentEdit(comment:commentsRequestI){
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

function executeCommentEdition(comment:commentsRequestI, content:HTMLInputElement ){


 // const commentEdited:commentsRequestI = {
    //id:comment.id,
    content:content.value,
   // number_of_likes: 0,
    //post_id_post: comment.post_id_post,
    
    
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
}*/ 
