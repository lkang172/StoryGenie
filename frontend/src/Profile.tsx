import "./Profile.css";
import React, { useEffect, useState } from "react";
import "./Profile.css";

interface LibraryProps {
  title: string;
  createdOn: string;
  user: {
    _id: string;
    username: string;
  };
}

const Profile = () => {
  const [books, setBooks] = useState<LibraryProps[]>([]);

  const fetchedBooks = [
    {
      title: "Book",
      createdOn: "9-28/2024",
      user: { _id: "123445", username: "LKang" },
    },
    {
      title: "Book",
      createdOn: "9-28/2024",
      user: { _id: "123445", username: "LKang" },
    },
    {
      title: "Book",
      createdOn: "9-28/2024",
      user: { _id: "123445", username: "LKang" },
    },
    {
      title: "Book",
      createdOn: "9-28/2024",
      user: { _id: "123445", username: "LKang" },
    },
  ];

  const fetchFromBackend = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/books");
      if (!response.ok)
        throw new Error(`HTTP Error! Status: ${response.status}`);
      const fetchedBooks: LibraryProps[] = await response.json();
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books from backend", error);
    }
  };

  useEffect(() => {
    fetchFromBackend();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-info">
        <img
          src="https://via.placeholder.com/200"
          alt="User Name"
          className="profile-photo"
        />
        <h1 className="profile-name">John Doe</h1>
        <p className="profile-bio">
          A passionate storyteller and children's book author.
        </p>
      </div>
      <div className="books-container">
        <h2 className="books-title">My Books</h2>
        <div className="book-list">
          {fetchedBooks.map((book) => (
            <div className="book-item">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlgHYcdmZEvuKAv8B-hRXW9MtY0layhqSpJQ&s"
                alt={`Book ${book}`}
                className="book-cover"
              />
              <h3 className="book-title">{book.title}</h3>
              <p className="book-date">Created by {book.user.username}</p>
              <p className="book-date">{book.createdOn}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bookshelf"></div>
    </div>
  );
};

export default Profile;
