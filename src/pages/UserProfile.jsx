import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref as dbRef, set as dbSet } from "firebase/database";
import { CheckCircle2, UserCircle2 } from "lucide-react";
import { auth, db, firestore } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";

const initialAddress = {
  recipientName: "",
  phone: "",
  addressDetails: "",
  provinceCity: "",
  postalCode: "",
};

const getInitialProfile = (firebaseUser, profile) => ({
  displayName: firebaseUser?.displayName || profile?.displayName || "",
  phone: profile?.phone || "",
  photoURL: firebaseUser?.photoURL || profile?.photoURL || "",
});

export default function UserProfile() {
  const { firebaseUser, profile, role } = useAuth();
  const [profileForm, setProfileForm] = useState(() => getInitialProfile(firebaseUser, profile));
  const [address, setAddress] = useState(initialAddress);
  const [saving, setSaving] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firebaseUser) return;
    setProfileForm(getInitialProfile(firebaseUser, profile));
  }, [firebaseUser, profile]);

  useEffect(() => {
    if (!firebaseUser) {
      setLoadingAddress(false);
      return;
    }

    setLoadingAddress(true);
    getDoc(doc(firestore, "users", firebaseUser.uid))
      .then((snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : {};
        setAddress({ ...initialAddress, ...(data.address || {}) });
      })
      .catch((readError) => {
        console.error("Loading saved address failed:", readError);
        setError("Alamat tersimpan gagal dimuat.");
      })
      .finally(() => setLoadingAddress(false));
  }, [firebaseUser]);

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const updateAddressField = (event) => {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!firebaseUser) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const displayName = profileForm.displayName.trim();
      const phone = profileForm.phone.trim();
      const photoURL = profileForm.photoURL.trim();

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || null,
      });

      await setDoc(doc(firestore, "users", firebaseUser.uid), {
        email: firebaseUser.email,
        displayName,
        phone,
        photoURL,
        address,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Keep the existing checkout listener and old address records compatible.
      await dbSet(dbRef(db, `users/${firebaseUser.uid}/profile/address`), address);
      setMessage("Profil dan alamat berhasil disimpan.");
    } catch (saveError) {
      console.error("Saving user profile failed:", saveError);
      setError("Perubahan profil gagal disimpan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (!firebaseUser) {
    return <p className="rounded-2xl bg-white p-8 text-center text-sm text-stone-500">Silakan masuk untuk melihat profil.</p>;
  }

  return (
    <section className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ochre">Account Center</p>
        <h1 className="mt-2 text-3xl font-serif font-bold text-mangrove-deep">Profil & Pengaturan Akun</h1>
        <p className="mt-2 text-sm text-stone-500">Kelola identitas dan alamat utama untuk mempercepat checkout.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3"><UserCircle2 className="h-6 w-6 text-accent-ochre" /><h2 className="text-xl font-serif font-bold text-stone-800">Informasi Profil</h2></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-stone-700">Nama Lengkap<input name="displayName" value={profileForm.displayName} onChange={updateProfileField} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-700">Nomor Telepon / WhatsApp<input name="phone" value={profileForm.phone} onChange={updateProfileField} type="tel" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2">URL Foto Profil<input name="photoURL" value={profileForm.photoURL} onChange={updateProfileField} type="url" placeholder="https://..." className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" /></label>
          </div>
          {profileForm.photoURL && <img src={profileForm.photoURL} alt="Preview foto profil" className="mt-5 h-20 w-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />}
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 text-xl font-serif font-bold text-stone-800">Alamat Pengiriman Utama</h2>
          {loadingAddress ? <p className="mb-5 text-sm text-stone-500">Memuat alamat...</p> : <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-stone-700">Nama Penerima<input name="recipientName" value={address.recipientName} onChange={updateAddressField} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-700">No. HP<input name="phone" value={address.phone} onChange={updateAddressField} required type="tel" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2">Alamat Lengkap<textarea name="addressDetails" value={address.addressDetails} onChange={updateAddressField} required rows="3" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-700">Kota / Provinsi<input name="provinceCity" value={address.provinceCity} onChange={updateAddressField} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-700">Kode Pos<input name="postalCode" value={address.postalCode} onChange={updateAddressField} required inputMode="numeric" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" /></label>
          </div>}
        </section>

        <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8"><h2 className="mb-4 text-xl font-serif font-bold text-stone-800">Rincian Akun</h2><div className="grid gap-4 text-sm sm:grid-cols-3"><p><span className="block text-xs text-stone-400">Email</span><strong className="break-words text-stone-800">{firebaseUser.email}</strong></p><p><span className="block text-xs text-stone-400">Role Akun</span><strong className="capitalize text-stone-800">{role}</strong></p><p><span className="block text-xs text-stone-400">Tanggal Bergabung</span><strong className="text-stone-800">{firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString("id-ID") : "-"}</strong></p></div></section>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />{message}</p>}
        <button type="submit" disabled={saving || loadingAddress} className="rounded-xl bg-mangrove-deep px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Perubahan"}</button>
      </form>
    </section>
  );
}
