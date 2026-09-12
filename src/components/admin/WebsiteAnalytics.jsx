import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Eye,
  Clock,
  Sprout,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";

// Utility untuk tracking kunjungan menggunakan localStorage
const ANALYTICS_KEY = "mangrovise_analytics";
const DAILY_VISITS_KEY = "mangrovise_daily_visits";

const initializeAnalytics = () => {
  const today = new Date().toISOString().split("T")[0];

  // Ambil data analytics dari localStorage
  let analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "{}");

  // Inisialisasi struktur data jika belum ada
  if (!analytics.totalVisitors) {
    analytics = {
      totalVisitors: 0,
      pageViews: 0,
      sessions: [],
      pageVisits: {
        "/": 0,
        "/katalog": 0,
        "/tentang": 0,
        "/impact": 0,
        "/blog": 0,
      },
      dailyStats: {},
    };
  }

  // Track kunjungan hari ini
  if (!analytics.dailyStats[today]) {
    analytics.dailyStats[today] = {
      visitors: 0,
      pageViews: 0,
      sessions: [],
    };
  }

  return analytics;
};

const trackPageVisit = (path = "/") => {
  const analytics = initializeAnalytics();
  const today = new Date().toISOString().split("T")[0];
  const sessionId = sessionStorage.getItem("mangrovise_session_id") ||
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Set session ID jika belum ada
  if (!sessionStorage.getItem("mangrovise_session_id")) {
    sessionStorage.setItem("mangrovise_session_id", sessionId);
    analytics.totalVisitors++;
    analytics.dailyStats[today].visitors++;
  }

  // Track page view
  analytics.pageViews++;
  analytics.dailyStats[today].pageViews++;

  // Track specific page
  if (analytics.pageVisits[path] !== undefined) {
    analytics.pageVisits[path]++;
  }

  // Track session time
  const sessionStart = parseInt(sessionStorage.getItem("mangrovise_session_start") || Date.now());
  if (!sessionStorage.getItem("mangrovise_session_start")) {
    sessionStorage.setItem("mangrovise_session_start", sessionStart.toString());
  }

  // Save analytics
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
};

// Mock data untuk simulasi analytics yang lebih realistis
const generateMockAnalytics = () => {
  const today = new Date();
  const mockData = {
    totalVisitors: 142,
    pageViews: 1280,
    avgSessionDuration: 225, // dalam detik (3m 45s)
    totalTreesAdopted: 89,
    dailyStats: {},
    pageVisits: {
      "/katalog": 423,
      "/": 298,
      "/impact": 187,
      "/tentang": 142,
      "/blog": 95,
    },
  };

  // Generate data 7 hari terakhir
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    mockData.dailyStats[dateKey] = {
      visitors: Math.floor(15 + Math.random() * 30),
      pageViews: Math.floor(100 + Math.random() * 200),
    };
  }

  return mockData;
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export default function WebsiteAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [viewMode, setViewMode] = useState("7days"); // 7days, 30days

  useEffect(() => {
    // Track page visit on component mount
    trackPageVisit("/admin-dashboard");

    // Load analytics data
    const localData = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "{}");

    // Jika data lokal masih kosong atau sangat minimal, gunakan mock data
    if (!localData.totalVisitors || localData.totalVisitors < 10) {
      const mockData = generateMockAnalytics();
      setAnalytics(mockData);
      // Simpan mock data ke localStorage untuk konsistensi
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(mockData));
    } else {
      setAnalytics(localData);
    }
  }, []);

  // Hitung rata-rata durasi sesi
  const avgSessionDuration = useMemo(() => {
    if (!analytics) return 0;
    return analytics.avgSessionDuration || 225; // default 3m 45s
  }, [analytics]);

  // Data untuk grafik 7 hari terakhir
  const last7DaysData = useMemo(() => {
    if (!analytics?.dailyStats) return [];

    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const dayData = analytics.dailyStats[dateKey] || { visitors: 0, pageViews: 0 };

      data.push({
        date: dateKey,
        label: date.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }),
        visitors: dayData.visitors || 0,
        pageViews: dayData.pageViews || 0,
      });
    }

    return data;
  }, [analytics]);

  // Data halaman paling banyak dikunjungi
  const topPages = useMemo(() => {
    if (!analytics?.pageVisits) return [];

    const pageNames = {
      "/": "Beranda",
      "/katalog": "Katalog Produk",
      "/tentang": "Tentang Kami",
      "/impact": "Kalkulator Dampak",
      "/blog": "Artikel Edukasi",
    };

    return Object.entries(analytics.pageVisits)
      .map(([path, views]) => ({
        path,
        name: pageNames[path] || path,
        views,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, [analytics]);

  // Hitung max visitors untuk chart scaling
  const maxVisitors = useMemo(() => {
    return Math.max(...last7DaysData.map((d) => d.visitors), 1);
  }, [last7DaysData]);

  if (!analytics) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <BarChart3 className="mx-auto h-8 w-8 animate-pulse text-stone-400" />
        <p className="mt-3 text-sm text-stone-500">Memuat data analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-mangrove-deep">
            Statistik Kunjungan Website
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Pantau aktivitas pengunjung dan performa halaman platform
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="h-4 w-4 text-stone-400" />
          <span className="font-medium text-stone-600">
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Pengunjung Hari Ini */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Users className="h-5 w-5 text-emerald-600" />
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-700">
            Pengunjung Hari Ini
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-900">
            {last7DaysData.length > 0
              ? last7DaysData[last7DaysData.length - 1].visitors
              : analytics.totalVisitors}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            Total: {analytics.totalVisitors} pengunjung
          </p>
        </div>

        {/* Total Page Views */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Eye className="h-5 w-5 text-blue-600" />
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-700">
            Total Halaman Dilihat
          </p>
          <p className="mt-1 text-3xl font-bold text-blue-900">
            {analytics.pageViews.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-blue-600">
            {last7DaysData.length > 0
              ? `+${last7DaysData[last7DaysData.length - 1].pageViews} hari ini`
              : "views"}
          </p>
        </div>

        {/* Rata-rata Durasi Sesi */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="text-xs font-bold text-amber-600">AVG</span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-amber-700">
            Rata-rata Durasi Sesi
          </p>
          <p className="mt-1 text-3xl font-bold text-amber-900">
            {formatDuration(avgSessionDuration)}
          </p>
          <p className="mt-1 text-xs text-amber-600">
            per kunjungan
          </p>
        </div>

        {/* Total Pohon Virtual Diadopsi */}
        <div className="rounded-2xl border border-mangrove-light bg-gradient-to-br from-mangrove-light/30 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <Sprout className="h-5 w-5 text-mangrove-deep" />
            <span className="text-xs font-bold text-mangrove-deep">🌳</span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-mangrove-deep">
            Pohon Virtual Diadopsi
          </p>
          <p className="mt-1 text-3xl font-bold text-mangrove-deep">
            {analytics.totalTreesAdopted || 89}
          </p>
          <p className="mt-1 text-xs text-mangrove-dark">
            melalui transaksi web
          </p>
        </div>
      </div>

      {/* Grafik & Data Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grafik Kunjungan 7 Hari Terakhir */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-mangrove-deep">
              Kunjungan 7 Hari Terakhir
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-mangrove-deep"></div>
                <span className="text-stone-500">Pengunjung</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="space-y-3">
            {last7DaysData.map((day, index) => (
              <div key={day.date} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-600">{day.label}</span>
                  <span className="font-bold text-mangrove-deep">
                    {day.visitors} pengunjung
                  </span>
                </div>
                <div className="relative h-8 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-mangrove-deep to-mangrove-dark transition-all duration-500"
                    style={{
                      width: `${(day.visitors / maxVisitors) * 100}%`,
                    }}
                  ></div>
                  <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-stone-500">
                    {day.pageViews} views
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-3">
            <p className="text-xs font-medium text-stone-600">
              Total minggu ini:{" "}
              <span className="font-bold text-mangrove-deep">
                {last7DaysData.reduce((sum, d) => sum + d.visitors, 0)} pengunjung
              </span>
              {" · "}
              <span className="font-bold text-mangrove-deep">
                {last7DaysData.reduce((sum, d) => sum + d.pageViews, 0)} page views
              </span>
            </p>
          </div>
        </div>

        {/* Halaman Paling Sering Dikunjungi */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-mangrove-deep">
              Halaman Paling Populer
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              Ranking berdasarkan jumlah kunjungan
            </p>
          </div>

          <div className="space-y-4">
            {topPages.map((page, index) => {
              const maxViews = topPages[0]?.views || 1;
              const percentage = (page.views / maxViews) * 100;

              return (
                <div key={page.path} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                          index === 0
                            ? "bg-amber-500"
                            : index === 1
                            ? "bg-stone-400"
                            : index === 2
                            ? "bg-amber-700"
                            : "bg-stone-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-stone-700">
                        {page.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-mangrove-deep">
                      {page.views.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0
                          ? "bg-gradient-to-r from-mangrove-deep to-mangrove-dark"
                          : "bg-gradient-to-r from-stone-300 to-stone-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-mangrove-light/50 bg-mangrove-light/20 p-3">
            <p className="text-xs font-medium text-mangrove-deep">
              💡 <span className="font-bold">Insight:</span> Halaman Katalog Produk adalah
              yang paling banyak dikunjungi, menunjukkan minat tinggi pada produk mangrove.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
