'use client';
import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="absolute top-4 right-4 z-50" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v1a1 1 0 01-2 0V7a7 7 0 1114 0v1a1 1 0 01-2 0V7a5 5 0 00-5-5zm-4 9a4 4 0 018 0v1a1 1 0 102 0v-1a6 6 0 00-12 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="mt-2 w-32 bg-white rounded-md shadow-lg absolute right-0">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md" 
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
