"use client"
import Image from "next/image";
import Link from "next/link";
import ChooseCountry from "./ChooseCountry";
import { useState } from "react";
import EmailSignupForm from "./emailSignupForm";

export default function Register() {
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-purple-400 to-indigo-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        
       
        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Illustration */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-800 to-violet-900 p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <img
                  src="/3293465.jpg"
                  alt="Sign Up Illustration"
                  width={300}
                  height={300}
                  className="mx-auto"
                />
                <h3 className="text-2xl font-bold mt-6">Welcome to Arkan</h3>
                <p className="mt-2 opacity-90">
                  Join thousands of users managing their properties with ease
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 p-8 sm:p-10">
              {showEmailForm ? (
                <EmailSignupForm onBack={() => setShowEmailForm(false)} />
              ) : (
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Get Started
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Create your account in just a few steps
                  </p>

                  <div className="mt-8">
                    <button 
                      onClick={() => setShowEmailForm(true)}
                      className="w-full max-w-xs mx-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-200 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Sign up with Email
                    </button>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      Already have an account?{' '}
                      <Link href="/auth/signin">
                        <span className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer">
                          Sign in
                        </span>
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p className="text-white">
            By proceeding, you agree to our{' '}
            <Link href="/terms" className="text-rose-200 hover:text-rose-500 duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-rose-200 hover:text-rose-500 duration-200">
              Privacy Policy
            </Link>.
          </p>
        </footer>
      </div>
    </section>
  );
}