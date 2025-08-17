// src/components/Footer.tsx

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // ★ 変更点: クラスを全面的に新しいテーマのものに置き換え
    <footer className="bg-background border-t border-card-border mt-12 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground/60">
        <p>
          &copy; {currentYear} Modern Tech Blog. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;