import { commentsI, PostI } from "./models/models.js";

import { getAllPost } from "./request/asyncRequest.js";

let posts:PostI[];

getAllPost().then(response =>{
    posts = response
    materializePost(posts)
})

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

    singlePostContainer.innerHTML = singlePostContent;
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
    <p class="single-comment-content-${comment.id}">${comment.content}</p>`

    singleCommentContainer.innerHTML = singleCommentContent;
    postContainer.append(singleCommentContainer);

}