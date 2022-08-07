export interface PostI{
    id: number,
    title: String,
    content: String,
    number_of_likes: number,
    comments: commentsI []
}

export interface commentsI{
    id?: number,
    content: String,
    number_of_likes: number,
    post_id_post: number
}