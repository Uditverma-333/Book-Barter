import { Link } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import avatarImg from "../assets/avatar.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const navigation = [
    { name: "Dashboard", href: "/user-dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Cart Page", href: "/cart" },
    { name: "Check Out", href: "/checkout" },
    { name: "Sell Book", href: "/sell-book" },
];

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);  // Set initial state to an empty array
    const cartItems = useSelector((state) => state.cart.cartItems);
    const { currentUser, logout } = useAuth();
    const token = localStorage.getItem("token");

    const handleLogOut = () => {
        logout();
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        console.log("Search term:", searchTerm);
    
        if (searchTerm) {
            try {
                const response = await axios.get(`/api/books/search?query=${searchTerm}`);
                console.log("Response data:", response.data); // Check the structure here
                setSearchResults(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching search results", error);
                setSearchResults([]);
            }
        }
    };
    
    return (
        <header className="max-w-screen-2xl mx-auto px-4 py-6">
            <nav className="flex justify-between items-center">
                {/* Left side */}
                <div className="flex items-center gap-4 md:gap-16">
                    <Link to="/">
                        <img src="/fav-icon.png" alt="Logo" className="w-12 h-12" />
                    </Link>

                    {/* Search input */}
                    <div className="relative w-full sm:w-96 md:w-96 lg:w-96">
                        <form onSubmit={handleSearch}>
                            <IoSearchOutline className="absolute left-3 inset-y-2" />
                            <input
                                type="text"
                                placeholder="Search here"
                                className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                        {/* Display search results */}
                        {searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 mt-2 bg-white shadow-md rounded-md max-h-40 overflow-y-auto z-50">
                                {searchResults.map((book) => (
                                    <Link
                                        key={book._id}
                                        to={`/books/${book._id}`}
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => setSearchResults([])}
                                    >
                                        {book.title}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-6 md:space-x-8 relative">
                    <div>
                        {currentUser ? (
                            <>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <img
                                        src={avatarImg}
                                        alt="Profile"
                                        className={`w-7 h-7 rounded-full ${currentUser ? "ring-2 ring-blue-500" : ""}`}
                                    />
                                </button>
                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                                        <ul className="py-2">
                                            {navigation.map((item) => (
                                                <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                                                    <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    onClick={handleLogOut}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : token ? (
                            <Link to="/dashboard" className="border-b-2 border-primary">
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm text-black hover:bg-opacity-80 transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Sell button */}
                    <Link
                        to="/sell-book"
                        className="hidden sm:block bg-primary p-1 sm:px-6 px-2 items-center rounded-sm text-black hover:bg-opacity-80 transition"
                    >
                        Sell
                    </Link>

                    {/* Cart button */}
                    <Link to="/cart" className="bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm">
                        <HiOutlineShoppingCart />
                        <span className="text-sm font-semibold sm:ml-1">
                            {cartItems.length > 0 ? cartItems.length : 0}
                        </span>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
