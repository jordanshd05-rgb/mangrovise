import { useState } from "react";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { firestore } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  phone: "",
  address: "",
};

export default function RegisterSeller({ onSuccess, onCancel }) {
  const { firebaseUser, isSeller } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!firebaseUser) {
      setError("Silakan masuk terlebih dahulu untuk mendaftarkan toko.");
      return;
    }

    setSaving(true);

    try {
      const batch = writeBatch(firestore);
      const storeRef = doc(firestore, "stores", firebaseUser.uid);
      const userRef = doc(firestore, "users", firebaseUser.uid);

      batch.set(storeRef, {
        ownerId: firebaseUser.uid,
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      batch.set(userRef, {
        email: firebaseUser.email,
        role: "seller",
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await batch.commit();
      setForm(initialForm);
      onSuccess?.();
    } catch (submitError) {
      console.error("Seller registration failed:", submitError);
      setError("Pendaftaran toko gagal disimpan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (isSeller) {
    return (
      <section className="bg-white rounded-3xl border border-stone-200 p-8 text-center shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-mangrove-deep">Pendaftaran toko sedang ditinjau</h1>
        <p className="mt-2 text-sm text-stone-500">Admin akan memeriksa data toko Anda sebelum toko dapat mulai menjual produk.</p>
        <button onClick={onSuccess} className="mt-6 rounded-xl bg-mangrove-deep px-5 py-3 text-sm font-bold text-white">
          Buka Dashboard Toko
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ochre">Multi-Merchant</p>
        <h1 className="mt-2 text-3xl font-serif font-bold text-mangrove-deep">Daftarkan Toko Anda</h1>
        <p className="mt-2 text-sm text-stone-500">Lengkapi profil toko untuk mulai menjual produk di Mangrovise.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Nama Toko
            <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Slug Toko
            <input name="slug" value={form.slug} onChange={handleChange} required pattern="[a-z0-9-]+" placeholder="nama-toko" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
          </label>
        </div>

        <label className="block space-y-2 text-sm font-semibold text-stone-700">
          Deskripsi Toko
          <textarea name="description" value={form.description} onChange={handleChange} required rows="4" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Nomor WhatsApp
            <input name="phone" value={form.phone} onChange={handleChange} required type="tel" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Alamat Toko
            <input name="address" value={form.address} onChange={handleChange} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
          </label>
        </div>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-bold text-stone-600">Batal</button>
          <button type="submit" disabled={saving} className="rounded-xl bg-mangrove-deep px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Menyimpan..." : "Daftarkan Toko"}
          </button>
        </div>
      </form>
    </section>
  );
}
