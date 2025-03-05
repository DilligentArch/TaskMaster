const Footer = () => {
    return (
      <footer className="bg-gray-700 border-t border-gray-300 text-center py-4 mt-12">
        <p className="text-slate-200 text-sm">
          © {new Date().getFullYear()} TaskMaster. All rights reserved.
        </p>
      </footer>
    );
  };
  
  export default Footer;
  