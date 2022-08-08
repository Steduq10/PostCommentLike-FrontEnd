import { createPost, getAllPost, editPost, deletePost, createComment, editComment, deleteComment } from "./request/asyncRequest.js";
function showCommentForm() {
    const commentContainer = document.querySelector('.form-new-comment');
    const formComment = `
  <form class="comment-form-" >
  <input placeholder="Comment" class="content-comment type="text"/>
  <button class="comment-form-button">Submit</button>
  </form>`;
    commentContainer.innerHTML = formComment;
    const contentInput = document.querySelector('.content-comment-input');
    if (contentInput.value) {
        const newComment = {
            id: null,
            content: contentInput.value,
            //number_of_likes: 0,
            post_id_post: null,
        };
        createComment(newComment).then(response => {
            if (response.status === 200) {
                comments2.push(newComment);
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
    const addComment = document.createElement('button');
    addComment.className = 'single-post-addComment-button';
    addComment.innerText = 'Comment';
    addComment.addEventListener('click', () => showCommentForm());
    singlePostContainer.innerHTML = singlePostContent;
    singlePostContainer.append(deleteButton, editButton, addComment);
    materializeComments(post.comments, singlePostContainer);
    divRoot.append(singlePostContainer);
}
let comments2;
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
    deleteButton.addEventListener('click', () => handleCommentDelete(comment));
    const editButton = document.createElement('button');
    editButton.className = 'single-comment-edit-button';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => handleCommentEdit(comment));
    singleCommentContainer.innerHTML = singleCommentContent;
    singleCommentContainer.append(deleteButton, editButton);
    postContainer.append(singleCommentContainer);
}
const formPost = document.querySelector('.post-form');
let posts;
getAllPost().then(response => {
    posts = response;
    materializePost(posts);
});
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
            const newState = posts.map(specialistPatientDiv => post.id === specialistPatientDiv.id ? post : post);
            posts = newState;
            postDiv.remove();
        }
    });
}
function recreatePost(posts) {
    posts.forEach(posts => createPost(posts));
}
function handleComment() {
    const formComment = document.querySelector('.comment-form');
    formComment === null || formComment === void 0 ? void 0 : formComment.addEventListener('submit', (e) => handleCommentSubmit(e));
}
//let comments:commentsI[];
function handleCommentSubmit(e) {
    e.preventDefault();
    const contentInput = document.querySelector('.content-input');
    if (contentInput.value) {
        const newComment = {
            id: null,
            content: contentInput.value,
            // number_of_likes: 0,
            post_id_post: null,
        };
        createComment(newComment).then(response => {
            if (response.status === 200) {
                comments2.push(newComment);
                inputComment(newComment);
                contentInput.value = '';
            }
        });
    }
}
function inputComment(comment) {
    const commentContainer = document.querySelector('.comment-container');
    const div = document.createElement('div');
    div.className = 'single-comment-container';
    div.classList.add(`comment-${comment.id}`);
    const contentP = document.createElement('p');
    contentP.className = `single-comment-content-${comment.id}`;
    contentP.innerText = comment.content;
    const deleteButton = document.createElement('button');
    deleteButton.className = 'single-comment-delete-button';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => handleCommentDelete(comment));
    const editButton = document.createElement('button');
    editButton.className = 'single-comment-edit-button';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => handleCommentEdit(comment));
    div.append(contentP, deleteButton, editButton);
    commentContainer.append(div);
}
function handleCommentEdit(comment) {
    const contentInput = document.querySelector('.comment-content-input');
    const submitButton = document.querySelector('.comment-form-button');
    submitButton.classList.add('display_none');
    const editButton = document.createElement('button');
    editButton.className = 'comment-form-edit-button';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => executeCommentEdition(comment, contentInput));
    const commentformContainer = document.querySelector('.comment-form-container');
    commentformContainer === null || commentformContainer === void 0 ? void 0 : commentformContainer.append(editButton);
    contentInput.value = comment.content;
}
function executeCommentEdition(comment, content) {
    const commentEdited = {
        id: comment.id,
        content: content.value,
        // number_of_likes: 0,
        post_id_post: comment.post_id_post,
    };
    editComment(commentEdited).then(response => {
        if (response.status === 200) {
            const newState = comments2.map(comment => comment.id === commentEdited.id ? commentEdited : comment);
            comments2 = newState;
            const pContent = document.querySelector(`.single-comment-content-${comment.id}`);
            pContent.innerText = commentEdited.content;
            content.value = '';
            const submitButton = document.querySelector('.comment-form-button');
            submitButton.classList.remove('display_none');
            const editButton = document.querySelector('.comment-form-edit-button');
            editButton.remove();
        }
    });
}
function handleCommentDelete(comment) {
    deleteComment(comment).then(response => {
        const commentDiv = document.querySelector(`#comment-${comment.id}`);
        if (response.status === 200) {
            commentDiv.remove();
            const newState = posts.map(specialistPatientDiv => comment.id === specialistPatientDiv.id ? comment : comment);
            comments2 = newState;
        }
    });
}
