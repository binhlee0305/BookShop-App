//Tên các Variable phải giống Variable ở Entity Class Java 
// Các biến không cần đúng thứ tự

class BookModel {
    id: number;
    title: string;
    author?: string; // "?" mark  means this can be null
    description?: string;
    copies?: number;
    copiesAvailable?: number;
    category?: string;
    img?: string;

    constructor(id: number, title: string, author: string, description: string,
        copies: number, copiesAvailable: number, category: string, img: string) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.description = description;
            this.copies = copies;
            this.copiesAvailable = copiesAvailable;
            this.category = category;
            this.img = img;
    }
}
export default BookModel;