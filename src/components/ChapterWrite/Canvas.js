import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Canvas() {
    const [stories, setStories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:9999/stories")
            .then(result => setStories(result.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            {stories.map(story => (
                <div key={story.id}>
                    {story.title}
                    <Link to={`/write-chapter/${story.id}`}>Edit</Link>
                </div>
            ))}
        </div>
    );
}