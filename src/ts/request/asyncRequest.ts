import { PostI } from "../models/models.js"
export async function getAllPost() {
    const response:Response = await fetch("http://localhost:8080/api/v1/get/all/post")

    const post:PostI[] = await response.json()

    return post;
}