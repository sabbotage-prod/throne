import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bqquqywzjednltcoqjwk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcXVxeXd6amVkbmx0Y29xandrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzAyMTIsImV4cCI6MjA4NDc0NjIxMn0.ziCeaTyKLL1_eZETkNlKMyHHm5LK3OUhV2iYLr9cduo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Category configuration
export const CATEGORIES = {
  Public: { bg: '#43A047', text: 'white', key: 'public' },
  Business: { bg: '#1E88E5', text: 'white', key: 'business' },
  Pay: { bg: '#FDD835', text: 'black', key: 'pay' }
};

// Amenity keys for translation
export const AMENITIES = [
  { key: 'changingTable', value: 'Changing Table' },
  { key: 'lactationRoom', value: 'Lactation Room' },
  { key: 'drinkingFountain', value: 'Drinking Fountain' },
  { key: 'mirrors', value: 'Mirrors' },
  { key: 'menstrualSupplies', value: 'Menstrual Supplies' },
  { key: 'genderless', value: 'Genderless' },
  { key: 'wheelchairAccessible', value: 'Wheelchair Accessible' },
  { key: 'urinal', value: 'Urinal' },
  { key: 'vendingMachine', value: 'Vending Machine' },
  { key: 'smellsNice', value: 'Smells Nice' },
  { key: 'handLotion', value: 'Hand Lotion' },
  { key: 'niceSpace', value: 'Nice Space' },
  { key: 'selfCleaning', value: 'Self-Cleaning' }
];

// Default spots (fallback if database is empty)
export const DEFAULT_SPOTS = [
  { id: 1, name: 'Champ de Mars', category: 'Public', address: 'Champ de Mars, 75007 Paris', lat: 48.8584, lng: 2.2945, rating: 4.0, hours: '06:00–22:00', description: 'Clean public facility near the Eiffel Tower.', amenities: ['Wheelchair Accessible', 'Changing Table', 'Mirrors'], reviews: 127 },
  { id: 2, name: 'Café de Flore', category: 'Business', address: '172 Bd Saint-Germain, 75006', lat: 48.8540, lng: 2.3325, rating: 4.5, hours: '07:00–01:30', description: 'Historic café with well-maintained restrooms.', amenities: ['Mirrors', 'Smells Nice', 'Nice Space', 'Hand Lotion'], reviews: 89 },
  { id: 3, name: 'Sanisettes Louvre', category: 'Public', address: 'Place du Carrousel, 75001', lat: 48.8606, lng: 2.3376, rating: 3.5, hours: '24h', description: 'Self-cleaning public toilet near the Louvre.', amenities: ['Wheelchair Accessible', 'Genderless', 'Self-Cleaning'], reviews: 203 },
  { id: 4, name: 'Galeries Lafayette', category: 'Business', address: '40 Bd Haussmann, 75009', lat: 48.8738, lng: 2.3320, rating: 5.0, hours: '09:30–20:30', description: 'Luxurious department store restrooms.', amenities: ['Wheelchair Accessible', 'Changing Table', 'Lactation Room', 'Mirrors', 'Hand Lotion', 'Smells Nice', 'Nice Space', 'Menstrual Supplies'], reviews: 312 },
  { id: 5, name: 'Luxembourg Gardens', category: 'Public', address: 'Jardin du Luxembourg, 75006', lat: 48.8462, lng: 2.3372, rating: 4.0, hours: '07:00–21:00', description: 'Public restroom in the beautiful Luxembourg Gardens.', amenities: ['Wheelchair Accessible', 'Changing Table', 'Drinking Fountain', 'Mirrors'], reviews: 156 },
  { id: 6, name: 'Gare du Nord', category: 'Pay', address: '18 Rue de Dunkerque, 75010', lat: 48.8809, lng: 2.3553, rating: 3.0, hours: '24h', description: 'Paid restrooms in the train station. €1 entry.', amenities: ['Wheelchair Accessible', 'Urinal', 'Mirrors', 'Vending Machine'], reviews: 445 },
  { id: 7, name: 'Le Marais Sanisette', category: 'Public', address: 'Rue des Francs Bourgeois, 75004', lat: 48.8572, lng: 2.3620, rating: 3.5, hours: '24h', description: 'Self-cleaning public toilet in Le Marais district.', amenities: ['Wheelchair Accessible', 'Genderless', 'Self-Cleaning'], reviews: 98 },
  { id: 8, name: 'Printemps', category: 'Business', address: '64 Bd Haussmann, 75009', lat: 48.8740, lng: 2.3280, rating: 4.5, hours: '10:00–20:00', description: 'Upscale department store facilities.', amenities: ['Wheelchair Accessible', 'Changing Table', 'Mirrors', 'Hand Lotion', 'Nice Space', 'Menstrual Supplies'], reviews: 178 },
  { id: 9, name: 'Point WC Champs-Élysées', category: 'Pay', address: '92 Av. des Champs-Élysées, 75008', lat: 48.8708, lng: 2.3032, rating: 4.0, hours: '08:00–22:00', description: 'Premium paid restroom. €1.50 entry.', amenities: ['Wheelchair Accessible', 'Changing Table', 'Mirrors', 'Hand Lotion', 'Smells Nice'], reviews: 267 }
];

export default supabase;
