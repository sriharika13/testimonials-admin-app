"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/user/profile');
                setLoggedIn(!!response.data.user);
            } catch (error) {
                console.error("Error checking login status:", error);
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            await axios.get("/api/user/logout");
            setLoggedIn(false);
            router.push("/signin");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white shadow-lg p-4 rounded-md md:rounded-full max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Link href="/">
                        <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 cursor-pointer">
                            Endorsify
                        </span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    {loading ? (
                        <span>Loading...</span>
                    ) : loggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/signin">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300">
                                Login
                            </button>
                        </Link>
                    )}
                </div>

                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-2xl text-yellow-500">
                        {isOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden mt-4 flex flex-col space-y-4">
                    {loading ? (
                        <span>Loading...</span>
                    ) : loggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/signin">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
