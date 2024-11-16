"use client";

import React from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const UpgradeModal = ({ isOpen, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`modal backdrop-blur-md z-30 ${
        isOpen ? "modal-open" : ""
      } flex items-center justify-center`}
      onClick={onCancel}
    >
      <div
        className="modal-box p-8 bg-white w-[400px] max-w-full rounded-lg shadow-lg relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center w-full mx-auto">
          {/* Title */}
          <h2 className="text-3xl mt-5 font-bold text-gray-800 mb-2 text-center">
            Need Upgrade?
          </h2>
          <p className="text-gray-600 text-center mb-6">
          If you need more Storage, features or have any questions, feel free to reach out to the dev!
          </p>

          {/* Contact Button */}
          <a
            href="mailto:connect.jawadasghar@gmail.com"
            className="text-lg text-white bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition-colors mb-8"
          >
            Contact Us
          </a>

          {/* Divider */}
          <hr className="border-gray-300 w-full my-6" />

          {/* Social Media Section */}
          <p className="text-gray-700 mb-4">Follow me on:</p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/JAWAD-ASGHAR"
              className="text-gray-600 hover:text-orange-600 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={30} />
            </a>
            <a
              href="https://instagram.com/jawad_selectives"
              className="text-gray-600 hover:text-pink-600 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={30} />
            </a>
            <a
              href="https://www.linkedin.com/in/jawad-a-dev/"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;