'use client';

export default function ScrollToTopButton() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
    >
      Get Started Now - It's Free!
    </a>
  );
}
