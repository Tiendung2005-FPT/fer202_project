import { Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./chapterList.css";
import RenderPagination from "./pagination";

export default function ChapterList({ chapters, storyID, author, userId }) {
    const [chapterDisplay, setChapterDisplay] = useState([]);
    const [page, setPage] = useState(1);
    const [isSortDesc, setIsSortDesc] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const navigate = useNavigate();

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

    const isWithin24Hours = (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInHours = (now - createdDate) / (1000 * 60 * 60);
        return diffInHours <= 24;
    };

    useEffect(() => {
        if (author?.id !== userId) {
            setIsAuthor(true);
            chapters = chapters.filter(c => !c.isDraft)
        }
        if (chapters && chapters.length > 0) {
            const sorted = [...chapters].sort((a, b) => {
                return isSortDesc ? b.order - a.order : a.order - b.order;
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
                    to={c.isDraft ? `/edit-chapter/${storyID}/${c.id}` : `/readStory/${storyID}/${c.order}`}
                    className="d-flex justify-content-between align-items-center p-2 mb-2 chapter-link"
                >
                    <span>
                        {startIndex + i + 1} - {c.title} {c.isDraft ? "(Bản nháp)" : ""}
                    </span>
                    <span style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                        {isAuthor && isWithin24Hours(c.createdAt) && (
                            <span style={{ marginLeft: "10px" }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        navigate(`/edit-chapter/${storyID}/${c.id}`);
                                    }}
                                >Chỉnh sửa</button>
                            </span>
                        )}
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