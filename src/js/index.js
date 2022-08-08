import { createPost, getAllPost, editPost, deletePost } from "./request/asyncRequest.js";
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
    //<button class= "single-post-delete-button-${post.id}">Delete</button>
    // <button class= "single-post-edit-button-${post.id}">Edit</button>`
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
}
function materializeComments(comments, postContainer) {
    comments.forEach(comment => renderComment(comment, postContainer));
}
function renderComment(comment, postContainer) {
    const singleCommentContainer = document.createElement('div');
    singleCommentContainer.className = `single_comment_container-${comment.id}`;
    singleCommentContainer.classList.add("single_comment_container");
    const singleCommentContent = `
    <p class="single-comment-content-${comment.id}">${comment.content}</p>
    <button class= "single-comment-delete-button-${comment.id}">Delete</button>
    <button class= "single-comment-edit-button-${comment.id}">Edit</button>`;
    singleCommentContainer.innerHTML = singleCommentContent;
    postContainer.append(singleCommentContainer);
}
const formPost = document.querySelector('.post-form');
let posts;
getAllPost().then(response => {
    posts = response;
    materializePost(posts);
    //recreatePost(post)
});
//let state:PostI[] = []
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
                //state.push(newPost)
                posts.push(newPost);
                inputPost(newPost);
                titleInput.value = '';
                contentInput.value = '';
            }
        });
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
        const postDiv = document.querySelector(`#post-${post.id}`);
        if (response.status === 200) {
            postDiv.remove();
            const newState = posts.map(specialistPatientDiv => post.id === specialistPatientDiv.id ? post : post);
            posts = newState;
        }
    });
}
function recreatePost(posts) {
    posts.forEach(posts => createPost(posts));
}
