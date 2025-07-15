
import { Link } from "react-router-dom";
export default function StoryBreakcumb({ title , id }) {
  return (
    <div className="mb-3 text-muted small">
      
      <span> <Link to={"/home"} className="text-muted text-decoration-none me-1" > Trang chủ  </Link> 
      / 
      <Link to={`/storypage/${id}`} className="text-muted text-decoration-none me-1" > {title} </Link></span>
    </div>
  );
}
