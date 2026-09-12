import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, Share2 } from "lucide-react";
import { getArticleBySlug } from "../services/articleService.js";

const formatDate = (value) => {
  if (!value) return "Tanggal tidak tersedia";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "Tanggal tidak tersedia" : new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function BlogDetailPage({ slug, onBack }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));

  useEffect(() => {
    if (!slug) {
      setArticle(null);
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    setLoading(true);
    getArticleBySlug(slug)
      .then((nextArticle) => {
        if (isMounted) setArticle(nextArticle);
      })
      .catch((error) => {
        console.error("Loading article detail failed:", error);
        if (isMounted) setArticle(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = async () => {
    if (!article) return;

    const shareUrl = `${window.location.origin}/blog/${article.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      window.alert("Link artikel berhasil disalin ke clipboard.");
    } catch (error) {
      console.error("Sharing article failed:", error);
      window.alert("Tidak dapat membagikan artikel pada saat ini.");
    }
  };

  if (loading) {
    return <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">Memuat artikel...</div>;
  }

  if (!article) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-2xl font-serif font-bold text-red-800">Artikel tidak ditemukan</h1>
        <p className="mt-2 text-sm text-red-700">Konten yang Anda cari tidak tersedia atau sudah dihapus.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 rounded-full bg-mangrove-deep px-4 py-2.5 text-sm font-bold text-white"
        >
          Kembali ke Blog
        </button>
      </section>
    );
  }

  const paragraphs = (article.content || "").split(/\n+/).filter(Boolean);

  return (
    <article className="space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Blog
      </button>

      <header className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="h-72 w-full object-cover md:h-96" />
        ) : (
          <div className="flex h-72 items-center justify-center bg-gradient-to-br from-emerald-100 to-lime-100 text-emerald-700 md:h-96">
            <CalendarDays className="h-14 w-14" />
          </div>
        )}

        <div className="space-y-5 p-5 md:p-8">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">{article.category}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(article.publishedAt || article.createdAt)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {article.readTime} menit baca</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-serif font-bold text-mangrove-deep md:text-5xl">{article.title}</h1>
              <p className="max-w-2xl text-sm text-stone-600">{article.excerpt}</p>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-mangrove-deep px-4 py-2.5 text-sm font-bold text-white"
            >
              <Share2 className="h-4 w-4" />
              Bagikan
            </button>
          </div>
        </div>
      </header>

      <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm md:p-8">
        <div className="prose prose-stone max-w-none text-[15px] leading-8 text-stone-700">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={`${article.id}-${index}`} className="mb-5 whitespace-pre-line">{paragraph}</p>
            ))
          ) : (
            <p>{article.content}</p>
          )}
        </div>
      </div>
    </article>
  );
}
