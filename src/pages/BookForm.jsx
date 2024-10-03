import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { BaseUrl } from "../Constant";

const BookForm = ({ book, onSuccess }) => {
  const cookies = new Cookies();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    // If editing a book, populate the form with existing book data
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
    }
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If editing, update the book using PUT request, otherwise, add a new book
      if (book) {
        await axios.put(
          `${BaseUrl}/books/${book._id}`,
          {
            title,
            author,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${cookies.get("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          `${BaseUrl}/books`,
          {
            title,
            author,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${cookies.get("token")}`,
            },
          }
        );
      }

      // On success, trigger the onSuccess callback to refresh the book list and close modal
      onSuccess();
    } catch (error) {
      console.error("Failed to save book", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
      >
        {book ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
};

export default BookForm;
