import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img
                src="OverPromptLogo.png"
                alt="OverPrompt Logo"
                className="w-16 h-16"
              />

              <img
                src="OverPrompt.png"
                alt="OverPrompt"
                className="h-20 w-auto"
              />
            </div>

            <p className="mt-5 text-gray-600 leading-7">
              Discover hidden AI subscription waste, compare smarter
              alternatives, and stop paying for tools your team doesn't need.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Product
              </h3>

              <ul className="space-y-3 text-gray-500">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    Features
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    Pricing
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    AI Audit
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Resources
              </h3>

              <ul className="space-y-3 text-gray-500">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    Blog
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    FAQs
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Legal
              </h3>

              <ul className="space-y-3 text-gray-500">
                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    Terms of Service
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-blue-700 transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-blue-100 my-10"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} OverPrompt. All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            <a
              href="#"
              className="text-gray-500 hover:text-blue-700 transition"
            >
              GitHub
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-blue-700 transition"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-blue-700 transition"
            >
              X
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;