export default function Footer() {
  return (
    <footer className="border-t border-border px-4 sm:px-8 py-6 flex justify-between items-center text-sm text-subtle flex-wrap gap-2">
      <span>© 2026 DeepMatch</span>
      <span className="flex gap-4">
        <a href="#" className="hover:text-gold transition-colors">Privacy</a>
        <span>·</span>
        <a href="#" className="hover:text-gold transition-colors">Terms</a>
        <span>·</span>
        <a href="#" className="hover:text-gold transition-colors">Contact</a>
      </span>
    </footer>
  )
}
