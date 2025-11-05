// IMPORTANT: Replace the placeholder values with your actual Firebase project configuration.
// Go to your Firebase project console -> Project Settings -> General -> Your apps -> SDK setup and configuration

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDsi6VpfhLQW8UWgAp5c4TRV7vqOkDyauU",
  authDomain: "stingressos-e0a5f.firebaseapp.com",
  projectId: "stingressos-e0a5f",
  storageBucket: "stingressos-e0a5f.firebasestorage.app",
  messagingSenderId: "424186734009",
  appId: "1:424186734009:web:c4f601ce043761cd784268",
  measurementId: "G-M30E0D9TP2"
};

// Check if the config has been filled out
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app, db, storage;

if (isFirebaseConfigured) {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
}

const initializeContent = async () => {
  if (!db) return;
  
  const contentRef = doc(db, "siteContent", "main");
  const contentSnap = await getDoc(contentRef);

  if (!contentSnap.exists()) {
    console.log("No initial content found, creating default documents...");
    const defaultContent = {
        hero: {
            title: "Bem-vindo ao Flora Café",
            subtitle: "Um oásis de sabores e tranquilidade no coração de Eusébio.",
            imageUrl: "/placeholder-hero.jpg"
        },
        about: {
            title: "Um Café Nascido da Paixão",
            paragraph: "O Flora Café Eusébio nasceu do sonho de criar um refúgio acolhedor, onde o aroma do café fresco se mistura com a beleza da natureza. Utilizamos ingredientes locais e de alta qualidade para criar pratos e bebidas que encantam o paladar."
        },
        gallery: {
            title: "Nossos Momentos"
        },
        reservations: {
            title: "Faça sua Reserva",
            paragraph: "Garanta seu lugar em nosso café. Preencha o formulário abaixo e nossa equipe entrará em contato para confirmar sua reserva."
        },
        location: {
            title: "Nossa Localização",
            address: "Rua Fictícia, 123 - Centro, Eusébio - CE",
            hours: "Seg - Sáb: 8:00 - 20:00 | Dom: 9:00 - 18:00",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15926.417031154388!2d-38.46011382509156!3d-3.868770742512613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c751a02157e84b%3A0x6734c5679a1f3c10!2sEus%C3%A9bio%2C%20CE!5e0!3m2!1spt-BR!2sbr!4v1689182342893!5m2!1spt-BR!2sbr"
        },
        contact: {
            title: "Fale Conosco",
            paragraph: "Tem alguma dúvida ou sugestão? Nos envie uma mensagem.",
            phone: "(85) 91234-5678",
            email: "contato@floracafeeusebio.com",
            instagramUrl: "https://instagram.com",
            facebookUrl: "https://facebook.com"
        }
    };
    await setDoc(contentRef, defaultContent);
  }

  const menuRef = collection(db, "menuItems");
  const menuSnap = await getDocs(menuRef);
  if (menuSnap.empty) {
    console.log("Menu is empty, adding default items.");
    const defaultMenu = [
        { name: 'Espresso', description: 'Café forte e encorpado.', price: 5.00, category: 'Cafés', imageUrl: '/placeholder-espresso.jpg' },
        { name: 'Cappuccino', description: 'Espresso, leite vaporizado e espuma de leite.', price: 8.00, category: 'Cafés', imageUrl: '/placeholder-cappuccino.jpg' },
        { name: 'Pão de Queijo', description: 'Tradicional pão de queijo mineiro.', price: 4.00, category: 'Salgados', imageUrl: '/placeholder-pao-de-queijo.jpg' },
    ];
    for (const item of defaultMenu) {
        await setDoc(doc(collection(db, "menuItems")), item);
    }
  }
};


if (isFirebaseConfigured) {
    initializeContent();
}

export { db, storage };
