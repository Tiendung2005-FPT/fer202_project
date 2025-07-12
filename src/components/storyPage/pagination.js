import "./pagination.css";

export default function RenderPagination({ page, totalPage, setPage, handlePrev, handleNext }) {
  const pageLinks = [];

  if (page > 1) {
    pageLinks.push(
      <button key="prev" className="page-btn" onClick={handlePrev}>
        &lt;
      </button>
    );
  }

  pageLinks.push(
    <button
      key="first"
      className={`page-btn ${page === 1 ? "active" : ""}`}
      onClick={() => setPage(1)}
    >
      1
    </button>
  );

  if (page > 3) {
    pageLinks.push(<span key="left-ellipsis" className="page-ellipsis">...</span>);
  }

  for (let p = 2; p < totalPage; p++) {
    if (Math.abs(p - page) <= 1) {
      pageLinks.push(
        <button
          key={p}
          className={`page-btn ${page === p ? "active" : ""}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      );
    }
  }

  if (page < totalPage - 2) {
    pageLinks.push(<span key="right-ellipsis" className="page-ellipsis">...</span>);
  }

  if (totalPage > 1) {
    pageLinks.push(
      <button
        key="last"
        className={`page-btn ${page === totalPage ? "active" : ""}`}
        onClick={() => setPage(totalPage)}
      >
        {totalPage}
      </button>
    );
  }

  if (page < totalPage) {
    pageLinks.push(
      <button key="next" className="page-btn" onClick={handleNext}>
        &gt;
      </button>
    );
  }

  return <div className="pagination-container">{pageLinks}</div>;
}
