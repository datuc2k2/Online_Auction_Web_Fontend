// components/Breadcrumb.tsx
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div style={styles.breadcrumbContainer}>
      <Link href="/" style={styles.iconBack}>
        <FaArrowLeft />
      </Link>
      {items.map((item, index) => (
        <div key={index} style={styles.breadcrumbItem}>
          {item.href ? (
            <Link href={item.href} style={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span style={styles.separator}>&gt;</span>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  breadcrumbContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "1em",
    color: "#333",
    fontFamily: "Arial, sans-serif",
    padding: "10px 20px", // Thêm padding để phần breadcrumb có khoảng cách từ viền
    backgroundColor: "#f9f9f9", // Thêm màu nền nhạt để phân biệt với phần nội dung khác
    borderRadius: "5px", // Bo tròn các góc
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Thêm hiệu ứng bóng cho breadcrumb
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "600",
    transition: "color 0.3s, font-weight 0.3s", // Thêm hiệu ứng thay đổi độ đậm
    "&:hover": {
      color: "#0056b3", // Màu sắc khi hover
      fontWeight: "700", // Đậm hơn khi hover
    },
  },
  iconBack: {
    fontSize: "1.2em",
    color: "#007bff",
    cursor: "pointer",
    transition: "color 0.3s",
    display: "flex",
    alignItems: "center",
    marginRight: "10px", // Khoảng cách bên phải để không quá sát với breadcrumb
    "&:hover": {
      color: "#0056b3", // Màu sắc khi hover
    },
  },
  separator: {
    margin: "0 5px",
    color: "#888",
    fontSize: "1.1em",
  },
  breadcrumbItem: {
    display: "flex",
    alignItems: "center",
  },
};
