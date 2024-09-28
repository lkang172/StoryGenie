import React, { useEffect, useState } from "react";
import "./Profile.css";

interface Book {
  _id: string;
  title: string;
  dateCreated: string;
}

interface UserData {
  _id: string;
  username: string;
  name: string;
  books: string[]; // Array of book IDs
}

interface User {
  _id: string;
  username: string;
  name: string;
  // Add other user properties as needed
}

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [userData, setUserData] = useState<UserData | null>();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch updated user data
        const response = await fetch(
          `http://localhost:3000/api/user/${user._id}`
        );
        if (!response.ok)
          throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        setUserData(data);

        // Fetch books data
        const booksResponse = await fetch(
          `http://localhost:3000/api/books/${user._id}`
        );
        if (!booksResponse.ok)
          throw new Error(`HTTP Error! Status: ${booksResponse.status}`);
        const booksData = await booksResponse.json();
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-info">
        <img
          src="https://via.placeholder.com/200"
          alt={userData.name || "User"}
          className="profile-photo"
        />
        <h1 className="profile-name">{userData.name}</h1>
        <p className="profile-username">@{userData.username}</p>
        <p className="profile-bio">
          A passionate storyteller and children's book author.
        </p>
      </div>
      <div className="books-container">
        <h2 className="books-title">My Books</h2>
        <div className="book-list">
          {books.map((book) => (
            <div key={book._id} className="book-item">
              <img
                src="https://re-mm-assets.s3.amazonaws.com/product_photo/46460/large_large_Poly_LightBlue_pms291up_1471509902.jpg"
                alt={`Book ${book.title}`}
                className="book-cover"
              />
              <h3 className="book-title">{book.title}</h3>
              <p className="book-date">
                Created on: {new Date(book.dateCreated).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
