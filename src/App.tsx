/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Hls from "hls.js";
import { 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  Radio, 
  Music, 
  TrendingUp, 
  ListMusic,
  Share2,
  Info,
  Maximize2,
  Minimize2,
  RotateCcw
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Station {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  state: string;
  language: string;
  votes: number;
  clickcount: number;
  codec: string;
  bitrate: number;
}

const CATEGORIES = [
  "Hepsi",
  "Pop",
  "Slow",
  "Arabesk",
  "Haber",
  "Rock",
  "Dini",
  "Spor",
  "Jazz",
  "Klasik",
  "Halk Müziği",
  "Sanat Müziği"
];

export default function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<{ title: string; artist: string }>({ title: "", artist: "" });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("radyotr_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // Safe play function to handle AbortError and other DOMExceptions
  const safePlay = async () => {
    if (!audioRef.current) return;
    try {
      // If there's a pending play promise, wait for it or just try to play
      playPromiseRef.current = audioRef.current.play();
      await playPromiseRef.current;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // AbortError is expected when we switch stations quickly, ignore it
        return;
      }
      console.error("Playback error:", error);
      setIsPlaying(false);
    }
  };

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch("/api/stations");
        if (!res.ok) throw new Error("İstasyonlar yüklenemedi");
        const data = await res.json();
        setStations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("radyotr_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Audio volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Combined Audio Setup & Control Hook
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setupAudio = async () => {
      if (!currentStation) {
        audio.pause();
        audio.src = "";
        setNowPlaying({ title: "", artist: "" });
        return;
      }

      let url = currentStation.url_resolved;
      
      // Use proxy for http streams to bypass mixed content and CORS
      if (url.startsWith("http://")) {
        url = `/api/proxy-stream?url=${encodeURIComponent(url)}`;
      }

      setNowPlaying({ title: "Yükleniyor...", artist: "" });

      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (url.includes(".m3u8") && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(audio);
        hlsRef.current = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlaying) safePlay();
        });
      } else {
        // Stop current before changing src to prevent some abort errors
        audio.pause();
        audio.src = url;
        audio.load(); // Forces reload for some streams
        if (isPlaying) {
          safePlay();
        }
      }
    };

    setupAudio();
  }, [currentStation]);

  // Handle play/pause toggle separately to avoid reloading the source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    if (isPlaying) {
      // If we already have a src but are paused, just play
      if (audio.paused || audio.readyState === 0) {
        safePlay();
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Poll for metadata
  useEffect(() => {
    let intervalId: number;

    const fetchMetadata = async () => {
      if (!currentStation || !isPlaying) return;
      try {
        const res = await fetch(`/api/metadata?url=${encodeURIComponent(currentStation.url_resolved)}`);
        if (res.ok) {
          const data = await res.json();
          setNowPlaying(data);
        }
      } catch (err) {
        console.error("Metadata fetch error:", err);
      }
    };

    if (currentStation && isPlaying) {
      fetchMetadata();
      intervalId = window.setInterval(fetchMetadata, 30000); // 30s
    }

    return () => clearInterval(intervalId);
  }, [currentStation, isPlaying]);

  const togglePlay = () => {
    if (!currentStation) return;
    setIsPlaying(!isPlaying);
  };

  const playStation = (station: Station) => {
    if (currentStation?.stationuuid === station.stationuuid) {
      togglePlay();
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.tags.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Hepsi" || 
                              s.tags.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [stations, searchQuery, selectedCategory]);

  const featuredStation = stations[0];

  return (
    <div className="min-h-screen bg-[#070707] text-[#E4E4E4] font-sans selection:bg-orange-500 selection:text-white pb-32">
      <audio 
        ref={audioRef} 
        onPlay={() => setIsPlaying(true)} 
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#070707]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Radio className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Radyo<span className="text-orange-500">TR</span></h1>
          </div>

          <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text"
              placeholder="Radyo, tür veya şehir ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
            />
          </div>

          <div className="hidden md:flex items-center gap-4">
             <button className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white">
                <Heart className={cn("w-6 h-6", favorites.length > 0 && "fill-orange-500 text-orange-500")} />
             </button>
             <button className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-black/20">
                Giriş Yap
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Categories */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all border",
                selectedCategory === cat 
                  ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" 
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/40 font-medium text-lg">Radyolar Hazırlanıyor...</p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
             <Info className="w-16 h-16 text-red-500 mx-auto mb-4" />
             <h2 className="text-2xl font-bold mb-2">Eyvah! Bir Sorun Oldu</h2>
             <p className="text-white/40 mb-6">{error}</p>
             <button onClick={() => window.location.reload()} className="bg-white/10 px-8 py-3 rounded-full hover:bg-white/20 transition-all font-semibold">
                Tekrar Dene
             </button>
          </div>
        ) : (
          <>
            {/* Hero / Featured Section (Only when no search/category) */}
            {selectedCategory === "Hepsi" && searchQuery === "" && featuredStation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-[400px] rounded-3xl overflow-hidden mb-12 group shadow-2xl"
              >
                <img 
                  src={featuredStation.favicon || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=2000"} 
                  alt="Featured" 
                  className="absolute inset-0 w-full h-full object-cover blur-sm brightness-[0.4] scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent"></div>
                <div className="relative h-full flex flex-col justify-end p-12 ">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-orange-600/40">Günün Radyosu</span>
                    <span className="flex items-center gap-1 text-white/60 text-sm"><TrendingUp className="w-4 h-4" /> En Çok Dinlenen</span>
                  </div>
                  <h2 className="text-6xl font-black mb-4 tracking-tighter leading-tight max-w-2xl">{featuredStation.name}</h2>
                  <p className="text-lg text-white/60 mb-8 max-w-xl line-clamp-2">{featuredStation.tags || "Türkiye'nin en sevilen radyo istasyonlarından biri."}</p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => playStation(featuredStation)}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-600/30"
                    >
                      {currentStation?.stationuuid === featuredStation.stationuuid && isPlaying ? <Pause className="fill-current w-7 h-7" /> : <Play className="fill-current w-7 h-7" />}
                      Şimdi Dinle
                    </button>
                    <button 
                      onClick={() => toggleFavorite(featuredStation.stationuuid)}
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-5 rounded-2xl transition-all border border-white/10"
                    >
                      <Heart className={cn("w-7 h-7", favorites.includes(featuredStation.stationuuid) && "fill-orange-500 text-orange-500")} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sub-header */}
            <div className="flex items-center justify-between mb-8 overflow-hidden">
               <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-bold tracking-tight">
                    {searchQuery ? "Arama Sonuçları" : selectedCategory === "Hepsi" ? "Keşfet" : selectedCategory}
                  </h3>
                  <span className="text-white/30 font-medium">{filteredStations.length} Radyo</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-white/40">
                  <RotateCcw className="w-4 h-4" />
                  İstasyonlar Her Gün Güncellenir
               </div>
            </div>

            {/* Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredStations.map((station, index) => (
                  <motion.div
                    key={station.stationuuid}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 < 1 ? index * 0.05 : 0 }}
                    className="group bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer relative flex flex-col gap-4 shadow-xl"
                    onClick={() => playStation(station)}
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg shadow-black/40">
                      <img 
                        src={station.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(station.name)}&background=222&color=fff&size=512`} 
                        alt={station.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                          {currentStation?.stationuuid === station.stationuuid && isPlaying ? <Pause className="fill-white text-white w-7 h-7" /> : <Play className="fill-white text-white w-7 h-7 ml-1" />}
                        </div>
                      </div>
                      {currentStation?.stationuuid === station.stationuuid && isPlaying && (
                         <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-6">
                            {[1,2,3,4].map(i => (
                               <motion.div 
                                 key={i}
                                 animate={{ height: ["40%", "100%", "60%", "90%", "40%"] }}
                                 transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                 className="w-1 bg-white rounded-full"
                               />
                            ))}
                         </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-lg truncate flex-1">{station.name}</h4>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(station.stationuuid);
                          }}
                          className="hover:scale-110 transition-transform"
                        >
                          <Heart className={cn("w-5 h-5", favorites.includes(station.stationuuid) ? "fill-orange-500 text-orange-500" : "text-white/20")} />
                        </button>
                      </div>
                      <p className="text-white/40 text-sm truncate">{station.tags || station.language}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">{station.bitrate} kbps</span>
                       <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">{station.codec}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredStations.length === 0 && (
               <div className="text-center py-32">
                  <p className="text-white/20 text-xl font-medium">Aradığın radyoyu bulamadık...</p>
               </div>
            )}
          </>
        )}
      </main>

      {/* Floating Mini Player */}
      <AnimatePresence>
        {currentStation && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-0"
          >
            <div className="max-w-7xl mx-auto bg-[#1A1A1A]/95 backdrop-blur-2xl border border-white/10 h-24 rounded-3xl flex items-center px-6 gap-8 shadow-2xl shadow-black">
              {/* Info */}
              <div className="flex items-center gap-4 min-w-[240px] max-w-sm">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shrink-0 group relative">
                   <img 
                    src={currentStation.favicon || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStation.name)}`} 
                    alt={currentStation.name} 
                    className="w-full h-full object-cover"
                   />
                   {isPlaying && (
                     <div className="absolute inset-0 bg-orange-600/40 flex items-center justify-center">
                        <Radio className="w-6 h-6 text-white animate-pulse" />
                     </div>
                   )}
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold truncate text-lg">{currentStation.name}</h5>
                  <p className="text-white/40 text-sm truncate flex items-center gap-2">
                    {nowPlaying.title && nowPlaying.title !== "Canlı Yayın" && nowPlaying.title !== "Yükleniyor..." ? (
                      <span className="text-orange-500 font-medium animate-in fade-in slide-in-from-bottom-1 duration-500">
                        {nowPlaying.title}
                      </span>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Canlı Yayında
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="flex items-center gap-8">
                  <button className="text-white/40 hover:text-white transition-colors">
                    <ListMusic className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                  >
                    {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 ml-1" />}
                  </button>
                  <button className="text-white/40 hover:text-white transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Volume & Actions */}
              <div className="flex items-center gap-6 min-w-[240px] justify-end">
                <div className="flex items-center gap-3 group">
                   <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-orange-500 transition-colors">
                      {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                   </button>
                   <div className="w-24 h-1.5 bg-white/10 rounded-full relative overflow-hidden flex items-center">
                      <div 
                        className="absolute h-full bg-orange-600 rounded-full transition-all"
                        style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                      ></div>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => {
                          setVolume(parseFloat(e.target.value));
                          setIsMuted(false);
                        }}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      />
                   </div>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <button 
                  onClick={() => toggleFavorite(currentStation.stationuuid)}
                  className="text-white/60 hover:text-orange-500 transition-colors"
                >
                   <Heart className={cn("w-6 h-6", favorites.includes(currentStation.stationuuid) && "fill-orange-500 text-orange-500")} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
