
import { Link } from 'react-router-dom';

const CategoryDropdown = () => {
  return (
    <div className="absolute mt-2 w-64 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
      <div className="py-1">
        {[
          { to: "/generators", label: "All Generators" },
  { to: "/business-brand", label: "Business & Brand Names" },
  { to: "/personal-social", label: "Personal & Social Media" },
  { to: "/writing-creative", label: "Writing & Creative" },
  { to: "/niche-specific", label: "Niche-Specific" },
  { to: "/tech-industry", label: "Tech & Industry" },
  { to: "/geographical-local", label: "Geographical & Local" },
  { to: "/fantasy-gaming", label: "Fantasy & Gaming" },
  { to: "/specialty-fun", label: "Specialty & Fun" }
        ].map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
