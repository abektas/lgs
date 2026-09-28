import React from 'react';
import {
  FolderOpen,
  FileText,
  Download,
  ExternalLink,
  BookMarked,
  Sparkles,
  Award,
  CheckCircle,
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const categories = [
    {
      title: 'MEB Ölçme ve Değerlendirme LGS Örnek Soruları',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      items: [
        { name: '8. Sınıf Sayısal Bölüm Örnek Soru Kitapçığı (Ekim & Kasım)', pages: '48 Sayfa', type: 'PDF' },
        { name: '8. Sınıf Sözel Bölüm Örnek Soru Kitapçığı', pages: '36 Sayfa', type: 'PDF' },
        { name: 'LGS Çıkmış Sorular & Detaylı Cevap Anahtarları (Son 5 Yıl)', pages: '120 Sayfa', type: 'PDF' },
      ],
    },
    {
      title: 'LGS Altın Formül ve Kavram Haritaları',
      icon: BookMarked,
      color: 'text-amber-600 bg-amber-50',
      items: [
        { name: 'Matematik Yeni Nesil Formül & Geometri Özet Kartları', pages: '12 Kart', type: 'Kart' },
        { name: 'Fen Bilimleri Deney & Grafik Yorumlama Rehberi', pages: '16 Sayfa', type: 'PDF' },
        { name: 'Türkçe Fiilimsiler & Cümlenin Ögeleri Şematik Tablo', pages: '8 Sayfa', type: 'Şema' },
      ],
    },
    {
      title: 'Koç Bilge Sınav Taktikleri El Kitapçığı',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50',
      items: [
        { name: 'Turlama Tekniği & Zaman Yönetimi Stratejisi', pages: '10 Sayfa', type: 'Rehber' },
        { name: '3 Yanlış 1 Doğruyu Götürür: Risk ve Eleme Hesaplayıcı', pages: '6 Sayfa', type: 'Rehber' },
        { name: 'Sınav Kaygısı ve Odaklanma Egzersizleri', pages: '14 Sayfa', type: 'Sesli & PDF' },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
            <FolderOpen className="w-3.5 h-3.5" />
            MEB & Koç Bilge Kütüphanesi
          </div>
          <h2 className="text-2xl font-black text-slate-800">LGS Kaynak Merkezi</h2>
          <p className="text-xs text-slate-500 font-medium">
            Milli Eğitim Bakanlığı örnek soruları, formül kartları ve sınav hazırlık dokümanları.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center font-bold shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 leading-snug">{cat.title}</h3>
                </div>

                <div className="space-y-3 mt-4">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{item.pages} • {item.type}</span>
                      </div>
                      <button
                        onClick={() => alert(`"${item.name}" kaynağı görüntüleme simülasyonu başlatıldı.`)}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer shrink-0"
                        title="İndir / Aç"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">%100 Ücretsiz</span>
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  <span>MEB Uyumlu</span>
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
