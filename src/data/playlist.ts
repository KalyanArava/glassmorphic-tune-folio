export type Song = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  seconds: number;
  hue: number;
};

export type Playlist = {
  key: "telugu" | "hindi" | "sixties";
  label: string;
  title: string;
  accentLine: string;
  tagline: string;
  url: string;
  listId: string;
  songs: Song[];
};

type Raw = [string, string, string];

function build(raw: Raw[]): Song[] {
  return raw.map(([title, artist, duration], i) => {
    const parts = duration.split(":").map(Number);
    const m = parts[0] ?? 0;
    const s = parts[1] ?? 0;
    return {
      id: i + 1,
      title,
      artist,
      duration,
      seconds: m * 60 + s,
      hue: (i * 47 + 18) % 360,
    };
  });
}

const telugu: Raw[] = [
  ["Nee Choopule", "Endukante Premanta", "4:15"],
  ["Yemito", "Andala Rakshasi", "4:12"],
  ["Yenno Yenno", "Malli Malli Idi Rani Roju", "4:53"],
  ["Nammaka Tappani", "Bommarillu", "4:52"],
  ["Gusa Gusa Lade", "Gentleman", "4:17"],
  ["Nuvvante Na Navvu", "Krishnagaadi Veera Prema Gaadha", "4:38"],
  ["Yemi Cheyamanduve", "Priyuralu Pilichindi", "5:59"],
  ["Naa Cheli Rojaave", "Roja", "4:53"],
  ["Kallu Moosi Yoschisthey", "Veedokkade", "5:19"],
  ["Em Sandeham Ledu", "Oohalu Gusagusalade", "3:50"],
  ["Nee Paata Madhuram", "3 (Telugu)", "4:07"],
  ["Po Ve Po", "3 (Telugu)", "3:16"],
  ["Chinni Chinni Asalu", "Manam", "3:51"],
  ["Priyathama Priyathama", "Majili", "4:51"],
  ["Oosupodu", "Fidaa", "5:46"],
  ["Dhooram Dhooram", "100% Love", "5:06"],
  ["Atu Nuvve Itu Nuvve", "Current", "5:03"],
  ["Konte Chuputho", "Ananthapuram 1980", "5:39"],
  ["Nee Yadalo Naaku", "Awaara", "4:40"],
  ["Badhulu Thochani", "Mr. Perfect", "4:18"],
  ["Vaalu Kanuladaanaa", "Premikula Roju", "6:06"],
  ["Sutiga Choodaku", "Ishq", "5:18"],
  ["Adiga Adiga", "Ninnu Kori", "2:19"],
];

const hindi: Raw[] = [
  ["Nadaaniyan", "Akshath", "2:50"],
  ["Sahiba", "Aditya Rikhari, Ankita Chhetri", "3:04"],
  ["Heeriye", "Jasleen Royal ft. Arijit Singh", "3:19"],
  ["Maan Meri Jaan", "King", "4:19"],
  ["Sajni", "Arijit Singh, Ram Sampath", "2:26"],
  ["Tainu Khabar Nahi", "Arijit Singh · Munjya", "2:39"],
  ["Apna Bana Le", "Arijit Singh · Bhediya", "3:25"],
  ["Finding Her", "Kushagra, Bharath", "3:33"],
  ["Jo Tum Mere Ho", "Anuv Jain", "4:18"],
  ["Husn", "Anuv Jain", "4:00"],
  ["Ranjha", "B Praak, Jasleen Royal · Shershaah", "3:51"],
  ["Vaaste", "Dhvani Bhanushali, Nikhil D'Souza", "4:27"],
  ["Jaana Samjho Na", "Bhool Bhulaiyaa 3", "3:31"],
  ["Pasoori", "Ali Sethi x Shae Gill", "4:37"],
  ["Suniyan Suniyan", "Juss x MixSingh", "3:31"],
  ["Sahiba", "Jasleen Royal, Stebin Ben", "4:20"],
  ["Kesariya", "Arijit Singh · Brahmāstra", "4:22"],
  ["Jugraafiya", "Udit Narayan, Shreya Ghoshal · Super 30", "3:06"],
  ["Nayan", "Dhvani Bhanushali, Jubin Nautiyal", "5:59"],
  ["Mere Sohneya", "Sachet–Parampara · Kabir Singh", "3:12"],
];

const sixties: Raw[] = [
  ["Bhale Chance Le", "Illarikam (1959)", "3:43"],
  ["Niluvave Vaalu Kanula Daana", "Illarikam (1959)", "3:29"],
  ["Nedu Srivariki", "Illarikam (1959)", "3:24"],
  ["Yekkadi Dongalu", "Illarikam (1959)", "3:43"],
  ["Adigindaaniki Cheppi", "Illarikam (1959)", "5:26"],
  ["Lahiri Lahiri Lo", "Maya Bazar (1957)", "5:33"],
  ["Vinnava Yasodamma", "Maya Bazar (1957)", "4:10"],
  ["Aha Naa Pellianta", "Maya Bazar (1957)", "3:16"],
  ["Choopulu Kalasina Subhavela", "Maya Bazar (1957)", "3:02"],
  ["Neevena Nanu Thalachinadhi", "Maya Bazar (1957)", "2:35"],
  ["Vivaha Bhojanambu", "Maya Bazar (1957)", "3:05"],
  ["Sundari Nee Vanti Divya", "Maya Bazar (1957)", "3:05"],
  ["Kalavaramaye Madilo", "Maya Bazar (1957)", "2:51"],
  ["Yenthaghatu Premayo", "Patala Bhairavi (1951)", "3:44"],
  ["Vinave Baala", "Patala Bhairavi (1951)", "2:40"],
  ["Vagalo Vagalu", "Patala Bhairavi (1951)", "3:52"],
  ["Brindaavanamadi Andaridi", "Missamma (1955)", "2:40"],
  ["Ravoyi Chandamama", "Missamma (1955)", "2:40"],
  ["Avunante Kaadanile", "Missamma (1955)", "2:11"],
  ["Pagale Vennela", "Pooja Phalam (1964)", "3:09"],
  ["Naa Paata Nee Nota", "Mooga Manasulu (1964)", "5:05"],
  ["Neevuleka Veena", "Dr. Chakravarthy (1964)", "3:31"],
];

export const playlists: Playlist[] = [
  {
    key: "telugu",
    label: "Telugu",
    title: "Nadaanian",
    accentLine: "Vibes Only",
    tagline: "A playlist full of feelings, memories and the songs that stay.",
    url: "https://youtube.com/playlist?list=RDgB_dBDdKRBc&playnext=1",
    listId: "RDgB_dBDdKRBc",
    songs: build(telugu),
  },
  {
    key: "hindi",
    label: "Hindi",
    title: "Nadaaniyan",
    accentLine: "Hindi Hearts",
    tagline: "Indie soft-pop and Bollywood melodies on endless repeat.",
    url: "https://youtube.com/playlist?list=RDHeBJMzrM7hU&playnext=1",
    listId: "RDHeBJMzrM7hU",
    songs: build(hindi),
  },
  {
    key: "sixties",
    label: "60s Classics",
    title: "Black & White",
    accentLine: "Golden Era",
    tagline: "1950s–60s Telugu classics — ANR, NTR, Savitri and timeless tunes.",
    url: "https://youtube.com/playlist?list=PLy-G82tlQppGdVHyz6Wz5Dx09hayh4wSd",
    listId: "PLy-G82tlQppGdVHyz6Wz5Dx09hayh4wSd",
    songs: build(sixties),
  },
];

export const songs = playlists[0]!.songs;
