import { createPost, getAllPost, editPost, deletePost, createComment, deleteComment } from "./request/asyncRequest.js";
window.showAllPost = showAllPost;
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
                const apiData = response.json();
            }
        }).then(() => showAllPost());
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
    deleteButton.addEventListener('click', () => handleCommentDelete(Number(comment.id)));
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
                titleInput.value = '';
                contentInput.value = '';
            }
        }).then(() => showAllPost());
    }
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
            const newState = posts.map(post => post.id === post.id ? post : post);
            posts = newState;
            //postDiv.remove()
        }
    }).then(() => showAllPost());
}
/*
function handleCommentEdit(comment:commentsResponseI){
  //const titleInput = document.querySelector('.title-input') as HTMLInputElement;
  const contentInput = document.querySelector('.content-input') as HTMLInputElement;
  const submitButton = document.querySelector('.comment-form-button') as HTMLButtonElement
  submitButton.classList.add('display_none')

  const editButton:HTMLButtonElement = document.createElement('button')
  editButton.className = 'form-edit-button'
  editButton.innerText = 'Edit';
  editButton.addEventListener('click', () => executeCommentEdition(comment, contentInput))

  const formContainer = document.querySelector('.form-container');
  formContainer?.append(editButton)
  
  
  contentInput.value = comment.content;
}

function executeCommentEdition(comment: commentsRequestI, content:HTMLInputElement){


  const commentEdited:commentsRequestI = {
    content: content.value,
    //number_of_likes: number,
    postIdPost: comment.postIdPost
    
  }

  editComment(commentEdited).then(response => {
  if(response.status === 200){
    const newState:commentsRequestI[] = posts.map(comments => comment.postIdPost === commentEdited.postIdPost?commentEdited.postIdPost)
    comments = newState;
  
    
    const pContent = document.querySelector(`.single-comment-content-${comment.postIdPost}`) as HTMLParagraphElement
    pContent.innerText = commentEdited.content
    
    content.value = ''
    const submitButton = document.querySelector('.post-comment-button') as HTMLButtonElement
    submitButton.classList.remove('display_none')
  
    const editButton = document.querySelector('.form-edit-button') as HTMLButtonElement
  
    editButton.remove()
  }
})

*/
function handleCommentDelete(id) {
    deleteComment(id).then(() => showAllPost());
}
