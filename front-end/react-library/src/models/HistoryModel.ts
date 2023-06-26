//Tên các Variable phải giống Variable ở Entity Class Java 
// Các biến không cần đúng thứ tự
class HistoryModel {
    id: number
    userEmail: string;
    checkoutDate: string;
    returnedDate: string;
    title: string;
    author: string;
    description: string;
    img: string;

    constructor(
        id: number,
        userEmail: string,
        checkout_Date: string,
        returned_Date: string,
        title: string,
        description: string,
        author: string,
        img: string ) {

        this.id = id;
        this.userEmail = userEmail;
        this.checkoutDate = checkout_Date;
        this.returnedDate = returned_Date;
        this.title = title;
        this.author = author;
        this.description = description;
        this.img = img;
    }
}
export default HistoryModel;