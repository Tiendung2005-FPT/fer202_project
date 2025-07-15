import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./chapterList.css";
import RenderPagination from "./pagination";

export default function ChapterList({ chapters , storyID}) {
    const [chapterDisplay, setChapterDisplay] = useState([]);
    const [page, setPage] = useState(1);
    const [isSortDesc, setIsSortDesc] = useState(false);
    
    const pageSize = 10;
    const totalPage = Math.ceil(chapterDisplay.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentChapters = chapterDisplay.slice(startIndex, endIndex);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPage) setPage(page + 1);
    };

    useEffect(() => {
        if (chapters && chapters.length > 0) {
            const sorted = [...chapters].sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return isSortDesc ? dateB - dateA : dateA - dateB;
            });
            setChapterDisplay(sorted);
            setPage(1);
        }
    }, [chapters, isSortDesc]);

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between gap-2">
                <h5>Danh sách chương</h5>
                <Button
                    style={{ backgroundColor: "#add158ff", border: "none" }}
                    onClick={() => setIsSortDesc(!isSortDesc)}
                >
                    <span className="bi bi-sort-down" style={{ fontSize: "1rem" }}></span>
                </Button>
            </div>
            <hr />

            {currentChapters.map((c, i) => (
                <Link
                    key={c.id}
                    to={`/readStory/${storyID}/${c.id}`}
                    className="d-flex justify-content-between align-items-center p-2 mb-2 chapter-link"
                >
                    <span>
                        {startIndex + i + 1} - {c.title}
                    </span>
                    <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                </Link>
            ))}

            <div className="d-flex justify-content-center gap-2 mt-3">
                <RenderPagination
                    page={page}
                    totalPage={totalPage}
                    setPage={setPage}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                />
            </div>
        </Container>
    );
}