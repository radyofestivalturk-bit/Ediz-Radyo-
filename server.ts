import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const CUSTOM_STATIONS = [
  {
    stationuuid: "custom-sahil-guvenlik",
    name: "Radyo Sahil Güvenlik",
    url: "http://radyo.sg.gov.tr:9097/stream",
    url_resolved: "http://radyo.sg.gov.tr:9097/stream",
    favicon: "https://www.sg.gov.tr/kurumlar/sg.gov.tr/Logolar/SG_LOGO_YENI.png",
    tags: "Haber, Kamu",
    votes: 1000,
    clickcount: 5000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radio-port",
    name: "Radio Port",
    url: "https://yayin.turkhosted.com/radioport",
    url_resolved: "https://yayin.turkhosted.com/radioport",
    favicon: "",
    tags: "Pop, Karma",
    votes: 950,
    clickcount: 4500,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-fenomen-turk",
    name: "Radyo Fenomen Türk",
    url: "https://live.radyofenomen.com/fenomenturk/abr/playlist.m3u8",
    url_resolved: "https://live.radyofenomen.com/fenomenturk/abr/playlist.m3u8",
    favicon: "https://www.radyofenomen.com/template/fenomen/img/fenomen-turk-logo.png",
    tags: "Pop, Türkçe",
    votes: 2000,
    clickcount: 15000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-powerturk",
    name: "Power Türk",
    url: "https://live.powerapp.com.tr/powerturk/abr/playlist.m3u8",
    url_resolved: "https://live.powerapp.com.tr/powerturk/abr/playlist.m3u8",
    favicon: "https://static.powerapp.com.tr/images/powerturk-logo.png",
    tags: "Pop, Türkçe",
    votes: 3000,
    clickcount: 25000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-kordelya",
    name: "Radyo Kordelya",
    url: "https://radyo.medyahost.com.tr/8048/stream",
    url_resolved: "https://radyo.medyahost.com.tr/8048/stream",
    favicon: "",
    tags: "Karma, Yerel",
    votes: 800,
    clickcount: 3000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-ediz-turk",
    name: "Ediz Türk",
    url: "https://listen.radioking.com/radio/778286/stream/845822",
    url_resolved: "https://listen.radioking.com/radio/778286/stream/845822",
    favicon: "",
    tags: "Pop, Türkçe",
    votes: 1200,
    clickcount: 6000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-kordon-fm",
    name: "Kordon FM",
    url: "https://radyo.medyahost.com.tr/8050/stream",
    url_resolved: "https://radyo.medyahost.com.tr/8050/stream",
    favicon: "",
    tags: "Ege, Pop",
    votes: 900,
    clickcount: 4000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-powerpop",
    name: "Power Pop",
    url: "https://live.powerapp.com.tr/powerpop/abr/playlist.m3u8",
    url_resolved: "https://live.powerapp.com.tr/powerpop/abr/playlist.m3u8",
    favicon: "https://static.powerapp.com.tr/images/powerpop-logo.png",
    tags: "Pop, 90lar",
    votes: 1500,
    clickcount: 10000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-powerfm",
    name: "Power FM",
    url: "https://live.powerapp.com.tr/powerfmadver/abr/playlist.m3u8",
    url_resolved: "https://live.powerapp.com.tr/powerfmadver/abr/playlist.m3u8",
    favicon: "https://static.powerapp.com.tr/images/powerfm-logo.png",
    tags: "Pop, Yabancı",
    votes: 2500,
    clickcount: 20000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-fenomen",
    name: "Radyo Fenomen",
    url: "https://live.radyofenomen.com/fenomen/abr/playlist.m3u8",
    url_resolved: "https://live.radyofenomen.com/fenomen/abr/playlist.m3u8",
    favicon: "https://www.radyofenomen.com/template/fenomen/img/fenomen-logo.png",
    tags: "Pop, Hit",
    votes: 2200,
    clickcount: 18000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-mega",
    name: "Radyo Mega",
    url: "https://radyo.yayin.com.tr:4052/;",
    url_resolved: "https://radyo.yayin.com.tr:4052/;",
    favicon: "",
    tags: "Pop, Türkçe",
    votes: 1100,
    clickcount: 7000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-istanbul-fm",
    name: "İstanbul FM",
    url: "https://yayin.istanbulfm.com.tr/istanbulfm/playlist.m3u8",
    url_resolved: "https://yayin.istanbulfm.com.tr/istanbulfm/playlist.m3u8",
    favicon: "https://www.istanbulfm.com.tr/img/logo.png",
    tags: "Pop, İstanbul",
    votes: 1800,
    clickcount: 12000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-boombox",
    name: "Radyo Boombox",
    url: "https://yayin.radyoboombox.com.tr/boombox/playlist.m3u8",
    url_resolved: "https://yayin.radyoboombox.com.tr/boombox/playlist.m3u8",
    favicon: "https://www.radyoboombox.com.tr/img/logo.png",
    tags: "Pop, Hit, Karma",
    votes: 1600,
    clickcount: 11000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-boombox-xtra",
    name: "Boombox Xtra",
    url: "https://yayin.radyoboombox.com.tr/boomboxxtra/playlist.m3u8",
    url_resolved: "https://yayin.radyoboombox.com.tr/boomboxxtra/playlist.m3u8",
    favicon: "https://www.radyoboombox.com.tr/img/logo.png",
    tags: "Pop, Hit",
    votes: 1400,
    clickcount: 9000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-kral-pop",
    name: "Kral Pop",
    url: "https://dygedge.radyotvonline.net/kralpop/playlist.m3u8",
    url_resolved: "https://dygedge.radyotvonline.net/kralpop/playlist.m3u8",
    favicon: "https://vstatic.kralmuzik.com.tr/img/kralpop-logo.png",
    tags: "Pop, Hit",
    votes: 5000,
    clickcount: 40000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-ege-fm-izmir",
    name: "Ege FM İzmir",
    url: "http://sunucu.radyodinle.com:2024/stream",
    url_resolved: "http://sunucu.radyodinle.com:2024/stream",
    favicon: "",
    tags: "İzmir, Karma",
    votes: 850,
    clickcount: 3500,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-ege",
    name: "Radyo Ege",
    url: "https://istek.ozelip.com/radyoege/;",
    url_resolved: "https://istek.ozelip.com/radyoege/;",
    favicon: "",
    tags: "Ege, Pop",
    votes: 750,
    clickcount: 3200,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-ege-kampus",
    name: "Radyo Ege Kampüs",
    url: "https://stream.ege.edu.tr/hls/rek.m3u8",
    url_resolved: "https://stream.ege.edu.tr/hls/rek.m3u8",
    favicon: "",
    tags: "Üniversite, Karma",
    votes: 650,
    clickcount: 2800,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-hey-radyo",
    name: "Hey Radyo",
    url: "https://usa5.fastcast4u.com/proxy/radyoizmirfm00?mp=/mp3stream128",
    url_resolved: "https://usa5.fastcast4u.com/proxy/radyoizmirfm00?mp=/mp3stream128",
    favicon: "",
    tags: "İzmir, Pop",
    votes: 820,
    clickcount: 3100,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-pause",
    name: "Radyo Pause",
    url: "https://radyopause.ozelip.com.tr:8040/;",
    url_resolved: "https://radyopause.ozelip.com.tr:8040/;",
    favicon: "",
    tags: "İzmir, Pop",
    votes: 780,
    clickcount: 2900,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-mydonose-turk",
    name: "Mydonose Türk",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/MYDONOSE_TURK128AAC.aac",
    url_resolved: "https://playerservices.streamtheworld.com/api/livestream-redirect/MYDONOSE_TURK128AAC.aac",
    favicon: "",
    tags: "Pop, Türkçe",
    votes: 1900,
    clickcount: 14000,
    codec: "AAC",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-mydonose",
    name: "Radyo Mydonose",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_MYDONOSE128AAC.aac",
    url_resolved: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_MYDONOSE128AAC.aac",
    favicon: "",
    tags: "Pop, Yabancı",
    votes: 2100,
    clickcount: 16000,
    codec: "AAC",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-mars",
    name: "Radyo Mars",
    url: "https://yayin.radyomadyo.com:9400/stream",
    url_resolved: "https://yayin.radyomadyo.com:9400/stream",
    favicon: "",
    tags: "İzmir, Kampüs",
    votes: 720,
    clickcount: 2600,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-bilim",
    name: "Radyo Bilim",
    url: "https://yayin.radyomadyo.com:8750/stream",
    url_resolved: "https://yayin.radyomadyo.com:8750/stream",
    favicon: "",
    tags: "Bilim, Kültür",
    votes: 680,
    clickcount: 2400,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-x-radio",
    name: "X Radio",
    url: "https://stream.xradio.com.tr:8770/stream",
    url_resolved: "https://stream.xradio.com.tr:8770/stream",
    favicon: "",
    tags: "Pop, Karma",
    votes: 950,
    clickcount: 4200,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-45lik",
    name: "Radyo 45’lik",
    url: "https://stream.radyo45lik.com:4545/",
    url_resolved: "https://stream.radyo45lik.com:4545/",
    favicon: "",
    tags: "45lik, Nostalji",
    votes: 2200,
    clickcount: 18000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-kalp-fm",
    name: "Kalp FM",
    url: "https://yayin.kalpfm.com:8080/",
    url_resolved: "https://yayin.kalpfm.com:8080/",
    favicon: "",
    tags: "Pop, Karma",
    votes: 1100,
    clickcount: 5500,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-cagri",
    name: "Radyo Çağrı İzmir",
    url: "https://radyo.wlsrv.com:8604/stream",
    url_resolved: "https://radyo.wlsrv.com:8604/stream",
    favicon: "",
    tags: "İzmir, Karma",
    votes: 740,
    clickcount: 2700,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-sahil",
    name: "Radyo Sahil",
    url: "https://radyo1.radyo-dinle.tc/8056/stream:/stream",
    url_resolved: "https://radyo1.radyo-dinle.tc/8056/stream:/stream",
    favicon: "",
    tags: "Pop, Karma",
    votes: 1300,
    clickcount: 8000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-metro-fm",
    name: "Metro FM",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/METRO_FM_ITUNES.mp3",
    url_resolved: "https://playerservices.streamtheworld.com/api/livestream-redirect/METRO_FM_ITUNES.mp3",
    favicon: "https://vstatic.kralmuzik.com.tr/img/metrofm-logo.png",
    tags: "Pop, Foreign, Hit",
    votes: 4500,
    clickcount: 35000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-fg",
    name: "Radyo FG",
    url: "https://edge1.radyotvonline.net/shoutcast/play/fg",
    url_resolved: "https://edge1.radyotvonline.net/shoutcast/play/fg",
    favicon: "",
    tags: "Electronic, Dance",
    votes: 3200,
    clickcount: 22000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-baba-radyo",
    name: "Baba Radyo",
    url: "https://wowza1.radyotvonline.com/best/babaradyo.stream/playlist.m3u8",
    url_resolved: "https://wowza1.radyotvonline.com/best/babaradyo.stream/playlist.m3u8",
    favicon: "https://static.powerapp.com.tr/images/babaradyo-logo.png",
    tags: "Arabesque, Fantazi",
    votes: 2800,
    clickcount: 19000,
    codec: "HLS",
    bitrate: 128
  },
  {
    stationuuid: "custom-polis-radyosu",
    name: "Türkiye Polis Radyosu",
    url: "https://m.egm.gov.tr:8093//;?type=http&nocache=1",
    url_resolved: "https://m.egm.gov.tr:8093//;?type=http&nocache=1",
    favicon: "https://www.egm.gov.tr/kurumlar/egm.gov.tr/polisradyosu/POLISRADYOSU_LOGO.png",
    tags: "Haber, Karma",
    votes: 2100,
    clickcount: 15000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-polis-radyosu-tsm",
    name: "Polis Radyosu Türk Sanat Müziği",
    url: "https://m.egm.gov.tr:8095/stream",
    url_resolved: "https://m.egm.gov.tr:8095/stream",
    favicon: "https://www.egm.gov.tr/kurumlar/egm.gov.tr/polisradyosu/POLISRADYOSU_LOGO.png",
    tags: "TSM, Klasik",
    votes: 1800,
    clickcount: 12000,
    codec: "MP3",
    bitrate: 128
  },
  {
    stationuuid: "custom-radyo-turkuvaz",
    name: "Radyo Turkuvaz",
    url: "https://trkvz-radyolar.ercdn.net/radyoturkuvaz/playlist.m3u8",
    url_resolved: "https://trkvz-radyolar.ercdn.net/radyoturkuvaz/playlist.m3u8",
    favicon: "https://static.powerapp.com.tr/images/turkuvaz-logo.png",
    tags: "Pop, Türkçe",
    votes: 2400,
    clickcount: 17000,
    codec: "HLS",
    bitrate: 128
  }
];

// Proxy for Radio Browser API to avoid CORS issues and provide a stable endpoint
  app.get("/api/stations", async (req, res) => {
    try {
      // Using de1.api.radio-browser.info as it's generally more stable than at1
      const response = await fetch(
        "https://de1.api.radio-browser.info/json/stations/bycountry/Turkey?limit=400&order=clickcount&reverse=true"
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      res.json([...CUSTOM_STATIONS, ...data]);
    } catch (error) {
      console.error("Error fetching stations:", error);
      // Fallback mirror if de1 fails
      try {
        const mirrors = ["nl1", "all"];
        for (const mirror of mirrors) {
          try {
            const fallback = await fetch(
              `https://${mirror}.api.radio-browser.info/json/stations/bycountry/Turkey?limit=400&order=clickcount&reverse=true`,
              { signal: AbortSignal.timeout(5000) }
            );
            if (fallback.ok) {
              const data = await fallback.json();
              return res.json([...CUSTOM_STATIONS, ...data]);
            }
          } catch (mirrorErr) {
            console.error(`Mirror ${mirror} failed:`, mirrorErr);
          }
        }
        res.json(CUSTOM_STATIONS); // At least return custom ones if API fails
      } catch (fallbackError) {
        console.error("Fallback logic failed:", fallbackError);
        res.json(CUSTOM_STATIONS);
      }
    }
  });

  // Fetch real-time metadata (ICY headers)
  app.get("/api/metadata", async (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) return res.status(400).json({ error: "URL is required" });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(streamUrl, {
        headers: { "Icy-MetaData": "1" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const metaInt = response.headers.get("icy-metaint");
      const stationName = response.headers.get("icy-name");

      if (!metaInt) {
        return res.json({ title: stationName || "Canlı Yayın", artist: "" });
      }

      // If we have metaint, we need to read the stream to find the metadata block
      // To keep it simple and non-blocking, we'll try to read only the first chunk
      const reader = response.body?.getReader();
      if (!reader) return res.json({ title: stationName || "Canlı Yayın", artist: "" });

      const interval = parseInt(metaInt);
      let bytesRead = 0;
      let metadata = "";

      // We read until we find the metadata block
      while (bytesRead < interval + 4096) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = value as Uint8Array;
        const remainingToMeta = interval - (bytesRead % (interval + 1)); // This logic is simplified
        
        // This is a complex bit-stream parsing. For a robust solution, we'd use a dedicated library.
        // However, many stations also send 'icy-br', 'icy-description', 'icy-genre' etc.
        // For 'Now Playing', it's inside the stream.
        
        // Let's try to see if any headers give us a hint first (some do 'x-audiocast-song')
        const songHint = response.headers.get("x-audiocast-song") || response.headers.get("icy-description");
        if (songHint) {
          reader.cancel();
          return res.json({ title: songHint, artist: "" });
        }

        bytesRead += chunk.length;
        if (bytesRead > interval) {
          // Found roughly where metadata should be
          // Extracting from stream is heavy for this simple server-side endpoint
          // Let's just return headers for now as a fallback or if specifically provided
          break;
        }
      }
      
      reader.cancel();
      res.json({ title: stationName || "Canlı Yayın", artist: "" });

    } catch (error) {
      res.status(500).json({ title: "Bilinmiyor", artist: "" });
    }
  });

  // Stream proxy to bypass Mixed Content (HTTP on HTTPS) and CORS issues
  app.get("/api/proxy-stream", async (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) return res.status(400).send("URL is required");

    try {
      const response = await fetch(streamUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stream: ${response.statusText}`);
      }

      // Copy relevant headers
      const contentType = response.headers.get("content-type");
      if (contentType) res.setHeader("Content-Type", contentType);
      
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Pipe the stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      // Handle client disconnect
      req.on("close", () => {
        reader.cancel();
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (error) {
      console.error("Stream proxy error:", error);
      if (!res.headersSent) {
        res.status(500).send("Stream error");
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
