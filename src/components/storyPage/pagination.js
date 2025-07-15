import "./pagination.css"; 

export default function RenderPagination({ page, totalPage, setPage, handlePrev, handleNext }) {
    const pageLinks = [];

    if (page > 1) {
        pageLinks.push(
            <span
                key="prev"
                role="button"
                onClick={handlePrev}
                className="page-btn"
            >
                &lt;
            </span>
        );
    }

    pageLinks.push(
        <span
            key="first"
            onClick={() => setPage(1)}
            className={`page-btn ${page === 1 ? 'active' : ''}`}
        >
            1
        </span>
    );

    if (page > 3) pageLinks.push(<span key="start-dots" className="page-ellipsis">...</span>);

    for (let p = 2; p < totalPage; p++) {
        if (Math.abs(p - page) <= 1) {
            pageLinks.push(
                <span
                    key={p}
                    onClick={() => setPage(p)}
                    className={`page-btn ${page === p ? 'active' : ''}`}
                >
                    {p}
                </span>
            );
        }
    }

    if (page < totalPage - 2) pageLinks.push(<span key="end-dots" className="page-ellipsis">...</span>);

    if (totalPage > 1) {
        pageLinks.push(
            <span
                key="last"
                onClick={() => setPage(totalPage)}
                className={`page-btn ${page === totalPage ? 'active' : ''}`}
            >
                {totalPage}
            </span>
        );
    }

    if (page < totalPage) {
        pageLinks.push(
            <span
                key="next"
                role="button"
                onClick={handleNext}
                className="page-btn"
            >
                &gt;
            </span>
        );
    }

    return <div className="pagination-container">{pageLinks}</div>;
}