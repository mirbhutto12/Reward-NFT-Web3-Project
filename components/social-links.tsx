import Link from "next/link"

export function SocialLinks() {
  return (
    <div className="flex justify-center space-x-8 mt-12">
      <Link href="https://discord.gg" target="_blank" className="text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-discord"
        >
          <circle cx="9" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
          <path d="M7.5 7.2c.3-.5.7-1 1.2-1.3a7.8 7.8 0 0 1 6.6 0c.5.3.9.8 1.2 1.3" />
          <path d="M7.5 16.8c.3.5.7 1 1.2 1.3a7.8 7.8 0 0 0 6.6 0c.5-.3.9-.8 1.2-1.3" />
          <path d="M15.5 17.2c-.3.5-.7 1-1.2 1.3a7.8 7.8 0 0 1-6.6 0c-.5-.3-.9-.8-1.2-1.3" />
          <path d="M15.5 6.8c-.3-.5-.7-1-1.2-1.3a7.8 7.8 0 0 0-6.6 0c-.5.3-.9.8-1.2 1.3" />
          <path d="m21.5 14.5-1.5 1.5-2-1-1 2-1.5-1.5" />
          <path d="m8.5 6.5 1.5 1.5 2-1 1 2 1.5-1.5" />
          <path d="m2.5 14.5 1.5 1.5 2-1 1 2 1.5-1.5" />
          <path d="m15.5 6.5-1.5 1.5-2-1-1 2-1.5-1.5" />
        </svg>
      </Link>
      <Link href="https://twitter.com" target="_blank" className="text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-twitter"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      </Link>
      <Link href="https://t.me" target="_blank" className="text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-send"
        >
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </Link>
    </div>
  )
}
