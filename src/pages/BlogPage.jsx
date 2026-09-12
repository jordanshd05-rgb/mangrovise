import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpenText, Search } from "lucide-react";
import { getPublishedArticles } from "../services/articleService.js";

const formatDate = (value) => {
  if (!value) return "Tanggal tidak tersedia";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "Tanggal tidak tersedia" : new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

function ArticleCard({ article, onOpenArticle }) {
  const coverUrl = article.coverImage || article.coverBase64 || "";

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="w-full aspect-[16/9] overflow-hidden rounded-t-xl bg-gray-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={article.title}
            className="w-full h-full object-cover h-48"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700">
            <BookOpenText className="h-12 w-12" />
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">{article.category}</span>
          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          <span>•</span>
          <span>{article.readTime || 1} min baca</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-mangrove-deep">{article.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
            {article.excerpt || "Baca artikel lengkap untuk mengetahui lebih lanjut."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenArticle?.(article.slug)}
          className="inline-flex items-center gap-2 rounded-full bg-mangrove-deep px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900"
        >
          Baca artikel
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default function BlogPage({ onOpenArticle }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    let isMounted = true;

    const loadPublishedArticles = async () => {
      setLoading(true);

      try {
        const nextArticles = await getPublishedArticles();
        if (isMounted) setArticles(nextArticles);
      } catch (error) {
        console.error("Loading published articles failed:", error);
        if (isMounted) setArticles([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPublishedArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => ["Semua", ...new Set(articles.map((article) => article.category).filter(Boolean))],
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;
      const haystack = `${article.title} ${article.excerpt} ${article.category}`.toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [articles, searchTerm, selectedCategory]);

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-ochre">Edukasi Mangrove</p>
        <h1 className="text-3xl font-serif font-bold text-mangrove-deep md:text-5xl">Blog & Edukasi Mangrove</h1>
        <p className="max-w-3xl text-sm leading-6 text-stone-600 md:text-base">
          Pelajari manfaat mangrove, praktik restorasi, serta inspirasi produk dan komunitas lestari yang tumbuh bersama Mangrovise.
        </p>
      </header>

      <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-600">
            <Search className="h-4 w-4 text-stone-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cari artikel atau topik..."
              className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                  selectedCategory === category
                    ? "bg-mangrove-deep text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
          Memuat artikel edukasi...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
          Tidak ada artikel yang cocok dengan filter saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onOpenArticle={onOpenArticle} />
          ))}
        </div>
      )}
    </section>
  );
}
