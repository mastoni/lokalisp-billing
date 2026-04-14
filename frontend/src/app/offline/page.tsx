export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kamu sedang offline</h1>
        <p className="text-gray-600">
          Aplikasi masih bisa dibuka untuk beberapa halaman yang sudah pernah kamu akses sebelumnya.
          Coba nyalakan koneksi untuk sinkronisasi data.
        </p>
      </div>
    </main>
  );
}
