import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { SiteContent } from "./types";

// IMPORTANT: Replace with your web app's Firebase configuration.
// You can get this from the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyDsi6VpfhLQW8UWgAp5c4TRV7vqOkDyauU",
  authDomain: "stingressos-e0a5f.firebaseapp.com",
  projectId: "stingressos-e0a5f",
  storageBucket: "stingressos-e0a5f.firebasestorage.app",
  messagingSenderId: "424186734009",
  appId: "1:424186734009:web:c4f601ce043761cd784268",
  measurementId: "G-M30E0D9TP2"
};

// A simple check to see if the config is still using placeholder values.
export const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyCI1FJC9lFcUOGazyowYlsdZnTRKRItsGY";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const defaultContent: SiteContent = {
    hero: { title: "Bem-vindo ao Flora Café", subtitle: "O seu refúgio de sabores e aromas no coração do Eusébio.", imageUrl: "/placeholder-hero.jpg" },
    about: { title: "Nossa Paixão por Café", paragraph: "No Flora Café, cada grão conta uma história. Nascemos do desejo de criar um espaço acolhedor onde a qualidade do café e o calor humano se encontram. Selecionamos os melhores grãos, preparamos cada bebida com perfeição e servimos com um sorriso. Somos mais que uma cafeteria, somos um ponto de encontro para amigos, um refúgio para os amantes de café e um pedaço da sua rotina diária.", imageUrl: "/placeholder-about.jpg" },
    gallery: { title: "Nossos Momentos" },
    reservations: { title: "Faça sua Reserva", paragraph: "Garanta seu lugar em nosso cantinho especial. Preencha o formulário abaixo." },
    location: { title: "Onde nos Encontrar", address: "Rua Exemplo, 123, Eusébio, CE", hours: "Segunda a Sábado, das 8h às 20h", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.339218089633!2d-38.4907366852408!3d-3.732742997275463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74630f9a1f0a7%3A0x53c33f218205776!2sPra%C3%A7a%20do%20Polo%20de%20Lazer!5e0!3m2!1spt-BR!2sbr!4v1689882956281!5m2!1spt-BR!2sbr" },
    contact: { title: "Entre em Contato", paragraph: "Dúvidas, sugestões ou apenas um oi? Adoramos ouvir você.", phone: "(85) 91234-5678", email: "contato@floracafeeusebio.com", instagramUrl: "https://instagram.com", facebookUrl: "https://facebook.com" },
};

// Function to initialize default content if it doesn't exist
export const initializeContent = async () => {
    const contentRef = doc(db, 'siteContent', 'main');
    const contentSnap = await getDoc(contentRef);
    if (!contentSnap.exists()) {
        console.log("No site content found, initializing with default data...");
        await setDoc(contentRef, defaultContent);
    }
    const categoriesRef = collection(db, 'menuCategories');
    const categoriesSnap = await getDocs(categoriesRef);
    if (categoriesSnap.empty) {
        console.log("No menu categories found, creating defaults...");
        await setDoc(doc(categoriesRef, 'cafes'), { name: 'Cafés' });
        await setDoc(doc(categoriesRef, 'salgados'), { name: 'Salgados' });
    }
};

// Run initialization
if (isFirebaseConfigured) {
    initializeContent();
}

export { db, auth, storage };
