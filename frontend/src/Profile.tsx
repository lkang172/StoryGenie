import React, { useState } from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile-container">
      <div className="profile-info">
        <img src="https://via.placeholder.com/200" alt="User Name" className="profile-photo" />
        <h1 className="profile-name">John Doe</h1>
        <p className="profile-bio">A passionate storyteller and children's book author.</p>
      </div>
      <div className="books-container">
        <h2 className="books-title">My Books</h2>
        <div className="book-list">
          {[1, 2, 3, 4].map((book) => (
            <div key={book} className="book-item">
              <img src={`https://via.placeholder.com/120x180?text=Book ${book}`} alt={`Book ${book}`} className="book-cover" />
              <h3 className="book-title">Book Title {book}</h3>
              <p className="book-date">Created on: 2023-09-{book}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
