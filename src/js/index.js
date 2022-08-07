import { getAllPost } from "./request/asyncRequest.js";
let posts;
getAllPost().then(response => {
    posts = response;
    materializePost(posts);
});
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
    singlePostContainer.innerHTML = singlePostContent;
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
    <p class="single-comment-content-${comment.id}">${comment.content}</p>`;
    singleCommentContainer.innerHTML = singleCommentContent;
    postContainer.append(singleCommentContainer);
}
