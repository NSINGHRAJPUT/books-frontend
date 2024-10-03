import { useState, useEffect } from "react";
import axios from "axios";
import BookForm from "./BookForm";
import { BaseUrl } from "../Constant";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/books`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${cookies.get("token")}`,
        },
      });
      console.log(response.data);
      setBooks(response.data); // Set fetched books to state
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${BaseUrl}/books/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${cookies.get("token")}`,
        },
      });
      fetchBooks(); // Reload the book list after deletion
    } catch (error) {
      console.error("Failed to delete book", error);
    }
  };

  const handleAddBook = () => {
    setEditingBook(null); // Clear editing book state
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="container mx-auto relative">
      <div
        onClick={() => {
          cookies.remove("token");
          navigate("/login");
        }}
        className="absolute top-1 right-1 bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Logout
      </div>
      <h2 className="text-3xl font-bold text-center mb-6">Books List</h2>
      <div className="flex mx-[5%] justify-between items-center mb-6">
        <h3 className="text-xl">Manage Your Books</h3>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddBook}
        >
          Add Book
        </button>
      </div>

      {/* Book Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingBook ? "Edit Book" : "Add Book"}
            </h3>
            <BookForm
              book={editingBook}
              onSuccess={() => {
                fetchBooks(); // Reload books after form submission
                closeModal(); // Close the modal after success
              }}
            />
            <button className="text-red-500 mt-4" onClick={closeModal}>
              Close
            </button>
          </div>
          {/* <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div> */}
        </div>
      )}

      {/* Book List - Display as Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between w-[90%] m-auto border-[1px] border-gray"
          >
            <div>
              <h3 className="text-xl font-bold mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-4">by {book.author}</p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setEditingBook(book);
                  setIsModalOpen(true);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBook(book._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
