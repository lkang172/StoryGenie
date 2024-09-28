export interface User {
    _id: string;
    username: string;
    name: string;
    books: string[]; // Array of book ObjectId strings
    createdAt: string;
    updatedAt: string;
  }