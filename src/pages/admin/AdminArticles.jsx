import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  FileText,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { deleteArticle, getAllArticles, saveArticle } from "../../services/articleService.js";

const ADMIN_EMAILS = ["admin@mangrovise.store"];
const defaultForm = {
  title: "",
  category: "Umum",
  coverImage: "",
  content: "",
  status: "draft",
};

function compressImage(file, maxWidth = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(1, maxWidth / image.width);
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      image.onerror = () => reject(new Error("Gagal membaca gambar sampul."));
      image.src = String(reader.result || "");
    };

    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
}

const formatDate = (value) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function AdminArticles() {
  const { firebaseUser, role, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [formData, setFormData] = useState(defaultForm);

  const isAllowed = Boolean(firebaseUser) && (role === "admin" || role === "seller" || ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase()));

  const loadArticles = async () => {
    setLoading(true);
    try {
      const nextArticles = await getAllArticles();
      setArticles(nextArticles);
      setError("");
    } catch (loadError) {
      console.error("Loading articles failed:", loadError);
      setError("Data artikel gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAllowed) return undefined;
    loadArticles();
    return undefined;
  }, [isAllowed]);

  const categoryOptions = useMemo(
    () => ["Umum", "Restorasi", "Kebijakan", "Edukasi", "Produk", "Masyarakat"],
    []
  );

  const openNewForm = () => {
    setSelectedArticleId("");
    setFormData(defaultForm);
    setIsFormOpen(true);
    setError("");
  };

  const openEditForm = (article) => {
    setSelectedArticleId(article.id);
    setFormData({
      title: article.title || "",
      category: article.category || "Umum",
      coverImage: article.coverImage || "",
      content: article.content || "",
      status: article.status || "draft",
    });
    setIsFormOpen(true);
    setError("");
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 1200, 0.75);
      setFormData((previous) => ({ ...previous, coverImage: compressed }));
    } catch (photoError) {
      console.error("Compressing article image failed:", photoError);
      setError("Gambar sampul gagal diproses. Silakan pilih gambar lain.");
    }
  };

  const handleSave = async (nextStatus = formData.status || "draft") => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Judul dan isi artikel wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        id: selectedArticleId || undefined,
        title: formData.title.trim(),
        category: formData.category,
        coverImage: formData.coverImage,
        content: formData.content,
        status: nextStatus,
        excerpt: formData.content.replace(/\s+/g, " ").slice(0, 180),
      };

      await saveArticle(payload);
      setIsFormOpen(false);
      setSelectedArticleId("");
      setFormData(defaultForm);
      await loadArticles();
    } catch (saveError) {
      console.error("Saving article failed:", saveError);
      setError("Artikel gagal disimpan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (article) => {
    if (!window.confirm(`Hapus artikel "${article.title}"?`)) return;

    try {
      await deleteArticle(article.id);
      await loadArticles();
    } catch (deleteError) {
      console.error("Deleting article failed:", deleteError);
      setError("Artikel gagal dihapus.");
    }
  };

  const handleToggleStatus = async (article) => {
    try {
      await saveArticle({
        ...article,
        status: article.status === "published" ? "draft" : "published",
      });
      await loadArticles();
    } catch (toggleError) {
      console.error("Toggle article status failed:", toggleError);
      setError("Status artikel gagal diubah.");
    }
  };

  if (authLoading) {
    return <p className="rounded-2xl bg-white p-8 text-center text-sm text-stone-500">Memeriksa hak akses artikel...</p>;
  }

  if (!isAllowed) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-serif font-bold text-red-800">Akses Ditolak</h1>
        <p className="mt-2 text-sm text-red-700">Halaman manajemen artikel hanya dapat diakses oleh pengguna yang sudah login dengan hak admin atau seller.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ochre">Konten Edukasi</p>
          <h1 className="mt-2 text-3xl font-serif font-bold text-mangrove-deep">Manajemen Artikel</h1>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="inline-flex items-center gap-2 rounded-full bg-mangrove-deep px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Tulis Artikel Baru
        </button>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="p-4">Judul</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-stone-500">Memuat artikel...</td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-stone-500">Belum ada artikel yang dibuat.</td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {article.coverImage ? (
                        <img src={article.coverImage} alt={article.title} className="h-12 w-12 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                          <FileText className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-stone-800">{article.title}</p>
                        <p className="mt-1 text-xs text-stone-500">{article.readTime || 1} min baca</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-stone-600">{article.category}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${article.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>
                      {article.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(article.publishedAt || article.createdAt)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(article)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(article)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {article.status === "published" ? "Draft" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(article)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ochre">Editor Konten</p>
                <h2 className="mt-2 text-2xl font-serif font-bold text-mangrove-deep">
                  {selectedArticleId ? "Edit Artikel" : "Tulis Artikel Baru"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-full border border-stone-200 p-2 text-stone-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-stone-700">Judul Artikel</span>
                <input
                  value={formData.title}
                  onChange={(event) => setFormData((previous) => ({ ...previous, title: event.target.value }))}
                  placeholder="Judul artikel edukasi"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:border-emerald-500 focus:outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-700">Kategori</span>
                <select
                  value={formData.category}
                  onChange={(event) => setFormData((previous) => ({ ...previous, category: event.target.value }))}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:border-emerald-500 focus:outline-none"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-stone-700">Foto Sampul</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 file:mr-3 file:rounded-full file:border-0 file:bg-mangrove-deep file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                />
              </label>

              {formData.coverImage && (
                <div className="md:col-span-2 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-3">
                  <img src={formData.coverImage} alt="Cover preview" className="h-52 w-full rounded-xl object-cover" />
                </div>
              )}

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-stone-700">Konten Artikel</span>
                <textarea
                  value={formData.content}
                  onChange={(event) => setFormData((previous) => ({ ...previous, content: event.target.value }))}
                  placeholder="Tulis isi artikel lengkap di sini..."
                  rows={14}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:border-emerald-500 focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-full border border-stone-200 px-4 py-2.5 text-sm font-bold text-stone-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Draft"}
              </button>
              <button
                type="button"
                onClick={() => handleSave("published")}
                disabled={saving}
                className="rounded-full bg-mangrove-deep px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? "Memproses..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
