export interface PostI{
    id: number|null,
    title: string,
    content: string,
    number_of_likes: number,
    comments: commentsResponseI []
}

export interface commentsRequestI{
    //id: number|null,
    content: string,
    //number_of_likes: number,
    postIdPost: object
    
}

export interface commentsResponseI{
    id: number|null,
    content: string,
    //number_of_likes: number,
    postIdPost: number|null
    
}