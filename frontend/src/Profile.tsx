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

interface UserData {
  username: string;
  name: string;
}

const Profile = () => {
  const [books, setBooks] = useState<LibraryProps[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const userId = "66f75766ff74160b9d338926"; // This should be dynamically set based on your authentication system

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/user/${userId}`
        );
        if (!response.ok)
          throw new Error(`HTTP Error! Status: ${response.status}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="profile-container">
      <div className="profile-info">
        <img
          src="https://via.placeholder.com/200"
          alt={userData?.name || "User"}
          className="profile-photo"
        />
        <h1 className="profile-name">{userData?.name || "Loading..."}</h1>
        <p className="profile-bio">
          A passionate storyteller and children's book author.
        </p>
      </div>
      <div className="books-container">
        <h2 className="books-title">My Books</h2>
        <div className="book-list">
          {books.map((book) => (
            <div key={book.title} className="book-item">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlgHYcdmZEvuKAv8B-hRXW9MtY0layhqSpJQ&s"
                alt={`Book ${book.title}`}
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
