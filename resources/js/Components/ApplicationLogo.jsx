export default function ApplicationLogo({ className = '' }) {
    return (
        <svg
            viewBox="0 0 48 48"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Sportify"
        >
            <rect width="48" height="48" rx="14" fill="currentColor" />
            <circle cx="24" cy="24" r="13" stroke="white" strokeWidth="2" fill="none" />
            <path
                d="M24 11.5 29.5 17l-2 7h-7l-2-7L24 11.5ZM18.5 17 11 20.5l2.5 7.2 5.8-1.3M29.5 17l7.5 3.5-2.5 7.2-5.8-1.3M24 24l4 6.8-4 5.2-4-5.2L24 24Z"
                stroke="white"
                strokeWidth="1.7"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
