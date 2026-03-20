async function loadNews() {
  try {
    const res = await fetch("/api/news");
    const data = await res.json();

    const container = document.getElementById("news-list");

    container.innerHTML = data
      .map(
        (news) => `
        <div class="news-item">
          <h3>${news.title}</h3>
          <p>${news.category} | ${news.author}</p>
        </div>
      `,
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

async function submitNews() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const author = document.getElementById("author").value;
  const content = document.getElementById("content").value;

  await fetch("/api/news", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, category, content, author }),
  });

  loadNews();
}

// 모달 열기
function openForm() {
  document.getElementById("form-modal").classList.remove("hidden");
}

// 모달 닫기
function closeForm() {
  document.getElementById("form-modal").classList.add("hidden");
}
loadNews();
