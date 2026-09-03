export type PlaylistId = "telugu" | "hindi" | "sixties";

export type Song = {
  /** Globally unique, stable id: `${playlistId}-${nnn}` */
  id: string;
  playlistId: PlaylistId;
  language: "telugu" | "hindi";
  title: string;
  artist: string;
  duration: string;
  seconds: number;
  hue: number;
  youtubeVideoId: string;
  thumbnail: string;
};

export type Playlist = {
  id: PlaylistId;
  /** kept for existing components */
  key: PlaylistId;
  label: string;
  language: "telugu" | "hindi";
  title: string;
  accentLine: string;
  tagline: string;
  url: string;
  listId: string;
  songs: Song[];
};

/** [youtubeVideoId, title, artist/movie, duration] */
type Raw = [string, string, string, string];

function thumbFor(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

function build(playlistId: PlaylistId, language: "telugu" | "hindi", raw: Raw[]): Song[] {
  return raw.map(([youtubeVideoId, title, artist, duration], i) => {
    const parts = duration.split(":").map(Number);
    const m = parts[0] ?? 0;
    const s = parts[1] ?? 0;
    return {
      id: `${playlistId}-${String(i + 1).padStart(3, "0")}`,
      playlistId,
      language,
      title,
      artist,
      duration,
      seconds: m * 60 + s,
      hue: (i * 47 + 18) % 360,
      youtubeVideoId,
      thumbnail: thumbFor(youtubeVideoId),
    };
  });
}

const teluguRaw: Raw[] = [
  ["gB_dBDdKRBc", "Nee Choopule", "Endukante Premanta", "4:15"],
  ["BpINyS4k7Uw", "Priyathama Priyathama", "MAJILI", "4:51"],
  ["7Yru3_H5dQo", "Nuvvante Na Navvu", "Krishnagadi Veera Prema Gaadha", "4:38"],
  ["-6uqH-0TiDk", "Kallu Moosi Yoschisthey", "Suriya", "5:19"],
  ["DDb7OILQMMA", "Em Sandeham Ledu", "Vel Records", "3:50"],
  ["toTRkovRzvo", "Yemito ivala rekkalochinattu", "Andala rakshasi", "4:27"],
  ["KZy8um0iY9s", "Inthalo Ennenni Vinthalo", "Volga Video", "6:21"],
  ["2a34XyiZO14", "The Life Of Ram", "#Jaanu", "6:27"],
  ["BCwsSk_KKrE", "Konte Chuputho", "Ananthapuram 1980", "5:39"],
  ["Zan1Wd0vPL0", "Gusa Gusa Lade", "Gentleman", "4:17"],
  ["rC0YWZ0lly8", "Darling", "Prabhas", "4:05"],
  ["riUBONxLABg", "Egirey Mabbulona", "Geetha Arts ", "4:23"],
  ["ZwGPx75hVLk", "Mari Antaga", "SVSC", "4:02"],
  ["8FOG4vhc8q8", "Nijame Ne", "Ooru Peru Bhairavakona", "3:43"],
  ["e4N9al7vhVQ", "Oosupodu", "Fidaa", "5:46"],
  ["S74cV_L5u54", "Chinni Chinni Asalu", "Manam", "3:51"],
  ["A56mZxSXKn8", "I Wanna Fly", "Krishnarjuna Yudham", "4:40"],
  ["Zo5kxK4j2qY", "Mandaara", "Bhaagamathie", "4:46"],
  ["ltLTwjjTehg", "Varinche Prema : Malli Malli Idi Rani Roju", "Star Maa Music", "4:04"],
  ["zNVR5xrUanU", "Ye Kannulu Choodani", "Ardhashathabdam", "4:52"],
  ["rNn0UYQqxCg", "Kannula Baasalu Theliyavule", "7/G Brindavan Colony", "5:39"],
  ["ekAYewieHKA", "Mr Perfect", "Telugu", "5:02"],
  ["rcWYtPjnDMw", "Nava Manmadhudu", "Anirudh", "3:31"],
  ["eCoyD4at3aU", "Kannullo Unnavu", "Vijay POLICEODU", "4:58"],
  ["hCt-H4-5wco", "Awaara", "Yuvanshankar", "4:33"],
];

const hindiRaw: Raw[] = [
  ["HeBJMzrM7hU", "Nadaaniyan Akshath", "Aisha Ahmed", "2:50"],
  ["n2dVFdqMYGA", "Sahiba : Aditya Rikhari, Ankita Chhetri", "T-Series", "3:04"],
  ["RLzC55ai0eo", "Heeriye Jasleen Royal ft Arijit Singh", "Dulquer Salmaan", "3:19"],
  ["B7SkAq_94J8", "Pehla Pyaar", "Kabir Singh", "4:33"],
  ["Kn9FJsNOaUU", "YODHA: Zindagi Tere Naam", "Sidharth Malhotra, Raashii Khanna", "3:16"],
  ["-rmGyJnTKXw", "Arijit Singh", "Munjya", "2:39"],
  ["k3g_WjLCsXM", "Sajni : Arijit Singh, Ram Sampath", "Laapataa Ladies", "2:26"],
  ["VuG7ge_8I2Y", "Maan Meri Jaan", "King", "4:19"],
  ["BBAyRBTfsOU", "Vaaste : Dhvani Bhanushali, Tanishk Bagchi", "Nikhil D'Souza", "4:27"],
  ["uKHlnmepnNA", "Nayan", "Dhvani B Jubin N", "5:59"],
  ["orYf6VDtj_k", "Raataan Lambiyan", "Shershaah", "3:54"],
  ["OBgOwAf-oVI", "Qaafirana", "Kedarnath", "6:16"],
  ["8SYPKQMW_2Q", "Tum Ho Toh", "Tum Ho Toh", "5:17"],
  ["6mr4cYJ7yew", "Kesariya", "Brahmāstra", "4:22"],
  ["GVizJ_jpUnw", "Gehra Hua", "Saregama Music", "6:04"],
  ["NW6Dgax2d6I", "Sahiba Jasleen Royal", "Vijay Deverakonda Radhikka Madan", "4:20"],
  ["V7LwfY5U5WI", "Ranjha", "Shershaah", "3:14"],
  ["3Cp2QTBZAFQ", "Finding Her : Kushagra", "Vanshika", "3:33"],
  ["a3Ue-LN5B9U", "@SaiAbhyankkar", "Thejo Bharathwaj", "3:49"],
  ["rC-kbRanJQ0", "UDI UDI", "@Aneesh.Poojari &‪ @sarkarmusic.25", "2:36"],
  ["kyjg5kX4pT0", "Dil Tu Jaan Tu Gurnazar Ft. Kritika Yadav", "New Punjabi Viral", "3:18"],
  ["3EVCqRLf2Vo", "Pardesiya Sidharth M, Janhvi K", "Param Sundari", "3:55"],
  ["gRRMSF0nB0c", "Jugraafiya", "Super 30", "3:06"],
  ["uNboFgKLGDY", "KAUN TUJHE", "Armaan Malik", "3:39"],
  ["9pIXNy-pS10", "KHAIRIYAT", "Sushant Singh Rajput,Shraddha Kapoor", "3:46"],
  ["lgTHGZF3BQw", "Pal Pal Dil Ke Paas", "Arijit Singh", "4:07"],
];

const sixtiesRaw: Raw[] = [
  ["ySCiauQuMq8", "Bhale Chance Le", "Illarikam", "3:43"],
  ["ccPe_aRw4UQ", "Niluvave Vaalu Kanula Daana", "Illarikam", "3:29"],
  ["EXuDcLg2nS0", "Nedu Srivariki", "Illarikam", "3:24"],
  ["cDg4XEy9QH4", "Yekkadi Dongalu", "Mango Music", "3:43"],
  ["QppM5gDNT2o", "Adigindaaniki Cheppi", "Mango Music", "5:26"],
  ["codMCejvg7M", "Madhupathra Nimpavoyi", "Mango Music", "3:51"],
  ["rnuBF4vK7xQ", "Chethulu Kalasina", "Mango Music", "4:27"],
  ["02p-bsh6MDo", "Sumdari Nivanti Divya Svarupamu", "Maya Bazar", "3:05"],
  ["2N3GAphTgGg", "Ahana Pellianta", "Maya Bazar", "3:16"],
  ["9S8BJJYB79k", "Lahiri Lahiri Lo", "Maya Bazar", "5:33"],
  ["v3kcQQ618hQ", "Vinnava Yasodamma", "Maya Bazar", "4:10"],
  ["he1PGp-QIIo", "Lalli la la", "Maya Bazar", "4:40"],
  ["h1FtIL5Sx4Q", "Choopulu Kalasina", "Mayabazar", "3:02"],
  ["GTq_INBUNLg", "Neevena Nanu Thalachinadhi", "Mayabazar", "2:35"],
  ["G3x77dRLqeQ", "Dayacheyandi", "Maya Bazar", "4:48"],
  ["Rs7Bhg-BLGI", "Aaduthu paaduthu pani chesthunte", "Maharshi DVR", "4:00"],
  ["PsZttHfIVik", "Bhali Bhali Bhali Deva", "Maya Bazar", "3:42"],
  ["dZejdBmYC3k", "Maya Bazar", "Vivaha Bhojanambu", "3:05"],
  ["fRJ3rWHIdws", "Kalavaramaye", "Patala Bhairavi", "2:51"],
  ["_U6CLSsA5i4", "Yenthaghatu Premayo", "iDream Music", "3:44"],
  ["caFrXnFtB8c", "Vinave Bala", "Patala Bhairavi", "2:40"],
  ["r6Vfdb9HKls", "Vagalo Vagalu", "iDream Music", "3:52"],
  ["OOpO-tLmQ1E", "Prema Kosamai Valalo", "Patala Bhairavi", "2:47"],
  ["6VQ0YKOnTzE", "Theeyani Oohalu", "Patala Bhairavi", "2:41"],
  ["VxCQRagi_WI", "Pranaya Jeevulaku Haayiga", "Patala Bhairavi", "2:42"],
  ["62xVbFEy5Kg", "Ithihasam Vinnara", "iDream Music", "4:00"],
  ["ZlKqow3_5rM", "Brindaavanamadi Andaridi", "Missamma", "2:40"],
  ["AzeT6sqxShY", "Ravoyi Chandamama", "Missamma", "2:40"],
  ["9mZynPFM1Ug", "Avunante Kaadanile", "Missamma", "2:11"],
  ["eBLb4NFmgww", "Seetharam Seetharam", "Missamma", "1:35"],
  ["UjAKAK9fdqc", "Lechindi Nidra Lechindi", "Gundamma Katha", "3:04"],
  ["5IThD3n_6IQ", "Donga Ramudu", "Donga Ramudu", "2:54"],
  ["oW3TeEYGelk", "Kalasi Vunte Kaladu Sukham", "Kalasi Vunte Kaladu Sukham", "6:25"],
  ["CKE6f34ffVg", "Pagale Vennela", "Pooja Phalam", "3:09"],
  ["ARmYzdIdrmM", "Prema Yatralaku", "Gundamma Katha", "3:07"],
  ["uJONW7jcI2A", "Mangalya Balam", "Aakasha Veedhilo", "3:56"],
  ["4G4p4HyRsr4", "Neevuleka Veena", "Doctor Chakravarthy", "3:31"],
  ["OLMgrsjKCcs", "Sri Rama Nee", "Old Telugu Songs", "2:27"],
  ["KMDkYplvWEU", "Kushi Kushiga", "Old Telugu Songs", "3:29"],
  ["LHTbXZOoGsk", "Halo Halo O Ammayi", "Old Telugu Songs", "3:01"],
  ["v0HB2p-O8-M", "Chakkani Chukka", "Old Telugu Songs", "3:19"],
  ["vxCoViu8lyw", "Kula Gothralu Movie", "Mango Music", "3:45"],
  ["xW7VZcpNJXs", "Maava Maava", "Manchi Manasulu Telugu", "5:45"],
  ["PbhRxQEzQYg", "Nannu Vadili Neevu Polevule", "Manchi Manasulu", "4:50"],
  ["iCd39vlfqUY", "Appu Chesi Pappu Koodu", "Appu Chesi Pappu Koodu", "29:55"],
  ["PzaakhJyVYQ", "Kaseeki Poyanu Ramahari", "Appu Chesi Pappu Koodu", "3:01"],
  ["G3VrAMq51gM", "Moogavaina Emi", "Appu Chesi Pappu Koodu", "3:51"],
  ["mCZhuJwGQY4", "Appu Chesi Pappu Koodu", "Appu Chesi Pappu Koodu", "2:26"],
  ["3UGTcUOEGHw", "Vagala Raanivi Neeve", "Bandipotu", "3:24"],
  ["Id75E68mX-s", "Takkari Daana", "Volga Video", "3:42"],
  ["VH72kvy0y98", "Kallaakapatam", "iDream Music", "4:58"],
  ["XfX9IiSenas", "Dharmam Cheyi Babu", "Missamma", "2:23"],
  ["AByC6blUAUs", "Godari Gattundi Gattu Meeda", "Volga Video", "3:59"],
  ["0RKpRLs0kkE", "Evergreen", "Rose Telugu Movies", "3:36"],
  ["s6pDB0dPZy8", "Chuda Chakkani Chinnadi", "Balaraju Telugu", "1:08"],
  ["yxgM9WrB6Kk", "Devudayya Devudu", "Balaraju Telugu", "2:23"],
  ["7OIF0q2hvKs", "O Balaraja Jali Leda", "Balaraju Telugu", "2:45"],
  ["DeSE3choP1E", "Dheem Takita Dhimi", "Guna Sundari Katha Telugu", "3:12"],
  ["LIsjvwiYIpo", "O Re Oho Re Brahma Devuda", "Gunasundari Katha", "2:50"],
  ["ffbZNS5Djy0", "Englishulona Marriage", "Aradhana", "3:06"],
  ["t341XJ_GqwQ", "Bhale Ammayilu", "Bhale Ammayilu", "3:00"],
  ["fTpleujt75o", "Ee Mounam Ee Bidiyam", "Dr.Chakravarthy", "3:20"],
  ["vYhtRAP5cVk", "ఆకాశ వీధిలో అందాల జాబిలీ", "ANVITA RAM", "4:41"],
  ["lYodx3TXEKE", "Varinchi Vachina Manava Veerudu", "Jagadekaveeruni Katha", "3:08"],
  ["2jPUrZvt9pQ", "Oh Panchavannela Chilaka", "Appu Chesi Pappu Koodu", "3:02"],
  ["5Qekzan-hac", "Ninna Leni Andamedo", "Pooja Phalam", "3:33"],
  ["aFOi0WRvCas", "O Chamanti", "iDream Music", "3:43"],
  ["MMLiY8ZAWFk", "Gopala", "TeluguOne", "4:45"],
  ["Cf2E2FHBsQ4", "Bhale Ammayilu", "Bhale Ammayilu", "2:57"],
  ["8xTGmAuv5Ek", "Chaka Chaka", "TeluguOne", "2:47"],
  ["Y4ktKsCmvEU", "Bhale Ammayilu", "Bhale Ammayilu", "3:50"],
  ["hlrhFTJBep8", "NTR", "Oohalu Gusagusalade - Bandipotu Telugu", "3:27"],
  ["Bib3xP3PfOU", "Oho Andamaina", "Lakshadhikari", "2:53"],
  ["txvrda7KVB8", "Chakkani Dana Chikkani Dana", "Santhi Nivasam", "2:55"],
  ["HKmwEVE4cHw", "Nee Shoku Choodakunda", "Thodi Kodallu", "3:30"],
  ["Ejk3GItZq6A", "Kannulatho Palakarinchu", "iDream Music", "3:36"],
  ["LXR5YAC0ogY", "Chekkili Meeda Cheyi", "TeluguOne", "2:54"],
  ["9E-8oRhgdDg", "Yechati Nundi Veecheno", "Appu Chesi Pappu Koodu", "3:12"],
  ["RRZxCNNr-RQ", "Shiva Sankari Siva Nandha", "Jagadeka Veeruni Katha", "7:23"],
  ["bFh3TQQ3Z8w", "Ainadedo Ainadi", "Jagadekaveeruni Katha", "3:03"],
  ["CW0UYpGZv4s", "Jalakalatalalo", "Jagadekaveeruni Katha", "3:03"],
  ["2jrJtTcAiEQ", "Oh Sakhi Oho Cheli", "Jagadeka Veeruni Katha", "3:43"],
  ["7mu4-ePTppg", "Koppu Ninda Puvulu", "Jagadeka Veeruni Katha", "4:02"],
  ["WUr_FApeaNA", "Kolu Koloyamma", "Gundamma Katha", "3:06"],
  ["QMR8uXeQHGg", "Paramanandayya Sishyula Katha", "iDream Media", "4:14"],
  ["gkbFfqs5IhE", "Oho Basthi Dorasani", "Volga Video", "3:34"],
  ["YLKcmlqcV48", "Manoharamuga", "iDream Music", "4:19"],
  ["nfkNiSbeRqA", "Sari ganchu cheera", "TeluguOne", "3:46"],
  ["FL_r6QyUAow", "Ravoyi Maa Intiki", "Volga Video", "2:51"],
  ["hhPud-1FSaw", "Telisindi Le Telisindi Le", "Ramudu Bheemudu", "3:50"],
  ["cU9npq8foUY", "Talla Pellama", "Telugu Jaathi", "4:17"],
  ["LjZ-W9Ybhyw", "Manishi Maaraledu", "Gundamma Katha", "3:07"],
  ["0lSUGGmKpYU", "O Nelaraja from Bhatti Vikramarka", "Geetha Arts ", "3:26"],
  ["OSbiXuRhY0g", "Town Pakka Kellodhuraa", "Thodi Kodallu", "4:32"],
  ["8ck_Yp-dylM", "Adavalla Kopamlo", "Chaduvukunna Ammayilu", "3:24"],
  ["e7os6Ru_CuU", "NANNU DOCHUKUNDUVATE VANNELA DORASANI", "v9 Videos", "4:02"],
  ["ahLd6iiYabE", "Piluvakura", "Volga Video", "4:24"],
  ["kl5pW2ukseM", "Neevuleka Veena", "TeluguOne", "3:31"],
  ["PZFqP1LfXhY", "Anda Chandala", "Volga Video", "3:31"],
  ["RtxzVDGPBO0", "Naa Paata Nee Nota Palakala Silaka", "Volga Video", "5:05"],
];

export const playlists: Playlist[] = [
  {
    id: "telugu",
    key: "telugu",
    label: "Telugu",
    language: "telugu",
    title: "Nadaanian",
    accentLine: "Vibes Only",
    tagline: "A playlist full of feelings, memories and the songs that stay.",
    url: "https://youtube.com/playlist?list=RDgB_dBDdKRBc&playnext=1",
    listId: "RDgB_dBDdKRBc",
    songs: build("telugu", "telugu", teluguRaw),
  },
  {
    id: "hindi",
    key: "hindi",
    label: "Hindi",
    language: "hindi",
    title: "Nadaaniyan",
    accentLine: "Hindi Hearts",
    tagline: "Indie soft-pop and Bollywood melodies on endless repeat.",
    url: "https://youtube.com/playlist?list=RDHeBJMzrM7hU&playnext=1",
    listId: "RDHeBJMzrM7hU",
    songs: build("hindi", "hindi", hindiRaw),
  },
  {
    id: "sixties",
    key: "sixties",
    label: "60s Classics",
    language: "telugu",
    title: "Black & White",
    accentLine: "Golden Era",
    tagline: "1950s\u201360s Telugu classics \u2014 ANR, NTR, Savitri and timeless tunes.",
    url: "https://youtube.com/playlist?list=PLy-G82tlQppGdVHyz6Wz5Dx09hayh4wSd",
    listId: "PLy-G82tlQppGdVHyz6Wz5Dx09hayh4wSd",
    songs: build("sixties", "telugu", sixtiesRaw),
  },
];

export function getPlaylist(id: PlaylistId): Playlist {
  return playlists.find((p) => p.id === id) ?? playlists[0]!;
}

/** Look up a song *within* a playlist only — never across playlists. */
export function findSong(playlistId: PlaylistId, songId: string | null): Song | null {
  if (!songId) return null;
  const song = getPlaylist(playlistId).songs.find((s) => s.id === songId) ?? null;
  if (song && song.playlistId !== playlistId) return null;
  return song;
}

/** Dev-time integrity audit: unique ids, required fields, no cross-playlist leakage. */
export function validatePlaylists(): string[] {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  for (const pl of playlists) {
    const seenVideos = new Set<string>();
    if (pl.id !== pl.key) errors.push(`Playlist ${pl.id}: id/key mismatch`);
    pl.songs.forEach((s, i) => {
      const where = `${pl.id}[${i}] "${s.title}"`;
      if (!s.id) errors.push(`${where}: missing id`);
      if (seenIds.has(s.id)) errors.push(`${where}: duplicate song id ${s.id}`);
      seenIds.add(s.id);
      if (s.playlistId !== pl.id) errors.push(`${where}: playlistId ${s.playlistId} != ${pl.id}`);
      if (s.language !== pl.language) errors.push(`${where}: language ${s.language} != ${pl.language}`);
      if (!s.title) errors.push(`${where}: missing title`);
      if (!s.artist) errors.push(`${where}: missing artist`);
      if (!/^[\w-]{11}$/.test(s.youtubeVideoId)) errors.push(`${where}: bad youtubeVideoId "${s.youtubeVideoId}"`);
      if (seenVideos.has(s.youtubeVideoId)) errors.push(`${where}: duplicate videoId in playlist`);
      seenVideos.add(s.youtubeVideoId);
      if (!s.thumbnail.includes(s.youtubeVideoId)) errors.push(`${where}: thumbnail does not match its video`);
    });
  }
  // no video id may appear in two different playlists
  const owner = new Map<string, PlaylistId>();
  for (const pl of playlists) {
    for (const s of pl.songs) {
      const prev = owner.get(s.youtubeVideoId);
      if (prev && prev !== pl.id) errors.push(`Video ${s.youtubeVideoId} appears in both ${prev} and ${pl.id}`);
      owner.set(s.youtubeVideoId, pl.id);
    }
  }
  return errors;
}

if (import.meta.env.DEV) {
  const errors = validatePlaylists();
  if (errors.length) console.error("[playlist data] integrity errors:\n" + errors.join("\n"));
}
