export interface PostI{
    id: number|null,
    title: string,
    content: string,
    number_of_likes: number,
    comments: commentsI []
}

export interface commentsI{
    id: number|null,
    content: string,
    //number_of_likes: number,
    post_id_post: number|null
    
}