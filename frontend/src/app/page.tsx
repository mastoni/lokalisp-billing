'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Menu,
  X,
  Wifi,
  Headphones,
  Clock,
  Shield,
  Gauge,
  MonitorSmartphone,
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                LokalISP
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition">
                Keunggulan
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 font-medium transition">
                Paket Internet
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 font-medium transition">
                Tentang Kami
              </a>
              <Link
                href="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
              >
                Login Pelanggan
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-primary-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
              >
                Keunggulan
              </a>
              <a
                href="#pricing"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
              >
                Paket Internet
              </a>
              <a
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
              >
                Tentang Kami
              </a>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-primary-600 font-bold"
              >
                Login Pelanggan
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Internet Cepat & Stabil untuk Rumah Anda
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Nikmati koneksi internet unlimited dengan kecepatan hingga 100 Mbps. 
              Streaming, gaming, dan WFH tanpa buffering. Harga mulai dari Rp 150.000/bulan!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-flex items-center justify-center"
              >
                Berlangganan Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#pricing"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition inline-flex items-center justify-center"
              >
                Lihat Paket
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600 text-sm md:text-base">Pelanggan Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-600 text-sm md:text-base">Uptime Jaringan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600 text-sm md:text-base">Support Teknis</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">10+</div>
              <div className="text-gray-600 text-sm md:text-base">Tahun Pengalaman</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Kenapa Pilih LokalISP?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pelayanan internet terbaik untuk Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Gauge className="h-10 w-10 text-primary-600" />}
              title="Kecepatan Tinggi"
              description="Nikmati kecepatan internet hingga 100 Mbps dengan teknologi fiber optic terbaru."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary-600" />}
              title="Uptime 99.9%"
              description="Koneksi stabil dan handal dengan jaminan uptime hingga 99.9%."
            />
            <FeatureCard
              icon={<Headphones className="h-10 w-10 text-primary-600" />}
              title="Support 24/7"
              description="Tim support siap membantu Anda kapan saja melalui telepon atau WhatsApp."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary-600" />}
              title="Aman & Terpercaya"
              description="Jaringan aman dengan proteksi firewall dan enkripsi data."
            />
            <FeatureCard
              icon={<MonitorSmartphone className="h-10 w-10 text-primary-600" />}
              title="Unlimited Usage"
              description="Tidak ada batasan FUP! Gunakan internet sepuasnya tanpa khawatir."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary-600" />}
              title="Instalasi Cepat"
              description="Proses instalasi gratis dan bisa dilakukan dalam 1-2 hari kerja."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Paket Internet Bulanan
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan Anda. Semua paket unlimited tanpa FUP!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PricingCard
              name="Basic"
              speed="10 Mbps"
              price="150.000"
              description="Cocok untuk browsing dan media sosial"
              features={[
                'Kecepatan hingga 10 Mbps',
                'Unlimited tanpa FUP',
                'Support 24/7',
                '1-3 perangkat',
                'Gratis instalasi',
              ]}
            />
            <PricingCard
              name="Standard"
              speed="20 Mbps"
              price="250.000"
              description="Ideal untuk streaming HD"
              features={[
                'Kecepatan hingga 20 Mbps',
                'Unlimited tanpa FUP',
                'Support 24/7',
                '3-5 perangkat',
                'Gratis instalasi',
                'IP Public Static',
              ]}
            />
            <PricingCard
              name="Premium"
              speed="50 Mbps"
              price="350.000"
              description="Sempurna untuk WFH dan gaming"
              features={[
                'Kecepatan hingga 50 Mbps',
                'Unlimited tanpa FUP',
                'Support 24/7 prioritas',
                '5-10 perangkat',
                'Gratis instalasi',
                'IP Public Static',
                'Free router WiFi',
              ]}
              highlighted={true}
            />
            <PricingCard
              name="Ultimate"
              speed="100 Mbps"
              price="450.000"
              description="Untuk rumah pintar dan bisnis"
              features={[
                'Kecepatan hingga 100 Mbps',
                'Unlimited tanpa FUP',
                'Support 24/7 prioritas',
                'Unlimited perangkat',
                'Gratis instalasi',
                'IP Public Static',
                'Free router WiFi 6',
                'Dedicated bandwidth',
              ]}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                ISP Lokal Terpercaya
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                LokalISP adalah penyedia layanan internet lokal yang telah berpengalaman lebih dari 10 tahun. 
                Kami berkomitmen memberikan koneksi internet terbaik dengan harga terjangkau untuk masyarakat.
              </p>
              <ul className="space-y-4">
                <ListItem>Jaringan fiber optic modern</ListItem>
                <ListItem>Tim teknisi profesional dan berpengalaman</ListItem>
                <ListItem>Customer service ramah dan responsif</ListItem>
                <ListItem>Harga kompetitif tanpa biaya tersembunyi</ListItem>
                <ListItem>Garansi koneksi atau uang kembali</ListItem>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Area Jangkauan Luas</h3>
                    <p className="text-gray-600">Melayani berbagai wilayah dengan jaringan yang terus berkembang</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Gratis Survey & Instalasi</h3>
                    <p className="text-gray-600">Tim kami akan melakukan survey dan instalasi tanpa biaya</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Garansi Koneksi</h3>
                    <p className="text-gray-600">Jika tidak puas dalam 30 hari, uang Anda kembali</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Siap Berlangganan?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 text-primary-100">
            Hubungi kami sekarang dan dapatkan diskon 20% untuk bulan pertama!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-flex items-center"
            >
              <Phone className="mr-2 h-5 w-5" />
              WhatsApp Kami
            </a>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition inline-flex items-center"
            >
              Login Pelanggan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Wifi className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">LokalISP</span>
              </div>
              <p className="text-gray-400">
                Penyedia layanan internet lokal terpercaya dengan koneksi cepat dan stabil.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Menu Cepat</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition">
                    Keunggulan
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition">
                    Paket Internet
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white transition">
                    Login Pelanggan
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Hubungi Kami</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-2" />
                  +62 812-3456-7890
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-2" />
                  info@lokalisp.com
                </li>
                <li className="flex items-center text-gray-400">
                  <Globe className="h-5 w-5 mr-2" />
                  www.lokalisp.com
                </li>
                <li className="flex items-center text-gray-400">
                  <Clock className="h-5 w-5 mr-2" />
                  Senin - Minggu, 24 Jam
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 LokalISP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  speed,
  price,
  description,
  features,
  highlighted = false,
}: {
  name: string;
  speed: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 ${
        highlighted
          ? 'border-4 border-primary-600 transform scale-105 relative'
          : 'border-2 border-gray-200'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            Paling Populer
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-center justify-center mb-2">
          <Wifi className="h-5 w-5 text-primary-600 mr-2" />
          <span className="text-3xl font-bold text-primary-600">{speed}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="mb-6 text-center">
        <span className="text-5xl font-bold text-gray-900">Rp {price}</span>
        <span className="text-gray-600">/bulan</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
          highlighted
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        Pilih Paket
      </a>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
      <span className="text-gray-700">{children}</span>
    </li>
  );
}
